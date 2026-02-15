import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/types';

interface StampState {
  collectedIds: number[];
  addStamp: (id: number) => void;
  isCollected: (id: number) => boolean;
}

// 사용자가 획득한 스탬프 목록을 브라우저에 저장하여, 다시 방문했을 때도 [수집 완료] 상태를 유지하게 합니다.
export const useStampStore = create<StampState>()(
  persist(
    (set, get) => ({
      collectedIds: [],
      addStamp: (id) => {
        if (!get().isCollected(id)) {
          set((state) => ({ collectedIds: [...state.collectedIds, id] }));
        }
      },
      isCollected: (id) => get().collectedIds.includes(id),
    }),
    {
      name: STORAGE_KEYS.STAMP_STORAGE,
    },
  ),
);
