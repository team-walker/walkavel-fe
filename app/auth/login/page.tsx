'use client';

import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase/client';

interface UserProfile {
  nickname: string;
  avatar_url: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          setUser(session.user);
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('nickname, avatar_url')
            .eq('id', session.user.id)
            .single();

          if (!profileError) {
            setProfile(profileData);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
        alert(`세션을 불러오는 중 오류가 발생했습니다: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const login = async (provider: 'google' | 'kakao') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/login` },
      });
      if (error) throw error;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.';
      alert(`${provider} 로그인 중 에러가 발생했습니다: ${errorMessage}`);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      location.reload();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '로그아웃 중 오류가 발생했습니다.';
      alert(`로그아웃 실패: ${errorMessage}`);
    }
  };

  if (loading)
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-black">
      <div className="w-[400px] space-y-4 rounded border p-6 shadow">
        <h1 className="text-center text-xl font-bold">소셜로그인</h1>
        {!user ? (
          <div className="space-y-3">
            <button
              onClick={() => login('google')}
              className="w-full rounded bg-red-500 py-2 font-medium text-white"
            >
              Google 로그인
            </button>
            <button
              onClick={() => login('kakao')}
              className="w-full rounded bg-yellow-400 py-2 font-medium text-black"
            >
              Kakao 로그인
            </button>
          </div>
        ) : (
          <div className="space-y-3 text-center">
            <div className="flex justify-center">
              {profile?.avatar_url && (
                <div className="relative h-20 w-20">
                  <Image
                    src={profile.avatar_url}
                    alt="Profile"
                    fill
                    className="rounded-full border object-cover"
                    priority
                  />
                </div>
              )}
            </div>
            <div className="space-y-1 text-left">
              <p>
                <b>이메일:</b> {user.email}
              </p>
              <p>
                <b>닉네임:</b> {profile?.nickname || '정보 없음'}
              </p>
            </div>
            <div className="space-y-2 pt-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full rounded bg-blue-500 py-2 font-medium text-white"
              >
                대시보드
              </button>
              <button
                onClick={() => router.push('/mypage')}
                className="w-full rounded bg-green-500 py-2 font-medium text-white"
              >
                정보 수정
              </button>
              <button
                onClick={logout}
                className="w-full rounded bg-red-500 py-2 font-medium text-white"
              >
                로그아웃
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
