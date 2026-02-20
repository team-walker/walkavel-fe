'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { STORAGE_KEYS } from '@/constants/types';
import { useExploreStore } from '@/store/exploreStore';
import { useRegionStore } from '@/store/regionStore';

export const useExploreActions = () => {
  const router = useRouter();
  const { step, landmarks, currentIndex, setStep, setCurrentIndex } = useExploreStore();
  const { clearRegion } = useRegionStore();

  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const handleDismissGuide = useCallback(() => {
    setShowGuide(false);
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_SEEN, 'true');
  }, []);

  const handleSwipe = useCallback(
    (swipeDirection: 'left' | 'right') => {
      setDirection(swipeDirection);
      handleDismissGuide();

      if (swipeDirection === 'left') {
        if (currentIndex < landmarks.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setStep('FINISH');
        }
      } else {
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
      }
    },
    [currentIndex, landmarks.length, setCurrentIndex, setStep, handleDismissGuide],
  );

  const handleReselect = useCallback(() => {
    router.push('/search');
    clearRegion();
  }, [router, clearRegion]);

  const handleReset = useCallback(() => {
    setStep('SWIPE');
    setCurrentIndex(0);
    setDirection(null);
    if (!localStorage.getItem(STORAGE_KEYS.ONBOARDING_SEEN)) {
      setShowGuide(true);
    }
  }, [setStep, setCurrentIndex]);

  useEffect(() => {
    if (showGuide) {
      const timer = setTimeout(handleDismissGuide, 5000);
      return () => clearTimeout(timer);
    }
  }, [showGuide, handleDismissGuide]);

  return {
    step,
    currentIndex,
    direction,
    showGuide,
    setShowGuide,
    handleSwipe,
    handleDismissGuide,
    handleReselect,
    handleReset,
  };
};
