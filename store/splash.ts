import { create } from 'zustand';

interface SplashStore {
  isVisible: boolean;
  hideSplash: () => void;
}

export const useSplashStore = create<SplashStore>((set) => ({
  isVisible: true, // 초기값: 스플래시 표시
  hideSplash: () => set({ isVisible: false }),
}));
