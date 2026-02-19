import { useCallback, useEffect } from 'react';

import { STAMP_CONFIG } from '@/constants/config';
import { useStamp } from '@/hooks/useStamp';
import { triggerVibration, VIBRATION_PATTERNS } from '@/lib/utils/pwa';
import { showErrorToast, showSuccessToast } from '@/lib/utils/toast';
import { getApi } from '@/types/api';

export const useStampAcquisition = (
  contentId: number | undefined,
  distance: number | null,
  isExploring: boolean,
) => {
  const { isCollected, requestingIds, failedIds, setRequesting, setCollectedLocally, setFailed } =
    useStamp();

  const acquireStamp = useCallback(
    async (id: number) => {
      if (isCollected(id) || requestingIds.includes(id) || failedIds.includes(id)) return;

      setRequesting(id, true);

      try {
        const api = getApi();
        await api.tourControllerCreateStamp({ landmarkId: id });

        triggerVibration([...VIBRATION_PATTERNS.ACQUIRED]);

        setCollectedLocally(id);
        showSuccessToast('스탬프를 획득했습니다!');
      } catch (error) {
        const err = error as { response?: { status: number; data?: { message: string } } };
        const errorMessage = err.response?.data?.message || '서버 오류가 발생했습니다.';
        showErrorToast(`스탬프 획득 실패: ${errorMessage}`);

        if (err.response?.status === 409 || errorMessage.includes('already')) {
          setCollectedLocally(id);
        } else {
          setFailed(id);
        }
      } finally {
        setRequesting(id, false);
      }
    },
    [isCollected, requestingIds, failedIds, setRequesting, setCollectedLocally, setFailed],
  );

  useEffect(() => {
    if (!isExploring || !contentId || distance === null) return;

    const canAcquire = distance <= STAMP_CONFIG.ACQUISITION_DISTANCE && !isCollected(contentId);

    if (canAcquire) {
      acquireStamp(contentId);
    }
  }, [distance, contentId, isExploring, isCollected, acquireStamp]);

  return { acquireStamp };
};
