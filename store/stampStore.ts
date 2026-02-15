import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/types';
import { getApi } from '@/types/api';

interface StampState {
  collectedIds: Record<number, boolean>; // O(1) 조회를 위해 객체 맵 사용
  isSyncing: boolean; // API 동기화 상태

  fetchStamps: () => Promise<void>;
  addStamp: (landmarkId: number) => Promise<void>;
  isCollected: (landmarkId: number) => boolean;
}

// 사용자가 획득한 스탬프 목록을 브라우저에 저장하여, 다시 방문했을 때도 [수집 완료] 상태를 유지하게 합니다.
export const useStampStore = create<StampState>()(
  persist(
    (set, get) => ({
      collectedIds: {},
      isSyncing: false,
      // 서버에서 획득한 스탬프 목록 가져오기 (초기화 시 호출)
      fetchStamps: async () => {
        set({ isSyncing: true });
        try {
          const api = getApi();
          const response = await api.userControllerGetMyStampSummary();
          const idMap = response.landmarks.reduce(
            (acc, landmark) => ({
              ...acc,
              [landmark.contentid]: true,
            }),
            {},
          );
          set({ collectedIds: idMap });
        } finally {
          set({ isSyncing: false });
        }
      },
      addStamp: async (landmarkId) => {
        if (get().isCollected(landmarkId)) return; // 이미 수집된 스탬프는 무시
        try {
          const api = getApi();
          await api.tourControllerCreateStamp({ landmarkId: landmarkId });

          set((state) => ({
            collectedIds: { ...state.collectedIds, [landmarkId]: true },
          }));
        } catch (error) {
          console.error('스탬프 획득 실패:', error);
        }
      },
      isCollected: (landmarkId) => !!get().collectedIds[landmarkId],
    }),
    {
      name: STORAGE_KEYS.STAMP_STORAGE,
    },
  ),
);
