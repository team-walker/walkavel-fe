'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  Car,
  CheckCircle2,
  ChevronLeft,
  Clock,
  ExternalLink,
  Globe,
  MapPin,
  Navigation,
  Phone,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { NaverMap } from '@/components/common/NaverMap';
import { getAPIDocumentation } from '@/types/api';
import { LandmarkDetailResponseDto } from '@/types/model';

export default function LandmarkDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;

  const [landmarkData, setLandmarkData] = useState<LandmarkDetailResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isStampAcquired, setIsStampAcquired] = useState(false);
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { tourControllerGetLandmarkDetail } = useMemo(() => getAPIDocumentation(), []);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const response: LandmarkDetailResponseDto = await tourControllerGetLandmarkDetail(id);
        setLandmarkData(response);
      } catch (error) {
        console.error('Failed to fetch landmark detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, tourControllerGetLandmarkDetail]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  const handleBack = () => {
    router.back();
  };

  const galleryImages = useMemo(() => {
    if (!landmarkData) return [];
    const { detail, images } = landmarkData;
    return images && images.length > 0
      ? images.map((img) => img.originimgurl || img.smallimageurl).filter(Boolean)
      : [detail.firstimage || detail.firstimage2].filter(Boolean);
  }, [landmarkData]);

  const paginate = (newDirection: number) => {
    if (galleryImages.length <= 1) return;
    setSlideDirection(newDirection);
    setCurrentSlide((prev) => (prev + newDirection + galleryImages.length) % galleryImages.length);
  };

  const heroHeight = Math.max(240, 360 - scrollY * 0.5);
  const showStickyTitle = scrollY > 200;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 1000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!landmarkData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center">
        <p className="mb-4 text-gray-500">장소 정보를 찾을 수 없습니다.</p>
        <button
          onClick={handleBack}
          className="rounded-full bg-blue-500 px-6 py-2 font-semibold text-white"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  const { detail, images, intro } = landmarkData;

  const handleOpenMap = () => {
    const { title, mapy, mapx } = detail;
    const url = `https://map.naver.com/v5/search/${encodeURIComponent(title)}?c=${mapx},${mapy},15,0,0,0,dh`;
    window.open(url, '_blank');
  };

  const handleStampExplore = () => {
    setIsRadarOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex h-screen flex-col overflow-hidden bg-white"
    >
      {/* Sticky Header */}
      {/* <motion.div
        className="fixed top-0 right-0 left-0 z-30 bg-white shadow-sm"
        initial={{ y: -88 }}
        animate={{ y: showStickyTitle ? 0 : -88 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <div className="flex h-15 items-center px-4">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-900 transition-colors active:bg-gray-100"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          <h2 className="ml-2 flex-1 truncate text-[17px] font-bold text-gray-900">
            {detail.title}
          </h2>
        </div>
      </motion.div> */}

      {/* Scrollable Content */}
      <div
        ref={scrollContainerRef}
        className="no-scrollbar flex-1 overflow-y-auto"
        onScroll={handleScroll}
      >
        {/* Hero: Image Gallery with Parallax */}
        <div
          className="relative w-full overflow-hidden bg-gray-100 transition-all duration-200"
          style={{ height: `${heroHeight}px` }}
        >
          {galleryImages.length > 0 ? (
            <div className="relative h-full w-full">
              <AnimatePresence initial={false} custom={slideDirection}>
                <motion.div
                  key={currentSlide}
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, info) => {
                    const offset = info.offset.x;
                    const velocity = info.velocity.x;
                    const swipe = swipePower(offset, velocity);

                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1);
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1);
                    }
                  }}
                  className="absolute inset-0 h-full w-full touch-pan-y"
                >
                  <ImageWithFallback
                    src={galleryImages[currentSlide] as string}
                    alt={`${detail.title} - ${currentSlide + 1}`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 480px) 100vw, 480px"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
              이미지가 없습니다
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-transparent" />

          {/* Back Button */}
          <button
            onClick={handleBack}
            className="absolute top-6 left-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-md backdrop-blur-sm transition-transform active:scale-95"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>

          {/* Image Counter */}
          {galleryImages.length > 1 && (
            <div className="absolute right-4 bottom-4 z-10 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm">
              <span className="text-[13px] font-semibold text-white">
                {currentSlide + 1}/{galleryImages.length}
              </span>
            </div>
          )}
        </div>
        {/* Content */}
        <div className="bg-white">
          <div className="px-6 pt-6 pb-32">
            {/* Place Header Card */}
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
            {/* 스탬프 & 위치 통합 섹션 - Core Section */}
            <div className="mb-8 rounded-4xl bg-linear-to-br from-[#3182F6]/5 to-[#3182F6]/10">
              {/* Distance Status */}
              {/* <div className="mb-4 flex items-center justify-center">
                <div className="rounded-full bg-white px-4 py-2 shadow-sm">
                  <p className="text-[14px] font-semibold text-gray-700">
                    지금 위치에서 약 <span className="text-[#3182F6]">120m</span>
                  </p>
                </div>
              </div> */}

              {/* Mini Map Card */}
              <div className="mb-4 overflow-hidden rounded-3xl bg-white shadow-sm">
                <div className="relative h-50">
                  <NaverMap
                    lat={Number(detail.mapy)}
                    lng={Number(detail.mapx)}
                    className="h-full w-full"
                  />
                  {/* Open Map Button */}
                  <button
                    onClick={handleOpenMap}
                    className="absolute right-2 bottom-4 z-10 flex items-center rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-700 shadow-sm transition-colors active:bg-gray-50"
                  >
                    <ExternalLink size={12} className="mr-1" strokeWidth={2} />
                    지도 앱
                  </button>
                </div>
              </div>

              {/* Primary CTA 
              {!isStampAcquired ? (
                <motion.button
                  onClick={handleStampExplore}
                  className="flex h-14 w-full items-center justify-center rounded-3xl bg-[#3182F6] text-[16px] font-bold text-white shadow-md transition-all active:scale-[0.98]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Navigation size={20} className="mr-2" strokeWidth={2.5} />
                  근처에서 스탬프 탐험하기
                </motion.button>
              ) : (
                <div className="flex h-14 w-full items-center justify-center rounded-3xl bg-[#F2F4F6] text-[16px] font-bold text-gray-600">
                  <CheckCircle2 size={20} className="mr-2 text-[#3182F6]" strokeWidth={2.5} />
                  수집 완료
                </div>
              )}
                */}
            </div>

            {/* Divider */}
            <div className="-mx-6 mb-8 h-2 rounded-sm bg-[#F2F4F6]"></div>

            {/* Overview Section */}
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

            {/* Divider */}
            <div className="-mx-6 mb-8 h-2 rounded-sm bg-[#F2F4F6]"></div>

            {/* Details Section */}
            <div className="mb-8">
              <h2 className="mb-4 text-[18px] font-semibold text-gray-900">운영 정보</h2>

              <div className="space-y-3">
                {/* Phone */}
                {detail.tel && (
                  <div className="flex items-start rounded-2xl border border-gray-100 bg-white p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2F4F6]">
                      <Phone size={18} className="text-gray-600" strokeWidth={2} />
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <div className="mb-1 text-[13px] text-gray-500">전화번호</div>
                      <div className="text-[15px] font-medium text-gray-900">{detail.tel}</div>
                    </div>
                  </div>
                )}
                {/* Website */}
                {detail.homepage && (
                  <div className="flex items-start rounded-2xl border border-gray-100 bg-white p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2F4F6]">
                      <Globe size={18} className="text-gray-600" strokeWidth={2} />
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <div className="mb-1 text-[13px] text-gray-500">홈페이지</div>
                      <div
                        className="text-[15px] font-medium break-all text-gray-900"
                        dangerouslySetInnerHTML={{ __html: detail.homepage }}
                      />
                    </div>
                  </div>
                )}
                {/* Closed Day */}
                {intro?.restdate && (
                  <div className="flex items-start rounded-2xl border border-gray-100 bg-white p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2F4F6]">
                      <Calendar size={18} className="text-gray-600" strokeWidth={2} />
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <div className="mb-1 text-[13px] text-gray-500">휴무일</div>
                      <div
                        className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap text-gray-900"
                        dangerouslySetInnerHTML={{ __html: intro.restdate }}
                      />
                    </div>
                  </div>
                )}
                {/* Operating Hours */}
                {intro?.usetime && (
                  <div className="flex items-start rounded-2xl border border-gray-100 bg-white p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2F4F6]">
                      <Clock size={18} className="text-gray-600" strokeWidth={2} />
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <div className="mb-1 text-[13px] text-gray-500">이용 시간</div>
                      <div
                        className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap text-gray-900"
                        dangerouslySetInnerHTML={{ __html: intro.usetime }}
                      />
                    </div>
                  </div>
                )}
                {/* Parking */}
                {intro?.parking && (
                  <div className="flex items-start rounded-2xl border border-gray-100 bg-white p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2F4F6]">
                      <Car size={18} className="text-gray-600" strokeWidth={2} />
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <div className="mb-1 text-[13px] text-gray-500">주차</div>
                      <div
                        className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap text-gray-900"
                        dangerouslySetInnerHTML={{ __html: intro.parking }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
