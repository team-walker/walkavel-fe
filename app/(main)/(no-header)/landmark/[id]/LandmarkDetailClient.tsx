'use client';

import { motion } from 'framer-motion';
import { Calendar, Car, Clock, ExternalLink, Globe, MapPin, Phone, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { RadarSheet } from '@/components/explore/RadarSheet';
import { StampMissionSheet } from '@/components/explore/StampMissionSheet';
import { LandmarkImageGallery } from '@/components/landmark/detail/LandmarkImageGallery';
import { LandmarkInfoItem } from '@/components/landmark/detail/LandmarkInfoItem';
import { Button } from '@/components/ui/button';
import { STAMP_CONFIG } from '@/constants/config';
import { MAP_APP_URLS } from '@/constants/map';
import { useLandmarkDetail } from '@/hooks/useLandmarkDetail';
import { useStamp } from '@/hooks/useStamp';
import { useStampAcquisition } from '@/hooks/useStampAcquisition';
import { useWatchLocation } from '@/hooks/useWatchLocation';
import { triggerVibration, VIBRATION_PATTERNS } from '@/lib/utils/pwa';
import { useExploreStore } from '@/store/exploreStore';
import { LandmarkDetailResponseDto } from '@/types/model';

const DynamicNaverMap = dynamic(
  () => import('@/components/common/NaverMap').then((mod) => mod.NaverMap),
  {
    ssr: false,
    loading: () => (
      <div className="bg-walkavel-gray-50 text-walkavel-gray-400 flex h-full w-full animate-pulse items-center justify-center text-xs">
        지도 로딩 중...
      </div>
    ),
  },
);

interface LandmarkDetailClientProps {
  id: number;
  initialData: LandmarkDetailResponseDto;
}

export default function LandmarkDetailClient({ id, initialData }: LandmarkDetailClientProps) {
  const router = useRouter();
  const [isMissionSheetOpen, setIsMissionSheetOpen] = useState(false);

  const { data: landmarkData, galleryImages } = useLandmarkDetail(id, initialData);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const displayData = landmarkData || initialData;

  const { isCollected, setCollectedLocally } = useStamp();
  const collected = mounted ? isCollected(id) : false;

  useEffect(() => {
    if (displayData?.isStamped && !collected) {
      setCollectedLocally(id);
    }
  }, [displayData?.isStamped, collected, id, setCollectedLocally]);

  const {
    isExploring: rawIsExploring,
    setIsExploring,
    distanceToTarget: rawDistanceToTarget,
  } = useExploreStore();

  const isExploring = mounted ? rawIsExploring : false;
  const distanceToTarget = mounted ? rawDistanceToTarget : null;

  const landmarkCoords = useMemo(() => {
    if (!displayData?.detail) return { lat: undefined, lng: undefined };

    const mapx = displayData.detail.mapx;
    const mapy = displayData.detail.mapy;

    const lat = mapy ? Number(mapy) : undefined;
    const lng = mapx ? Number(mapx) : undefined;

    return { lat, lng };
  }, [displayData]);

  useWatchLocation(landmarkCoords.lat, landmarkCoords.lng);
  useStampAcquisition(id, distanceToTarget, isExploring);

  const hasNotifiedRef = useRef(false);

  useEffect(() => {
    if (
      distanceToTarget !== null &&
      distanceToTarget >= 0 &&
      distanceToTarget <= STAMP_CONFIG.DISCOVERY_DISTANCE &&
      !isExploring &&
      !collected &&
      !hasNotifiedRef.current
    ) {
      triggerVibration([...VIBRATION_PATTERNS.SUCCESS]);
      hasNotifiedRef.current = true;
      setTimeout(() => setIsMissionSheetOpen(true), 0);
    } else if (
      distanceToTarget !== null &&
      distanceToTarget > STAMP_CONFIG.DISCOVERY_DISTANCE + 30
    ) {
      hasNotifiedRef.current = false;
      setTimeout(() => setIsMissionSheetOpen(false), 0);
    }
  }, [distanceToTarget, isExploring, collected]);

  const handleStartExplore = () => {
    setIsExploring(true);
    triggerVibration([...VIBRATION_PATTERNS.SUCCESS]);
  };

  const [scrollY, setScrollY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const heroHeight = Math.max(220, 320 - scrollY * 0.5);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  const handleBack = () => router.back();

  const { detail, intro } = displayData;

  const handleOpenMap = () => {
    const { title, addr1, mapy, mapx } = detail;
    if (mapy == null || mapx == null) return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const searchKeyword = addr1 ? `${addr1} ${title}` : title;

    if (isMobile) {
      window.open(MAP_APP_URLS.NAVER_MOBILE(Number(mapy), Number(mapx), title), '_blank');
    } else {
      window.open(MAP_APP_URLS.NAVER_DESKTOP(searchKeyword, Number(mapy), Number(mapx)), '_blank');
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex h-full flex-col overflow-hidden bg-white"
    >
      <div
        ref={scrollContainerRef}
        className="no-scrollbar flex-1 overflow-y-auto"
        onScroll={handleScroll}
      >
        <div
          className="bg-walkavel-gray-100 relative w-full overflow-hidden transition-all duration-200"
          style={{ height: `${heroHeight}px` }}
        >
          <LandmarkImageGallery images={galleryImages} title={detail.title} onBack={handleBack} />
        </div>
        <div className="bg-white">
          <div className="px-6 pt-5 pb-48">
            <div className="border-walkavel-gray-100 mb-5 rounded-4xl border-2 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-4">
                <h1 className="text-walkavel-gray-900 flex-1 text-2xl leading-tight font-bold">
                  {detail.title}
                </h1>
                {collected && (
                  <div className="bg-brand-blue-light text-brand-blue mt-1 flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-bold">
                    <Sparkles size={14} className="fill-brand-blue" />
                    수집 완료
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="text-walkavel-gray-600 flex items-start">
                  <MapPin size={16} className="mt-0.5 mr-2 shrink-0" strokeWidth={2} />
                  <span className="text-sm leading-relaxed">
                    {detail.addr1} {detail.addr2}
                  </span>
                </div>
              </div>
            </div>
            <div className="from-brand-blue/5 to-brand-blue/10 mb-7 rounded-4xl bg-linear-to-br">
              <div className="mb-4 overflow-hidden rounded-3xl bg-white shadow-sm">
                <div className="relative h-64">
                  <ErrorBoundary
                    fallback={
                      <div className="bg-walkavel-gray-50 text-walkavel-gray-500 flex h-full w-full flex-col items-center justify-center">
                        <p className="text-sm">지도를 불러오는 중 문제가 발생했습니다.</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.location.reload()}
                          className="text-brand-blue hover:text-brand-blue-dark mt-2"
                        >
                          새로고침
                        </Button>
                      </div>
                    }
                  >
                    {landmarkCoords.lat != null && landmarkCoords.lng != null ? (
                      <DynamicNaverMap
                        lat={landmarkCoords.lat}
                        lng={landmarkCoords.lng}
                        className="h-full w-full"
                      />
                    ) : (
                      <div className="bg-walkavel-gray-100 text-walkavel-gray-500 flex h-full w-full items-center justify-center text-sm">
                        위치 정보가 없습니다.
                      </div>
                    )}
                  </ErrorBoundary>
                  <Button
                    onClick={handleOpenMap}
                    aria-label="네이버 지도에서 보기 (새 창 열림)"
                    className="text-walkavel-gray-700 active:bg-walkavel-gray-50 absolute right-3 bottom-3 z-10 flex cursor-pointer items-center rounded-full bg-white p-0 px-3 py-1.5 text-xs font-semibold shadow-[0_10px_15px_0_rgba(0,0,0,0.1),0_4_6px_0_rgba(0,0,0,0.1)] transition-colors hover:bg-white/90 active:scale-95"
                  >
                    <ExternalLink size={12} className="mr-1" strokeWidth={2} />
                    지도 앱
                  </Button>
                </div>
              </div>
            </div>

            {!collected && (
              <div className="bg-walkavel-gray-50 text-walkavel-gray-500 mb-7 flex flex-col items-center rounded-2xl p-4 text-center text-sm leading-relaxed">
                <div>
                  <MapPin size={14} className="text-brand-blue mr-1 mb-1 inline-block" />
                  장소 주변 <span className="text-walkavel-gray-900 font-bold">150m</span> 내에서
                  탐험을 시작하고,
                  <br />
                  <span className="text-brand-blue font-bold">50m 이내</span>로 더 다가가 스탬프를
                  획득해 보세요!
                </div>
                {distanceToTarget !== null &&
                  distanceToTarget <= STAMP_CONFIG.DISCOVERY_DISTANCE &&
                  !isExploring && (
                    <Button
                      onClick={() => setIsMissionSheetOpen(true)}
                      aria-label="스탬프 탐험 시작하기"
                      className="bg-brand-blue mt-4 h-10 w-full max-w-50 cursor-pointer rounded-xl font-bold text-white shadow-md transition-all active:scale-95"
                    >
                      스탬프 탐험 시작하기
                    </Button>
                  )}
              </div>
            )}

            <div className="bg-walkavel-gray-100 -mx-6 mb-8 h-2 rounded-sm" />

            {detail.overview && (
              <div className="mb-8">
                <h2 className="text-walkavel-gray-900 mb-3 text-lg font-semibold">소개</h2>
                <div className="border-walkavel-gray-100 bg-walkavel-gray-50 rounded-3xl border p-5">
                  <p className="text-walkavel-gray-700 text-sm leading-[1.7] whitespace-pre-wrap">
                    {detail.overview}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-walkavel-gray-100 -mx-6 mb-8 h-2 rounded-sm" />

            <div className="mb-8">
              <h2 className="text-walkavel-gray-900 mb-4 text-lg font-semibold">운영 정보</h2>
              <ul className="space-y-3">
                {detail.tel && (
                  <LandmarkInfoItem
                    icon={<Phone size={18} className="text-walkavel-gray-600" strokeWidth={2} />}
                    label="전화번호"
                    content={detail.tel}
                  />
                )}
                {detail.homepage && (
                  <LandmarkInfoItem
                    icon={<Globe size={18} className="text-walkavel-gray-600" strokeWidth={2} />}
                    label="홈페이지"
                    content={detail.homepage}
                    isHtml
                  />
                )}
                {intro?.restdate && (
                  <LandmarkInfoItem
                    icon={<Calendar size={18} className="text-walkavel-gray-600" strokeWidth={2} />}
                    label="휴무일"
                    content={intro?.restdate}
                    isHtml
                  />
                )}
                {intro?.usetime && (
                  <LandmarkInfoItem
                    icon={<Clock size={18} className="text-walkavel-gray-600" strokeWidth={2} />}
                    label="이용 시간"
                    content={intro?.usetime}
                    isHtml
                  />
                )}
                {intro?.parking && (
                  <LandmarkInfoItem
                    icon={<Car size={18} className="text-walkavel-gray-600" strokeWidth={2} />}
                    label="주차"
                    content={intro?.parking}
                    isHtml
                  />
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <StampMissionSheet
        isOpen={isMissionSheetOpen}
        onClose={() => setIsMissionSheetOpen(false)}
        onStart={handleStartExplore}
        landmarkName={detail.title}
        distance={distanceToTarget}
        isCollected={collected}
      />

      <RadarSheet id={id} />
    </motion.main>
  );
}
