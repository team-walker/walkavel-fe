'use client';

import { createClient, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data } = await supabase
          .from('users')
          .select('nickname, avatar_url')
          .eq('id', session.user.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    };
    load();
  }, []);

  const login = async (provider: 'google' | 'github' | 'kakao') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: 'http://localhost:3000/auth/login' },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  if (loading)
    return <div className="flex min-h-screen items-center justify-center">로딩중...</div>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-black">
      <div className="w-[400px] space-y-4 rounded border p-6 shadow">
        <h1 className="text-center text-xl font-bold">로그인 / 계정</h1>
        {!user ? (
          <div className="space-y-3">
            <button
              onClick={() => login('google')}
              className="w-full rounded bg-red-500 py-2 text-white"
            >
              Google 로그인
            </button>
            <button
              onClick={() => login('github')}
              className="w-full rounded bg-gray-800 py-2 text-white"
            >
              GitHub 로그인
            </button>
            <button
              onClick={() => login('kakao')}
              className="w-full rounded bg-yellow-400 py-2 text-black"
            >
              Kakao 로그인
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center">
              {profile?.avatar_url && (
                <img
                  src={profile.avatar_url}
                  alt="프로필 사진"
                  className="h-20 w-20 rounded-full object-cover"
                />
              )}
            </div>
            <p>
              <b>이메일:</b> {user.email}
            </p>
            <p>
              <b>닉네임:</b> {profile?.nickname}
            </p>
            <div className="space-y-2 pt-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full rounded bg-blue-500 py-2 text-white"
              >
                대시보드 가기
              </button>
              <button
                onClick={() => router.push('/mypage')}
                className="w-full rounded bg-green-500 py-2 text-white"
              >
                정보 수정
              </button>
              <button onClick={logout} className="w-full rounded bg-red-500 py-2 text-white">
                로그아웃
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
