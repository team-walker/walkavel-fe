'use client';

import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { StaticSplash } from '@/components/common/SplashScreen';
import AddressSearch from '@/components/home/AddressSearch';
import LandmarkCard from '@/components/home/LandmarkCard';
import { ROUTES } from '@/constants/navigation';
import { useLandmarkExplore } from '@/hooks/useLandmarkExplore';
import { useSplashStore } from '@/store/splash';
import { LandmarkDto } from '@/types/model';

const SplashScreen = dynamic(() => import('@/components/common/SplashScreen'), {
  ssr: false,
  loading: () => <StaticSplash />,
});
const Overlay = dynamic(() => import('@/components/home/Overlay'), { ssr: false });
const FinishSection = dynamic(() => import('@/components/home/FinishSection'));

export default function MainPage() {
  const router = useRouter();
  const { isVisible, hideSplash } = useSplashStore();
  const [isAppReady, setIsAppReady] = useState(false);

  const {
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
    router.push(ROUTES.LANDMARK_DETAIL(contentId));
  };

  const visibleLandmarks = useMemo(() => {
    const sliceCount = currentIndex === 0 ? 1 : 2;
    return landmarks.slice(currentIndex, currentIndex + sliceCount).reverse();
  }, [landmarks, currentIndex]);

  const bookmarkedIdSet = useMemo(
    () => new Set(bookmarks.map((b: LandmarkDto) => b.contentid)),
    [bookmarks],
  );

  return (
    <div className="h-full w-full bg-white select-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="splash-wrapper"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="will-change-opacity fixed inset-0 z-10000 bg-white"
          >
            <SplashScreen isAppReady={isAppReady} onComplete={hideSplash} />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative h-full w-full overflow-hidden">
        {(!isAppReady || !_hasHydrated) && (
          <div className="flex h-full w-full items-center justify-center bg-white p-6">
            <div className="bg-walkavel-gray-100 h-64 w-full animate-pulse rounded-4xl" />
          </div>
        )}

        {isAppReady && _hasHydrated && (
          <>
            {step === 'SEARCH' && <AddressSearch onSelectAddress={handleAddressSelect} />}

            {step === 'SWIPE' && landmarks.length > 0 && (
              <div className="flex h-full w-full flex-col p-6">
                <div className="relative flex-1">
                  <AnimatePresence mode="popLayout" custom={direction}>
                    {visibleLandmarks.map((landmark, index, arr) => {
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
                          isBookmarked={bookmarkedIdSet.has(landmark.contentid)}
                          direction={direction}
                          shouldWiggle={isTop && showGuide}
                          isFirstCard={currentIndex === 0}
                        />
                      );
                    })}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {showGuide && <Overlay key="onboarding-guide" onDismiss={handleDismissGuide} />}
                </AnimatePresence>
              </div>
            )}

            {step === 'FINISH' && (
              <FinishSection onReset={handleReset} onReselect={handleReselect} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
