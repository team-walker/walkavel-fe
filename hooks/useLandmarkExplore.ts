'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { STORAGE_KEYS } from '@/constants/types';
import { shuffleArray } from '@/lib/shuffle';
import { useAuthStore } from '@/store/authStore';
import { useBookmarkStore } from '@/store/bookmarkStore';
import { useExploreStore } from '@/store/exploreStore';
import { useRegionStore } from '@/store/regionStore';
import { AddressResult } from '@/types/address';
import { getAPIDocumentation } from '@/types/api';
import { LandmarkDto } from '@/types/model';

export const useLandmarkExplore = () => {
  const router = useRouter();
  const {
    step,
    landmarks,
    currentIndex,
    setStep,
    setLandmarks,
    setCurrentIndex,
    _hasHydrated: _hasExploreHydrated,
  } = useExploreStore();
  const {
    selectedRegion,
    setRegion,
    clearRegion,
    _hasHydrated: _hasRegionHydrated,
  } = useRegionStore();

  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const { bookmarks, toggleBookmark } = useBookmarkStore();

  const { user, pendingAction, setPendingAction } = useAuthStore();
  const { tourControllerGetLandmarksByRegion } = useMemo(() => getAPIDocumentation(), []);

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
          toast.error('해당 지역에 등록된 장소가 없습니다.');
          return;
        }

        const shuffled = shuffleArray(data);
        setLandmarks(shuffled);
        setRegion(address);
        setCurrentIndex(0);
        setDirection(null);
        setStep('SWIPE');

        if (!localStorage.getItem(STORAGE_KEYS.ONBOARDING_SEEN)) {
          setShowGuide(true);
        }
      } catch (error) {
        console.error('Failed to fetch landmarks:', error);
        toast.error('주변 장소 정보를 가져오는 중 오류가 발생했습니다.');
      }
    },
    [tourControllerGetLandmarksByRegion, setRegion, setLandmarks, setCurrentIndex, setStep],
  );

  const handleDismissGuide = useCallback(() => {
    setShowGuide(false);
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_SEEN, 'true');
  }, []);

  const moveToNext = useCallback(() => {
    if (currentIndex < landmarks.length - 1) {
      setCurrentIndex((prev) => (typeof prev === 'number' ? prev + 1 : prev));
    } else {
      setStep('FINISH');
    }
  }, [currentIndex, landmarks.length, setCurrentIndex, setStep]);

  const moveToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => (typeof prev === 'number' ? prev - 1 : prev));
    }
  }, [currentIndex, setCurrentIndex]);

  const handleSwipe = useCallback(
    (swipeDir: 'left' | 'right') => {
      setDirection(swipeDir);
      handleDismissGuide();

      if (swipeDir === 'left') {
        moveToNext();
      } else {
        moveToPrevious();
      }
    },
    [handleDismissGuide, moveToNext, moveToPrevious],
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
    [user, bookmarks, toggleBookmark, setPendingAction, router],
  );

  const handleReset = useCallback(() => {
    setStep('SWIPE');
    setCurrentIndex(0);
    setDirection(null);
    if (!localStorage.getItem(STORAGE_KEYS.ONBOARDING_SEEN)) {
      setShowGuide(true);
    }
  }, [setStep, setCurrentIndex]);

  const handleResetUnbookmarked = useCallback(() => {
    const bookmarkedIdSet = new Set(bookmarks.map((b) => b.contentid));
    const unbookmarked = landmarks.filter((l) => !bookmarkedIdSet.has(l.contentid));

    if (unbookmarked.length === 0) {
      toast.info('모든 장소를 북마크하셨습니다!');
      return;
    }

    setLandmarks(shuffleArray(unbookmarked));
    setStep('SWIPE');
    setCurrentIndex(0);
    setDirection(null);
  }, [landmarks, bookmarks, setLandmarks, setStep, setCurrentIndex]);

  const handleReselect = useCallback(() => {
    setStep('SEARCH');
    clearRegion();
  }, [setStep, clearRegion]);

  useEffect(() => {
    if (showGuide) {
      const timer = setTimeout(handleDismissGuide, 5000);
      return () => clearTimeout(timer);
    }
  }, [showGuide, handleDismissGuide]);

  return {
    step,
    landmarks,
    currentIndex,
    direction,
    showGuide,
    bookmarks,
    _hasHydrated,
    selectedRegion,
    handleAddressSelect,
    handleDismissGuide,
    handleSwipe,
    handleBookmark,
    handleReset,
    handleResetUnbookmarked,
    handleReselect,
  };
};
