import { useEffect } from 'react';

import { STAMP_CONFIG } from '@/constants/config'; // 임계값 등 상수 관리
import { useStampStore } from '@/store/stampStore';

// 거리 기반 스탬프 획득 비즈니스 로직만 전문적으로 처리
export const useStampAcquisition = (
  contentId: number | undefined,
  distance: number | null,
  isExploring: boolean,
) => {
  const addStamp = useStampStore((state) => state.addStamp);
  const isCollected = useStampStore((state) => {
    if (!contentId) return false;
    const ids = state.collectedIds as Record<string | number, boolean>;
    return !!ids[contentId] || !!ids[String(contentId)];
  });

  useEffect(() => {
    if (!isExploring || !contentId || distance === null) return;

    // 거리가 임계값(50m) 이내이고 아직 수집되지 않은 경우에만 요청
    const canAcquire = distance <= STAMP_CONFIG.ACQUISITION_DISTANCE && !isCollected;

    if (canAcquire) {
      console.log(`[ACQUISITION] Triggering addStamp for ${contentId}. Distance: ${distance}m`);
      addStamp(contentId);
    }
  }, [distance, contentId, isExploring, addStamp, isCollected]);
};
