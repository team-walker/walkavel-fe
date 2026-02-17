import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/types';
import { getApi } from '@/types/api';

interface StampState {
  collectedIds: Record<number, boolean>; // O(1) 조회를 위해 객체 맵 사용
  isSyncing: boolean; // API 동기화 상태
  requestingIds: Set<number>; // 중복 요청 방지를 위한 상태 추가
  failedIds: Set<number>; // 500 에러 등 실패한 ID 기록 (무한 재요청 방지)

  fetchStamps: () => Promise<void>;
  addStamp: (landmarkId: number) => Promise<void>;
  setCollectedLocally: (landmarkId: number) => void;
  isCollected: (landmarkId: number) => boolean;
  resetFailedState: (landmarkId: number) => void;
}

// 진동(Vibration) 피드백을 스탬프 추가 액션에 통합하여 비즈니스 로직과 피드백을 단일 지점에서 관리하도록 했습니다.
export const useStampStore = create<StampState>()(
  persist(
    (set, get) => ({
      collectedIds: {},
      isSyncing: false,
      requestingIds: new Set(),
      failedIds: new Set(),
      // 서버에서 획득한 스탬프 목록 가져오기 (초기화 시 호출)
      fetchStamps: async () => {
        set({ isSyncing: true });
        try {
          const api = getApi();
          const response = await api.userControllerGetMyStampSummary();
          const idMap: Record<number, boolean> = {};
          response.landmarks.forEach((landmark) => {
            idMap[landmark.contentid] = true;
          });
          set({ collectedIds: idMap });
        } catch (error) {
          console.error('스탬프 목록 로드 실패:', error);
        } finally {
          set({ isSyncing: false });
        }
      },
      addStamp: async (landmarkId) => {
        // 이미 수집된 스탬프거나 현재 요청 중이거나 이미 실패한 랜드마크인 경우 무시
        if (
          get().isCollected(landmarkId) ||
          get().requestingIds.has(landmarkId) ||
          get().failedIds.has(landmarkId)
        )
          return;

        // 요청 시작 상태 기록
        set((state) => {
          const newRequesting = new Set(state.requestingIds);
          newRequesting.add(landmarkId);
          return { requestingIds: newRequesting };
        });

        try {
          console.log(`[STAMP] Requesting stamp for landmarkId: ${landmarkId}`);
          const api = getApi();
          await api.tourControllerCreateStamp({ landmarkId: landmarkId });

          // 진동 피드백 중앙화
          if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
          }

          set((state) => ({
            collectedIds: { ...state.collectedIds, [landmarkId]: true },
          }));
          toast.success('스탬프를 획득했습니다!');
        } catch (error) {
          const err = error as { response?: { status: number; data?: { message: string } } };
          console.error('스탬프 획득 실패:', error);
          const errorMessage = err.response?.data?.message || '서버 오류가 발생했습니다.';
          toast.error(`스탬프 획득 실패: ${errorMessage}`);

          // 만약 이미 획득한 스탬프라는 에러라면 (예: 409 Conflict) 상태에 반영 시도
          if (err.response?.status === 409 || errorMessage.includes('already')) {
            set((state) => ({
              collectedIds: { ...state.collectedIds, [landmarkId]: true },
            }));
          } else {
            // 그 외 에러(500 등)인 경우 현재 세션에서는 재시도하지 않도록 기록
            set((state) => {
              const newFailed = new Set(state.failedIds);
              newFailed.add(landmarkId);
              return { failedIds: newFailed };
            });
          }
        } finally {
          // 요청 종료 상태 해제
          set((state) => {
            const newRequesting = new Set(state.requestingIds);
            newRequesting.delete(landmarkId);
            return { requestingIds: newRequesting };
          });
        }
      },
      setCollectedLocally: (landmarkId) => {
        set((state) => ({
          collectedIds: { ...state.collectedIds, [landmarkId]: true },
        }));
      },
      // persist 복원 시 키가 문자열로 바뀔 수 있음을 고려하여 타입 단언 사용
      isCollected: (landmarkId) => {
        const ids = get().collectedIds as Record<string | number, boolean>;
        return !!ids[landmarkId] || !!ids[String(landmarkId)];
      },
      resetFailedState: (landmarkId) => {
        set((state) => {
          const newFailed = new Set(state.failedIds);
          newFailed.delete(landmarkId);
          return { failedIds: newFailed };
        });
      },
    }),
    {
      name: STORAGE_KEYS.STAMP_STORAGE,
      partialize: (state) => ({ collectedIds: state.collectedIds }), // 획득 목록만 영구 저장
    },
  ),
);
