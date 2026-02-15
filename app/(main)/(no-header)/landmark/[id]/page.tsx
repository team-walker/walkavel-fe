'use client';

import { motion } from 'framer-motion';
import { Calendar, Car, Clock, ExternalLink, Globe, MapPin, Phone } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { NaverMap } from '@/components/common/NaverMap';
import { LandmarkImageGallery } from '@/components/landmark/detail/LandmarkImageGallery';
import { LandmarkInfoItem } from '@/components/landmark/detail/LandmarkInfoItem';
import { Button } from '@/components/ui/button';
import { useLandmarkDetail } from '@/hooks/useLandmarkDetail';

export default function LandmarkDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;

  const { data: landmarkData, galleryImages, loading } = useLandmarkDetail(id);

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
          <div className="px-6 pt-6 pb-32">
            <div className="mb-6 rounded-4xl border-2 border-gray-100 bg-white p-5 shadow-sm">
              <h1 className="mb-3 text-[24px] leading-tight font-bold text-gray-900">
                {detail.title}
              </h1>
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

            <div className="-mx-6 mb-8 h-2 rounded-sm bg-[#F2F4F6]"></div>

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
    </motion.main>
  );
}
