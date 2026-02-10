import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STEP } from '@/constants/types';
import { LandmarkDto } from '@/types/model';

interface ExploreState {
  step: STEP;
  landmarks: LandmarkDto[];
  currentIndex: number;
  _hasHydrated: boolean;
  setStep: (step: STEP) => void;
  setLandmarks: (landmarks: LandmarkDto[]) => void;
  setCurrentIndex: (index: number | ((prev: number) => number)) => void;
  setHasHydrated: (state: boolean) => void;
  resetExplore: () => void;
}

export const useExploreStore = create<ExploreState>()(
  persist(
    (set) => ({
      step: 'SEARCH',
      landmarks: [],
      currentIndex: 0,
      _hasHydrated: false,
      setStep: (step) => set({ step }),
      setLandmarks: (landmarks) => set({ landmarks }),
      setCurrentIndex: (index) =>
        set((state) => ({
          currentIndex: typeof index === 'function' ? index(state.currentIndex) : index,
        })),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      resetExplore: () => set({ step: 'SEARCH', landmarks: [], currentIndex: 0 }),
    }),
    {
      name: 'walkavel-explore-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
