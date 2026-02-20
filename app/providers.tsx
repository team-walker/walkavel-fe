'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import { useBookmark } from '@/hooks/useBookmark';
import { useStamp } from '@/hooks/useStamp';
import { supabase } from '@/lib/supabase/client';
import { showErrorToast, showSuccessToast } from '@/lib/utils/toast';
import { useAuthStore } from '@/store/authStore';
import { useBookmarkStore } from '@/store/bookmarkStore';
import { useExploreStore } from '@/store/exploreStore';
import { useStampStore } from '@/store/stampStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setInitialized } = useAuthStore();
  const { fetchStamps } = useStamp();
  const { fetchBookmarks } = useBookmark();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            cacheTime: 1000 * 60 * 30,
          },
        },
      }),
  );

  useEffect(() => {
    const handleOnline = () => showSuccessToast('네트워크가 다시 연결되었습니다.');
    const handleOffline = () =>
      showErrorToast('현재 오프라인 상태입니다. 일부 기능이 제한될 수 있습니다.');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchStamps();
        fetchBookmarks();
      }
      setInitialized(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchStamps();
        fetchBookmarks();
      } else {
        useBookmarkStore.getState().clearBookmarks();
        useStampStore.getState().clearStamps();
        useExploreStore.getState().resetExplore();
        queryClient.clear();
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setInitialized, fetchStamps, fetchBookmarks, queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
