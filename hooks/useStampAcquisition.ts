import { useEffect } from 'react';

import { STAMP_CONFIG } from '@/constants/config'; // 임계값 등 상수 관리
import { useStampStore } from '@/store/stampStore';

export const useStampAcquisition = (
  contentId: number | undefined,
  distance: number | null,
  isExploring: boolean,
) => {
  const { addStamp, isCollected } = useStampStore();

  // 피드백 로직 중앙 집중화
  const triggerSuccessFeedback = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  useEffect(() => {
    if (!isExploring || !contentId || distance === null) return;

    const canAcquire = distance <= STAMP_CONFIG.ACQUISITION_DISTANCE && !isCollected(contentId);

    if (canAcquire) {
      addStamp(contentId);
      triggerSuccessFeedback();
    }
  }, [distance, contentId, isExploring, addStamp, isCollected]);
};
