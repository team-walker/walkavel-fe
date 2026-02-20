import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STEP, STORAGE_KEYS } from '@/constants/types';
import { LandmarkDto } from '@/types/model';

interface Location {
  latitude: number;
  longitude: number;
}

interface ExploreState {
  step: STEP;
  landmarks: LandmarkDto[];
  currentIndex: number;
  _hasHydrated: boolean;
  isExploring: boolean;
  userLocation: Location | null;
  distanceToTarget: number | null;
  setStep: (step: STEP) => void;
  setLandmarks: (landmarks: LandmarkDto[]) => void;
  setCurrentIndex: (index: number | ((prev: number) => number)) => void;
  setHasHydrated: (state: boolean) => void;
  resetExplore: () => void;
  setIsExploring: (isExploring: boolean) => void;
  setUserLocation: (location: Location | null) => void;
  setDistanceToTarget: (distance: number | null) => void;
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
      isExploring: false,
      userLocation: null,
      distanceToTarget: null,
      setIsExploring: (isExploring) => set({ isExploring }),
      setUserLocation: (location) => set({ userLocation: location }),
      setDistanceToTarget: (distance) => set({ distanceToTarget: distance }),
    }),
    {
      name: STORAGE_KEYS.EXPLORE_STORAGE,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
