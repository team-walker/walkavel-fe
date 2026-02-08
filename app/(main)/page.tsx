'use client';

import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

import SplashScreen from '@/components/common/SplashScreen';
import AddressSearch from '@/components/home/AddressSearch';
import FinishSection from '@/components/home/FinishSection';
import LandmarkCard from '@/components/home/LandmarkCard';
import Overlay from '@/components/home/Overlay';
import { useLandmarkExplore } from '@/hooks/useLandmarkExplore';
import { useSplashStore } from '@/store/splash';

export default function MainPage() {
  const { isVisible, hideSplash } = useSplashStore();
  const [isAppReady, setIsAppReady] = useState(false);

  const {
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
  } = useLandmarkExplore();

  useEffect(() => {
    const initApp = async () => {
      if (!_hasHydrated) return;

      if (selectedRegion && landmarks.length === 0) {
        await handleAddressSelect(selectedRegion);
      }

      setIsAppReady(true);
    };

    initApp();
  }, [selectedRegion, handleAddressSelect, _hasHydrated, landmarks.length]);

  const handleCardClick = (contentId: number) => {
    // @TODO: 상세 페이지 이동 로직 (Link 또는 router.push)
    console.log('Navigate to:', contentId);
  };

  return (
    <div className="h-full w-full bg-white select-none">
      <AnimatePresence>
        {isVisible && <SplashScreen key="splash" isAppReady={isAppReady} onComplete={hideSplash} />}
      </AnimatePresence>

      <main className="relative h-full w-full overflow-hidden">
        {(!isAppReady || !_hasHydrated) && null}

        {isAppReady && _hasHydrated && (
          <>
            {step === 'SEARCH' && <AddressSearch onSelectAddress={handleAddressSelect} />}

            {step === 'SWIPE' && landmarks.length > 0 && (
              <div className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-center px-6 py-4">
                <AnimatePresence mode="popLayout" custom={direction}>
                  {landmarks
                    .slice(currentIndex, currentIndex + (currentIndex === 0 ? 1 : 2))
                    .reverse()
                    .map((landmark, index, arr) => {
                      const isTop = index === arr.length - 1;
                      return (
                        <LandmarkCard
                          key={landmark.contentid}
                          data={landmark}
                          onSwipe={handleSwipe}
                          onDragStart={handleDismissGuide}
                          onClick={handleCardClick}
                          onBookmark={handleBookmark}
                          isTop={isTop}
                          isBookmarked={bookmarkedIds.has(landmark.contentid)}
                          direction={direction}
                          shouldWiggle={isTop && showGuide}
                          isFirstCard={currentIndex === 0}
                        />
                      );
                    })}
                </AnimatePresence>

                <AnimatePresence>
                  {showGuide && <Overlay key="onboarding-guide" onDismiss={handleDismissGuide} />}
                </AnimatePresence>
              </div>
            )}

            {step === 'FINISH' && (
              <FinishSection
                onReset={handleReset}
                onResetUnbookmarked={handleResetUnbookmarked}
                onReselect={handleReselect}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
