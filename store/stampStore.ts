import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/types';
import { StampSummaryDto } from '@/types/model';

interface StampState {
  collectedIds: Record<number, boolean>;
  summary: StampSummaryDto | null;
  isSyncing: boolean;
  requestingIds: number[];
  failedIds: number[];

  setSyncing: (isSyncing: boolean) => void;
  setSummary: (summary: StampSummaryDto) => void;
  setCollectedIds: (ids: Record<number, boolean>) => void;
  setCollectedLocally: (landmarkId: number) => void;
  isCollected: (landmarkId: number) => boolean;
  resetFailedState: (landmarkId: number) => void;
  setRequesting: (landmarkId: number, isRequesting: boolean) => void;
  setFailed: (landmarkId: number) => void;
  clearStamps: () => void;
}

export const useStampStore = create<StampState>()(
  persist(
    (set, get) => ({
      collectedIds: {},
      summary: null,
      isSyncing: false,
      requestingIds: [],
      failedIds: [],

      setSyncing: (isSyncing) => set({ isSyncing }),
      setSummary: (summary) => set({ summary }),
      setCollectedIds: (collectedIds) => set({ collectedIds }),

      setCollectedLocally: (landmarkId) => {
        set((state) => ({
          collectedIds: { ...state.collectedIds, [landmarkId]: true },
        }));
      },

      isCollected: (landmarkId) => {
        const ids = get().collectedIds;
        return !!ids[landmarkId];
      },

      resetFailedState: (landmarkId) => {
        set((state) => ({
          failedIds: state.failedIds.filter((id) => id !== landmarkId),
        }));
      },

      setRequesting: (landmarkId, isRequesting) => {
        set((state) => ({
          requestingIds: isRequesting
            ? [...state.requestingIds, landmarkId]
            : state.requestingIds.filter((id) => id !== landmarkId),
        }));
      },

      setFailed: (landmarkId) => {
        set((state) => ({
          failedIds: [...state.failedIds, landmarkId],
        }));
      },
      clearStamps: () => set({ collectedIds: {}, summary: null, requestingIds: [], failedIds: [] }),
    }),
    {
      name: STORAGE_KEYS.STAMP_STORAGE,
      partialize: (state) => ({ collectedIds: state.collectedIds }),
    },
  ),
);
