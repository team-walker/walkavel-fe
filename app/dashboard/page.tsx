'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  // 세션 가져오기
  useEffect(() => {
    const fetchSession = async (): Promise<void> => {
      const { data } = await supabase.auth.getSession();

      const session = data.session;

      if (session) {
        setEmail(session.user.email ?? null);
        setToken(session.access_token);

        console.log('Access Token:', session.access_token);
      }
    };

    fetchSession();
  }, []);

  // 백엔드 테스트
  const callBackend = async (): Promise<void> => {
    if (!token) {
      alert('토큰 없음');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      // ✅ JSON 타입 명시
      const data = (await res.json()) as Record<string, unknown>;

      setResult(data);

      console.log('Backend Response:', data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Backend error:', err.message);
      } else {
        console.error('Backend error:', err);
      }

      alert('백엔드 호출 실패');
    }
  };

  return (
    <div className="space-y-4 p-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p>이메일: {email}</p>

      <div className="rounded bg-gray-100 p-3 text-sm break-all">토큰: {token}</div>

      <button onClick={callBackend} className="rounded bg-black px-4 py-2 text-white">
        백엔드 인증 테스트
      </button>

      {result && (
        <pre className="rounded bg-gray-100 p-4 text-sm">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
