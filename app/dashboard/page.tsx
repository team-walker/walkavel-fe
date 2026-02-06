'use client';

import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase/client';

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const fetchSession = async (): Promise<void> => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (session) {
        setEmail(session.user.email ?? null);
        setToken(session.access_token);
      }
    };

    fetchSession();
  }, []);

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

      const data = (await res.json()) as Record<string, unknown>;
      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Backend error:', err.message);
      }
      alert('백엔드 호출 실패');
    }
  };

  return (
    <div className="space-y-4 p-10 text-black">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p>이메일: {email}</p>

      <div className="rounded bg-gray-100 p-3 text-sm break-all text-gray-600">토큰: {token}</div>

      <button onClick={callBackend} className="rounded bg-black px-4 py-2 font-medium text-white">
        백엔드 인증 테스트
      </button>

      {result && (
        <pre className="overflow-auto rounded bg-gray-100 p-4 text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
