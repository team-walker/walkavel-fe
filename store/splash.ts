import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/types';
interface SplashStore {
  isVisible: boolean;
  _hasHydrated: boolean;
  hideSplash: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useSplashStore = create<SplashStore>()(
  persist(
    (set) => ({
      isVisible: true,
      _hasHydrated: false,
      hideSplash: () => set({ isVisible: false }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: STORAGE_KEYS.SPLASH_STORAGE,
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
