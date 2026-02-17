'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useLoginLogic } from '@/hooks/useLoginLogic';
import { supabase } from '@/lib/supabase/client';
import ChevronRightIcon from '@/public/images/chevron-right.svg';
import LogoutIcon from '@/public/images/logout.svg';
import ProfileIcon from '@/public/images/profile.svg';
import { useAuthStore } from '@/store/authStore';

export default function MyPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { handleLogout } = useLoginLogic();

  const userMetadata = user?.user_metadata;
  const initialNickname = userMetadata?.full_name || userMetadata?.name || '사용자';
  const initialAvatar = userMetadata?.avatar_url || userMetadata?.picture || '';

  const [profile, setProfile] = useState<{ nickname: string; avatar_url: string }>({
    nickname: initialNickname,
    avatar_url: initialAvatar,
  });

  useEffect(() => {
    if (!user) return;

    const fetchLatestProfile = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('nickname, avatar_url')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        const metadata = user.user_metadata;
        const nicknameFallback = metadata?.full_name || metadata?.name || '사용자';
        const avatarFallback = metadata?.avatar_url || metadata?.picture || '';

        const latestProfile = {
          nickname: data.nickname || nicknameFallback,
          avatar_url: data.avatar_url || avatarFallback,
        };
        setProfile(latestProfile);

        if (data.nickname !== metadata?.full_name || data.avatar_url !== metadata?.avatar_url) {
          const { data: authData } = await supabase.auth.updateUser({
            data: {
              nickname: data.nickname,
              full_name: data.nickname,
              avatar_url: data.avatar_url,
            },
          });
          if (authData?.user) setUser(authData.user);
        }
      }
    };

    fetchLatestProfile();
  }, [user, setUser]);

  const nickname = profile.nickname;
  const avatarUrl = profile.avatar_url;
  const email = user?.email || '';

  return (
    <div className="w-full flex-1 overflow-y-auto bg-[#FAFBFC] pt-[env(safe-area-inset-top)] pb-24">
      <div className="bg-white px-6 pt-8 pb-6">
        <h1 className="mb-6 text-[28px] font-bold text-gray-900">마이페이지</h1>

        <Button
          variant="ghost"
          onClick={() => router.push('/mypage/edit')}
          className="-mx-2 flex h-18 w-full cursor-pointer items-center space-x-3 rounded-2xl px-2 py-2 transition-colors hover:bg-gray-50 active:bg-gray-100"
        >
          <div className="h-14 w-14 shrink-0 rounded-full bg-linear-to-br from-[#3182F6] to-[#1B64DA] p-0.5 shadow-sm">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  width={52}
                  height={52}
                />
              ) : (
                <ProfileIcon width={28} height={28} className="text-gray-400" />
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1 text-left">
            <h2 className="mb-0.5 text-[18px] font-bold text-gray-900">{nickname}</h2>
            <p className="truncate text-[13px] text-gray-500">{email}</p>
          </div>
          <ChevronRightIcon width={24} height={24} className="shrink-0 text-gray-400" />
        </Button>
      </div>

      <div className="bg-white pt-6 pb-8">
        <div className="px-6">
          <h2 className="mb-4 text-[15px] font-bold text-gray-500">설정</h2>

          <Button
            variant="ghost"
            className="flex h-14 w-full cursor-pointer items-center justify-center rounded-3xl px-5 py-4 text-[15px] font-medium text-gray-500 transition-colors hover:bg-gray-50 active:bg-gray-100"
            onClick={handleLogout}
          >
            <LogoutIcon width={20} height={20} className="mr-2" />
            로그아웃
          </Button>

          <div className="mt-6 text-center">
            <p className="text-[13px] text-gray-400">
              버전 {process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
