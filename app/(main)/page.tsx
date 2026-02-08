'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import SplashScreen from '@/components/common/SplashScreen';
import AddressSearch from '@/components/home/AddressSearch';
import LandmarkCard from '@/components/home/LandmarkCard';
import Overlay from '@/components/home/Overlay';
import { useAuthStore } from '@/store/authStore';
import { useRegionStore } from '@/store/regionStore';
import { useSplashStore } from '@/store/splash';
import { AddressResult } from '@/types/address';
import { getAPIDocumentation } from '@/types/api';
import { LandmarkDto } from '@/types/model';

const FinishSection = ({
  onReset,
  onResetUnbookmarked,
  onReselect,
}: {
  onReset: () => void;
  onResetUnbookmarked: () => void;
  onReselect: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex h-full flex-col items-center justify-center space-y-8 px-8 text-center"
  >
    <div className="relative">
      <div className="absolute -inset-4 rounded-full blur-2xl" />
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-900 text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="h-10 w-10"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
    </div>
    <div className="space-y-2">
      <h2 className="text-4xl font-black tracking-tight text-zinc-900">탐색을 마쳤어요!</h2>
      <p className="font-medium text-zinc-500">선택하신 지역의 모든 랜드마크를 확인했습니다.</p>
    </div>
    <div className="flex w-full max-w-sm flex-col gap-3">
      <button
        onClick={onReset}
        className="group relative flex h-16 w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-900 text-lg font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
        이 지역 다시 찾아보기
      </button>
      <button
        onClick={onReselect}
        className="flex h-16 w-full items-center justify-center rounded-2xl bg-zinc-200/50 text-lg font-bold text-zinc-900 transition-all hover:bg-zinc-200 active:scale-[0.98]"
      >
        다른 지역 선택하기
      </button>
    </div>
  </motion.div>
);

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

type STEP = 'SEARCH' | 'SWIPE' | 'FINISH';

export default function RootPage() {
  const router = useRouter();
  const { isVisible, hideSplash } = useSplashStore();
  const [isAppReady, setIsAppReady] = useState(false);
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
        setBookmarkedIds(new Set()); // 지역 변경 시 북마크 로컬 상태 초기화

        // 온보딩 가이드 표시 여부 확인
        if (!localStorage.getItem('walkavel_onboarding_seen')) {
          setShowGuide(true);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [tourControllerGetLandmarksByRegion, setRegion],
  );

  const handleDismissGuide = useCallback(() => {
    setShowGuide(false);
    localStorage.setItem('walkavel_onboarding_seen', 'true');
  }, []);

  // 가이드 자동 타이머 로직
  useEffect(() => {
    if (showGuide) {
      const timer = setTimeout(handleDismissGuide, 5000);
      return () => clearTimeout(timer);
    }
  }, [showGuide, handleDismissGuide]);

  useEffect(() => {
    const initApp = async () => {
      // 1. 스토어 복구 대기
      if (!_hasHydrated) return;

      // 2. 이미 선택된 지역이 있다면 데이터 로드
      if (selectedRegion && landmarks.length === 0) {
        await handleAddressSelect(selectedRegion);
      }

      // 3. 준비 완료 상태로 변경
      setIsAppReady(true);
    };

    initApp();
  }, [selectedRegion, handleAddressSelect, _hasHydrated, landmarks.length]);

  const handleSwipe = (swipeDir: 'left' | 'right') => {
    setDirection(swipeDir);
    handleDismissGuide();

    if (swipeDir === 'left') {
      // 2. 우측 -> 좌측 스와이프시 다음 카드 (currentIndex + 1)
      if (currentIndex < landmarks.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // 4. 마지막 카드일 경우 종료 화면으로 이동
        setStep('FINISH');
      }
    } else {
      // 3. 좌측 -> 우측 스와이프시 이전 카드 (currentIndex - 1)
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    }
  };

  const handleCardClick = (contentId: number) => {
    // 5. 카드 클릭시 상세화면으로 이동 (현재 로그만 출력, 추후 라우팅 추가)
    console.log('Navigate to detail page for:', contentId);
  };

  const handleBookmark = (landmarkId: number) => {
    // 미로그인 상태 북마크 클릭 시 로그인 안내 → 로그인 화면 이동
    if (!user) {
      if (confirm('북마크 기능을 이용하려면 로그인이 필요합니다. 로그인 페이지로 이동할까요?')) {
        router.push('/login');
      }
      return;
    }

    // 로그인 + 미북마크: 북마크 추가 / 로그인 + 북마크됨: 북마크 제거
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(landmarkId)) {
        next.delete(landmarkId);
      } else {
        next.add(landmarkId);
      }
      return next;
    });

    console.log('Toggle bookmark for:', landmarkId);
  };

  return (
    <div className="h-full w-full bg-white select-none">
      <AnimatePresence>
        {isVisible && <SplashScreen key="splash" isAppReady={isAppReady} onComplete={hideSplash} />}
      </AnimatePresence>

      <main className="relative h-full w-full overflow-hidden">
        {/* 스플래시가 떠있거나 스토어 로딩 중이면 아무것도 보여주지 않음 */}
        {(!isAppReady || !_hasHydrated) && null}

        {isAppReady && _hasHydrated && (
          <>
            {step === 'SEARCH' && <AddressSearch onSelectAddress={handleAddressSelect} />}

            {step === 'SWIPE' && landmarks.length > 0 && (
              <div className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-center px-6 py-4">
                <AnimatePresence mode="popLayout" custom={direction}>
                  {landmarks
                    .slice(currentIndex, currentIndex + 2)
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
                        />
                      );
                    })}
                </AnimatePresence>

                {/* 제스처 가이드 오버레이 */}
                <AnimatePresence>
                  {showGuide && <Overlay key="onboarding-guide" onDismiss={handleDismissGuide} />}
                </AnimatePresence>
              </div>
            )}

            {step === 'FINISH' && (
              <FinishSection
                onReset={() => {
                  setStep('SWIPE');
                  setCurrentIndex(0);
                  setDirection(null);
                  if (!localStorage.getItem('walkavel_onboarding_seen')) {
                    setShowGuide(true);
                  }
                }}
                onResetUnbookmarked={() => {
                  const unbookmarked = landmarks.filter((l) => !bookmarkedIds.has(l.contentid));
                  if (unbookmarked.length === 0) {
                    alert('모든 장소를 북마크하셨습니다!');
                    return;
                  }
                  setLandmarks(shuffleArray(unbookmarked));
                  setStep('SWIPE');
                  setCurrentIndex(0);
                  setDirection(null);
                }}
                onReselect={() => {
                  setStep('SEARCH');
                  clearRegion();
                }}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
