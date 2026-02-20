import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { supabase } from '@/lib/supabase/client';
import { showErrorToast, showSuccessToast } from '@/lib/utils/toast';
import { useAuthStore } from '@/store/authStore';
import { useExploreStore } from '@/store/exploreStore';
import { useRegionStore } from '@/store/regionStore';

export const useLoginLogic = () => {
  const router = useRouter();
  const { returnTo, setReturnTo, resetAuth } = useAuthStore();
  const { resetExplore } = useExploreStore();
  const { clearRegion } = useRegionStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOAuthLogin = async (provider: 'google' | 'kakao') => {
    setLoading(true);
    setError(null);

    const siteUrl =
      typeof window !== 'undefined' ? window.location.origin : 'https://walkavel.vercel.app';

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${siteUrl}/callback?returnTo=${encodeURIComponent(returnTo || '/')}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      console.error('Login error:', error);
      const message =
        error instanceof Error
          ? error.message
          : (error as { message?: string })?.message || '로그인 중 문제가 발생했습니다.';
      setError(message);
      showErrorToast(message);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      resetAuth();
      resetExplore();
      clearRegion();

      showSuccessToast('로그아웃되었습니다.');
      router.replace('/');
    } catch (error: unknown) {
      console.error('Logout error:', error);
      const message =
        error instanceof Error
          ? error.message
          : (error as { message?: string })?.message || '로그아웃 중 오류가 발생했습니다.';
      showErrorToast(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    resetExplore();
    clearRegion();
    setReturnTo('/');
    router.replace('/');
  };

  return {
    handleOAuthLogin,
    handleGuestLogin,
    handleLogout,
    loading,
    error,
    returnTo,
  };
};
