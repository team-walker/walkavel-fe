'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { STEP, STORAGE_KEYS } from '@/constants/types';
import { shuffleArray } from '@/lib/shuffle';
import { useAuthStore } from '@/store/authStore';
import { useRegionStore } from '@/store/regionStore';
import { AddressResult } from '@/types/address';
import { getAPIDocumentation } from '@/types/api';
import { LandmarkDto } from '@/types/model';

export const useLandmarkExplore = () => {
  const router = useRouter();
  const [step, setStep] = useState<STEP>('SEARCH');
  const { selectedRegion, setRegion, clearRegion, _hasHydrated } = useRegionStore();
  const [landmarks, setLandmarks] = useState<LandmarkDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const { user } = useAuthStore();
  const { tourControllerGetLandmarksByRegion } = getAPIDocumentation();

  const handleAddressSelect = useCallback(
    async (address: AddressResult) => {
      try {
        const data = await tourControllerGetLandmarksByRegion({
          sido: address.sido,
          sigugun: address.sigugun,
        });

        const shuffled = shuffleArray(data);
        setLandmarks(shuffled);
        setRegion(address);
        setCurrentIndex(0);
        setDirection(null);
        setStep('SWIPE');
        setBookmarkedIds(new Set());

        if (!localStorage.getItem(STORAGE_KEYS.ONBOARDING_SEEN)) {
          setShowGuide(true);
        }
      } catch (error) {
        console.error('Failed to fetch landmarks:', error);
      }
    },
    [tourControllerGetLandmarksByRegion, setRegion],
  );

  const handleDismissGuide = useCallback(() => {
    setShowGuide(false);
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_SEEN, 'true');
  }, []);

  const handleSwipe = (swipeDir: 'left' | 'right') => {
    setDirection(swipeDir);
    handleDismissGuide();

    if (swipeDir === 'left') {
      if (currentIndex < landmarks.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setStep('FINISH');
      }
    } else {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    }
  };

  const handleBookmark = (landmarkId: number) => {
    if (!user) {
      // @TODO: https://github.com/orgs/team-walker/projects/1/views/2?pane=issue&itemId=155013857&issue=team-walker%7Cwalkavel-fe%7C15 로그인 관련 세부 사항은 해당 이슈에서 처리
      router.push('/login');
      return;
    }

    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(landmarkId)) {
        next.delete(landmarkId);
      } else {
        next.add(landmarkId);
      }
      return next;
    });
  };

  const handleReset = () => {
    setStep('SWIPE');
    setCurrentIndex(0);
    setDirection(null);
    if (!localStorage.getItem(STORAGE_KEYS.ONBOARDING_SEEN)) {
      setShowGuide(true);
    }
  };

  const handleResetUnbookmarked = () => {
    const unbookmarked = landmarks.filter((l) => !bookmarkedIds.has(l.contentid));
    if (unbookmarked.length === 0) {
      alert('모든 장소를 북마크하셨습니다!'); // @TODO: 모든 장소를 북마크했을 때 더 나은 UX 고민
      return;
    }
    setLandmarks(shuffleArray(unbookmarked));
    setStep('SWIPE');
    setCurrentIndex(0);
    setDirection(null);
  };

  const handleReselect = () => {
    setStep('SEARCH');
    clearRegion();
  };

  // 가이드 자동 타이머
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
    bookmarkedIds,
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
