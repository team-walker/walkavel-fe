import type { User } from '@supabase/supabase-js';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setInitialized: (initialized: boolean) => void;
  clearAuth: () => void;
}

/**
 * Supabase 인증 상태를 관리하는 UI 전역 스토어
 * 실제 토큰(JWT) 정보는 Supabase SDK가 내부적으로 관리하므로
 * 이곳에서는 사용자 프로필과 초기화 상태만 관리합니다.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitialized: false,
  setUser: (user) => set({ user }),
  setInitialized: (initialized) => set({ isInitialized: initialized }),
  clearAuth: () => set({ user: null }),
}));
