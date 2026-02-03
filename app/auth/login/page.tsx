'use client';

import { createClient, User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

// Supabase env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  // any ❌ → User | null ✅
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  // 세션 감지
  useEffect(() => {
    // 현재 세션 조회
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // OAuth 로그인
  const login = async (provider: 'google' | 'github'): Promise<void> => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  // 로그아웃
  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">Supabase OAuth Test</h1>

      {user ? (
        <>
          <p className="text-sm text-gray-600">{user.email}</p>

          <button onClick={logout} className="rounded bg-gray-200 px-4 py-2">
            Logout
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => login('google')}
            disabled={loading}
            className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          >
            Google Login
          </button>

          <button
            onClick={() => login('github')}
            disabled={loading}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            GitHub Login
          </button>
        </>
      )}
    </div>
  );
}
