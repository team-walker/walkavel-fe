'use client';

import { motion } from 'framer-motion';
import { Calendar, Car, Clock, ExternalLink, Globe, MapPin, Phone, Sparkles } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { NaverMap } from '@/components/common/NaverMap';
import { RadarSheet } from '@/components/explore/RadarSheet';
import { StampMissionSheet } from '@/components/explore/StampMissionSheet';
import { LandmarkImageGallery } from '@/components/landmark/detail/LandmarkImageGallery';
import { LandmarkInfoItem } from '@/components/landmark/detail/LandmarkInfoItem';
import { Button } from '@/components/ui/button';
import { STAMP_CONFIG } from '@/constants/config';
import { useLandmarkDetail } from '@/hooks/useLandmarkDetail';
import { useStampAcquisition } from '@/hooks/useStampAcquisition';
import { useWatchLocation } from '@/hooks/useWatchLocation';
import { cn } from '@/lib/utils';
import { useExploreStore } from '@/store/exploreStore';
import { useStampStore } from '@/store/stampStore';

export default function LandmarkDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const [isMissionSheetOpen, setIsMissionSheetOpen] = useState(false);

  const { data: landmarkData, galleryImages, loading } = useLandmarkDetail(Number(id));

  const collected = useStampStore((state) => state.isCollected(Number(id)));
  const setCollectedLocally = useStampStore((state) => state.setCollectedLocally);

  // 서버에서 내려준 기본 정보(isStamped)가 true라면 클라이언트 상태와 동기화
  useEffect(() => {
    if (landmarkData?.isStamped && !collected) {
      setCollectedLocally(Number(id));
    }
  }, [landmarkData?.isStamped, collected, id, setCollectedLocally]);

  // const mockDistance = 300; // 테스트용 임시 거리 값 (미터 단위)
  // 1. 전역 상태 및 실시간 위치 추적 연결
  const { isExploring, setIsExploring, distanceToTarget, userLocation } = useExploreStore();

  // 2. 위치 추적 훅 실행 (위도, 경도 전달)
  useWatchLocation(
    landmarkData?.detail.mapy ? Number(landmarkData.detail.mapy) : undefined,
    landmarkData?.detail.mapx ? Number(landmarkData.detail.mapx) : undefined,
  );

  // 3. 스탬프 획득 로직 통합 관리 (거리 기반 자동 획득)
  useStampAcquisition(Number(id), distanceToTarget, isExploring);

  const hasNotifiedRef = useRef(false);
  const shouldOpenMissionRef = useRef(false);

  // 3. 전문가 제안 시나리오: 150m 이내 진입시 미션 시트 자동 오픈 (Hysteresis 적용)
  useEffect(() => {
    if (
      distanceToTarget !== null &&
      distanceToTarget > 0 &&
      distanceToTarget <= STAMP_CONFIG.DISCOVERY_DISTANCE &&
      !isExploring &&
      !collected &&
      !hasNotifiedRef.current
    ) {
      if ('vibrate' in navigator) navigator.vibrate(200);
      hasNotifiedRef.current = true;
      // 동기적 상태 업데이트로 인한 Cascading Render 방지를 위해 비동기 처리
      setTimeout(() => setIsMissionSheetOpen(true), 0);
    } else if (
      distanceToTarget !== null &&
      distanceToTarget > STAMP_CONFIG.DISCOVERY_DISTANCE + 30
    ) {
      // 사용자가 범위를 완전히 벗어나면(180m 이상) 다시 트리거될 수 있도록 리셋
      hasNotifiedRef.current = false;
      // 동기적 상태 업데이트로 인한 Cascading Render 방지를 위해 비동기 처리
      setTimeout(() => setIsMissionSheetOpen(false), 0);
    }
  }, [distanceToTarget, isExploring, collected]);

  const handleStartExplore = () => {
    setIsExploring(true);
    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
  };

  const [scrollY, setScrollY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const heroHeight = Math.max(240, 360 - scrollY * 0.5);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  const handleBack = () => router.back();

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-white"
        role="status"
        aria-label="장소 상세 정보를 불러오는 중입니다"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!landmarkData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center">
        <p className="mb-4 text-gray-500">장소 정보를 찾을 수 없습니다.</p>
        <Button
          onClick={handleBack}
          className="rounded-full bg-blue-500 px-6 py-2 font-semibold text-white"
        >
          뒤로 가기
        </Button>
      </div>
    );
  }

  const { detail, intro } = landmarkData;

  const handleOpenMap = () => {
    const { title, addr1, mapy, mapx } = detail;
    if (mapy == null || mapx == null) return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const searchKeyword = addr1 ? `${addr1} ${title}` : title;

    if (isMobile) {
      // 모바일: 좌표 기반으로 정확한 지점에 핀을 꽂고 이름을 표시 (앱 유도 최적화)
      const mobileUrl = `https://m.map.naver.com/map.naver?lat=${mapy}&lng=${mapx}&pinTitle=${encodeURIComponent(title)}&pinType=site&dlevel=11`;
      window.open(mobileUrl, '_blank');
    } else {
      // PC: 최신 인터페이스에서 상세 정보 사이드바를 자동으로 활성화
      const desktopUrl = `https://map.naver.com/p/search/${encodeURIComponent(searchKeyword)}?c=${mapx},${mapy},15,0,0,0,dh`;
      window.open(desktopUrl, '_blank');
    }
  };

  console.log('Landmark Coord:', landmarkData?.detail.mapy, landmarkData?.detail.mapx);
  console.log('User Coord:', userLocation?.latitude, userLocation?.longitude);
  console.log('distanceToTarget: ', distanceToTarget);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex h-screen flex-col overflow-hidden bg-white"
    >
      <div
        ref={scrollContainerRef}
        className="no-scrollbar flex-1 overflow-y-auto"
        onScroll={handleScroll}
      >
        <div
          className="relative w-full overflow-hidden bg-gray-100 transition-all duration-200"
          style={{ height: `${heroHeight}px` }}
        >
          <LandmarkImageGallery images={galleryImages} title={detail.title} onBack={handleBack} />
        </div>
        <div className="bg-white">
          <div className="px-6 pt-6 pb-48">
            <div className="mb-6 rounded-4xl border-2 border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h1 className="text-[24px] leading-tight font-bold text-gray-900">
                  {detail.title}
                </h1>
                {collected && (
                  <div className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-[12px] font-bold text-blue-600">
                    <Sparkles size={14} className="fill-blue-600" />
                    수집 완료
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-start text-gray-600">
                  <MapPin size={16} className="mt-0.5 mr-2 shrink-0" strokeWidth={2} />
                  <span className="text-[14px] leading-relaxed">
                    {detail.addr1} {detail.addr2}
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-8 rounded-4xl bg-linear-to-br from-[#3182F6]/5 to-[#3182F6]/10">
              <div className="mb-4 overflow-hidden rounded-3xl bg-white shadow-sm">
                <div className="relative h-50">
                  {detail.mapy != null && detail.mapx != null ? (
                    <NaverMap
                      lat={Number(detail.mapy)}
                      lng={Number(detail.mapx)}
                      className="h-full w-full"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-500">
                      위치 정보가 없습니다.
                    </div>
                  )}
                  <Button
                    onClick={handleOpenMap}
                    aria-label="네이버 지도에서 보기 (새 창 열림)"
                    className="absolute right-3 bottom-3 z-10 flex items-center rounded-full bg-white p-0 px-3 py-1.5 text-[12px] font-semibold text-gray-700 shadow-[0_10px_15px_0_rgba(0,0,0,0.1),0_4_6px_0_rgba(0,0,0,0.1)] transition-colors hover:bg-white/90 active:scale-95 active:bg-gray-50"
                  >
                    <ExternalLink size={12} className="mr-1" strokeWidth={2} />
                    지도 앱
                  </Button>
                </div>
              </div>
            </div>

            {!collected && (
              <div className="mb-8 rounded-2xl bg-gray-50 p-4 text-center text-[14px] leading-relaxed text-gray-500">
                <MapPin size={14} className="mr-1 mb-1 inline-block text-blue-500" />
                장소 주변 <span className="font-bold text-gray-900">150m</span> 내에서 탐험을
                시작하고,
                <br />
                <span className="font-bold text-blue-600">50m 이내</span>로 더 다가가 스탬프를
                획득해 보세요!
              </div>
            )}

            <div className="-mx-6 mb-8 h-2 rounded-sm bg-[#F2F4F6]" />

            {detail.overview && (
              <div className="mb-8">
                <h2 className="mb-3 text-[18px] font-semibold text-gray-900">소개</h2>
                <div className="rounded-3xl border border-gray-100 bg-[#FAFBFC] p-5">
                  <p className="text-[15px] leading-[1.7] whitespace-pre-wrap text-gray-700">
                    {detail.overview}
                  </p>
                </div>
              </div>
            )}

            <div className="-mx-6 mb-8 h-2 rounded-sm bg-[#F2F4F6]" />

            <div className="mb-8">
              <h2 className="mb-4 text-[18px] font-semibold text-gray-900">운영 정보</h2>
              <ul className="space-y-3">
                {detail.tel && (
                  <LandmarkInfoItem
                    icon={<Phone size={18} className="text-gray-600" strokeWidth={2} />}
                    label="전화번호"
                    content={detail.tel}
                  />
                )}
                {detail.homepage && (
                  <LandmarkInfoItem
                    icon={<Globe size={18} className="text-gray-600" strokeWidth={2} />}
                    label="홈페이지"
                    content={detail.homepage}
                    isHtml
                  />
                )}
                {intro?.restdate && (
                  <LandmarkInfoItem
                    icon={<Calendar size={18} className="text-gray-600" strokeWidth={2} />}
                    label="휴무일"
                    content={intro?.restdate}
                    isHtml
                  />
                )}
                {intro?.usetime && (
                  <LandmarkInfoItem
                    icon={<Clock size={18} className="text-gray-600" strokeWidth={2} />}
                    label="이용 시간"
                    content={intro?.usetime}
                    isHtml
                  />
                )}
                {intro?.parking && (
                  <LandmarkInfoItem
                    icon={<Car size={18} className="text-gray-600" strokeWidth={2} />}
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

      {/* 4. 스탬프 미션 설명 시트 (150m 진입 시 자동 오픈) */}
      <StampMissionSheet
        isOpen={isMissionSheetOpen}
        onClose={() => setIsMissionSheetOpen(false)}
        onStart={handleStartExplore}
        landmarkName={detail.title}
        distance={distanceToTarget}
        isCollected={collected}
      />

      {/* 5. 레이더 시트 (실제 탐험 진행) */}
      <RadarSheet id={Number(id)} />

      {/* 6. 하단 고정 액션 버튼 영역 (상태별 대응) */}
      {(collected ||
        isExploring ||
        (distanceToTarget !== null && distanceToTarget <= STAMP_CONFIG.DISCOVERY_DISTANCE)) && (
        <div className="fixed right-0 bottom-0 left-0 z-50 flex justify-center bg-linear-to-t from-white via-white/95 to-transparent px-6 pt-10 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
          {collected ? (
            <Button
              disabled
              className="h-15 w-full max-w-120 rounded-2xl bg-gray-100 text-[17px] font-bold text-gray-400 opacity-80"
            >
              수집 완료 ✅
            </Button>
          ) : isExploring ? (
            <Button
              onClick={() => setIsExploring(false)}
              className="h-15 w-full max-w-120 rounded-2xl border-2 border-blue-100 bg-blue-50 text-[17px] font-bold text-blue-600 shadow-sm transition-all active:scale-[0.98]"
            >
              탐험 중...
            </Button>
          ) : (
            <Button
              onClick={() => setIsMissionSheetOpen(true)}
              className="h-15 w-full max-w-120 rounded-2xl bg-blue-600 text-[17px] font-bold text-white shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
            >
              스탬프 발견! 탐험 시작하기
            </Button>
          )}
        </div>
      )}
    </motion.main>
  );
}
