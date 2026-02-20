import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/types';
import { AddressResult } from '@/types/address';

interface RegionState {
  selectedRegion: AddressResult | null;
  _hasHydrated: boolean;
  setRegion: (region: AddressResult) => void;
  clearRegion: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useRegionStore = create<RegionState>()(
  persist(
    (set) => ({
      selectedRegion: null,
      _hasHydrated: false,
      setRegion: (region) => set({ selectedRegion: region }),
      clearRegion: () => set({ selectedRegion: null }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: STORAGE_KEYS.REGION_STORAGE,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
