import type { User } from '@supabase/supabase-js';
import { create } from 'zustand';

interface PendingAction {
  type: 'bookmark';
  payload: { landmarkId: number };
}

interface AuthState {
  user: User | null;
  isInitialized: boolean;
  returnTo: string | null;
  pendingAction: PendingAction | null;
  setUser: (user: User | null) => void;
  setInitialized: (initialized: boolean) => void;
  setReturnTo: (path: string | null) => void;
  setPendingAction: (action: PendingAction | null) => void;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitialized: false,
  returnTo: null,
  pendingAction: null,
  setUser: (user) => set({ user }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  setReturnTo: (path) => set({ returnTo: path }),
  setPendingAction: (pendingAction) => set({ pendingAction }),
  resetAuth: () => set({ user: null, returnTo: null, pendingAction: null }),
}));
