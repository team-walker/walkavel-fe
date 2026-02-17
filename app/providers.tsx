'use client';

import React, { useEffect } from 'react';

import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { useStampStore } from '@/store/stampStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setInitialized } = useAuthStore();
  const fetchStamps = useStampStore((state) => state.fetchStamps);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchStamps();
      }
      setInitialized(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchStamps();
      } else {
        // 로그아웃 시 스탬프 목록 초기화 (선택 사항)
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setInitialized, fetchStamps]);

  return <>{children}</>;
}
