import { create } from 'zustand';

interface SplashStore {
  isVisible: boolean;
  hideSplash: () => void;
}

export const useSplashStore = create<SplashStore>((set) => ({
  isVisible: true,
  hideSplash: () => set({ isVisible: false }),
}));
