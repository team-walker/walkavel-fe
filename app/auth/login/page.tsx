'use client';

import { AuthChangeEvent, createClient, Session, User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

// env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // 세션 체크
  useEffect(() => {
    const loadSession = async (): Promise<void> => {
      const { data } = await supabase.auth.getSession();

      setUser(data.session?.user ?? null);
      setToken(data.session?.access_token ?? null);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 로그인 (Kakao 포함)
  const login = async (provider: 'google' | 'github' | 'kakao'): Promise<void> => {
    try {
      setLoading(true);

      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Login error:', err.message);
      } else {
        console.error('Login error:', err);
      }

      alert('로그인 실패');
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃
  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
    setToken(null);
  };

  // 토큰 콘솔 출력
  const showToken = (): void => {
    console.log('ACCESS TOKEN:', token);
    alert('콘솔 확인');
  };

  // Nest API 호출
  const callBackend = async (): Promise<void> => {
    if (!token) {
      alert('토큰 없음');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: unknown = await res.json();

      console.log('BACKEND:', data);
      alert('콘솔 확인');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error(err);
      }

      alert('백엔드 호출 실패');
    }
  };

  // 이메일 없을 때 대비
  const getUserLabel = (): string => {
    if (!user) return '';

    return user.email || user.user_metadata?.email || user.user_metadata?.nickname || user.id;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Supabase OAuth Test</h1>

      {user ? (
        <>
          {/* 사용자 정보 */}
          <p className="text-sm text-gray-600">{getUserLabel()}</p>

          <button onClick={showToken} className="rounded bg-gray-200 px-4 py-2">
            토큰 보기
          </button>

          <button onClick={callBackend} className="rounded bg-green-500 px-4 py-2 text-white">
            백엔드 호출
          </button>

          <button onClick={logout} className="rounded bg-red-400 px-4 py-2 text-white">
            Logout
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => login('google')}
            disabled={loading}
            className="rounded bg-blue-500 px-4 py-2 text-white"
          >
            Google Login
          </button>

          <button
            onClick={() => login('github')}
            disabled={loading}
            className="rounded bg-black px-4 py-2 text-white"
          >
            GitHub Login
          </button>

          <button
            onClick={() => login('kakao')}
            disabled={loading}
            className="rounded bg-yellow-400 px-4 py-2 text-black"
          >
            Kakao Login
          </button>
        </>
      )}
    </div>
  );
}
