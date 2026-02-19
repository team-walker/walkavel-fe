'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';

import { useBookmark } from '@/hooks/useBookmark';
import { showErrorToast } from '@/lib/utils/toast';
import { useAuthStore } from '@/store/authStore';
import { useExploreStore } from '@/store/exploreStore';
import { useRegionStore } from '@/store/regionStore';
import { AddressResult } from '@/types/address';
import { getApi } from '@/types/api';
import { LandmarkDto } from '@/types/model';

export const useExploreData = () => {
  const router = useRouter();
  const landmarks = useExploreStore((s) => s.landmarks);
  const setLandmarks = useExploreStore((s) => s.setLandmarks);
  const setStep = useExploreStore((s) => s.setStep);
  const setCurrentIndex = useExploreStore((s) => s.setCurrentIndex);
  const _hasExploreHydrated = useExploreStore((s) => s._hasHydrated);

  const selectedRegion = useRegionStore((s) => s.selectedRegion);
  const setRegion = useRegionStore((s) => s.setRegion);
  const clearRegion = useRegionStore((s) => s.clearRegion);
  const _hasRegionHydrated = useRegionStore((s) => s._hasHydrated);

  const { bookmarks, toggleBookmark } = useBookmark();
  const user = useAuthStore((s) => s.user);
  const pendingAction = useAuthStore((s) => s.pendingAction);
  const setPendingAction = useAuthStore((s) => s.setPendingAction);
  const { tourControllerGetLandmarksByRegion } = useMemo(() => getApi(), []);

  const _hasHydrated = _hasExploreHydrated && _hasRegionHydrated;

  useEffect(() => {
    if (user && pendingAction?.type === 'bookmark') {
      const { landmarkId } = pendingAction.payload;
      const landmark = landmarks.find((l) => l.contentid === landmarkId);

      if (landmark) {
        toggleBookmark(landmark);
      }
      setPendingAction(null);
    }
  }, [user, pendingAction, landmarks, toggleBookmark, setPendingAction]);

  const handleAddressSelect = useCallback(
    async (address: AddressResult) => {
      try {
        const data = await tourControllerGetLandmarksByRegion({
          sido: address.sido,
          sigugun: address.sigugun,
        });

        if (!data || data.length === 0) {
          showErrorToast('해당 지역에 등록된 장소가 없습니다.');
          return false;
        }

        setLandmarks(data);
        setRegion(address);
        setCurrentIndex(0);
        setStep('SWIPE');

        return true;
      } catch (error) {
        console.error('Failed to fetch landmarks:', error);
        showErrorToast('주변 장소 정보를 가져오는 중 오류가 발생했습니다.');
        return false;
      }
    },
    [tourControllerGetLandmarksByRegion, setRegion, setLandmarks, setCurrentIndex, setStep],
  );

  const handleBookmark = useCallback(
    (landmark: LandmarkDto) => {
      if (!user) {
        setPendingAction({ type: 'bookmark', payload: { landmarkId: landmark.contentid } });
        router.push(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      toggleBookmark(landmark);
    },
    [user, toggleBookmark, setPendingAction, router],
  );

  return {
    landmarks,
    bookmarks,
    selectedRegion,
    _hasHydrated,
    clearRegion,
    handleAddressSelect,
    handleBookmark,
  };
};
