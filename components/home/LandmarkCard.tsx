'use client';

import { motion, PanInfo, useMotionValue, Variants } from 'framer-motion';
import { ImageOff, MapPin } from 'lucide-react';

import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { Card } from '@/components/ui/card';
import { SWIPE_CONFIG } from '@/constants/types';
import { cn } from '@/lib/utils';
import { triggerVibration, VIBRATION_PATTERNS } from '@/lib/utils/pwa';
import BookmarkIcon from '@/public/images/bookmark.svg';
import { LandmarkDto } from '@/types/model';

import { Button } from '../ui/button';

type DIRECTION = 'left' | 'right';

interface LandmarkCardProps {
  data: LandmarkDto;
  onSwipe?: (direction: DIRECTION) => void;
  onDragStart?: () => void;
  onClick?: (id: number) => void;
  onBookmark?: (landmark: LandmarkDto) => void;
  isTop?: boolean;
  isBookmarked?: boolean;
  direction?: DIRECTION | null;
  shouldWiggle?: boolean;
  isFirstCard?: boolean;
}

export default function LandmarkCard({
  data,
  onSwipe,
  onDragStart,
  onClick,
  onBookmark,
  isTop,
  isBookmarked,
  direction,
  shouldWiggle,
  isFirstCard,
}: LandmarkCardProps) {
  const x = useMotionValue(0);

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isTop) return;

    if (
      info.offset.x < -SWIPE_CONFIG.SWIPE_THRESHOLD ||
      info.velocity.x < -SWIPE_CONFIG.VELOCITY_THRESHOLD
    ) {
      triggerVibration(VIBRATION_PATTERNS.SWIPE);
      onSwipe?.('left');
    } else if (
      info.offset.x > SWIPE_CONFIG.SWIPE_THRESHOLD ||
      info.velocity.x > SWIPE_CONFIG.VELOCITY_THRESHOLD
    ) {
      if (isFirstCard) return;
      triggerVibration(VIBRATION_PATTERNS.SWIPE);
      onSwipe?.('right');
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmark?.(data);
    triggerVibration(VIBRATION_PATTERNS.SWIPE);
  };

  const handleCardClick = () => {
    if (isTop && Math.abs(x.get()) < 5) {
      onClick?.(data.contentid);
    }
  };

  const variants: Variants = {
    initial: (dir: DIRECTION | null) => ({
      x: dir === 'right' ? -SWIPE_CONFIG.EXIT_X : 0,
      opacity: 0,
      scale: 0.9,
    }),
    animate: {
      x: shouldWiggle ? [0, -10, 10, -10, 10, 0] : 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: shouldWiggle
          ? {
              delay: SWIPE_CONFIG.WIGGLE_DELAY,
              duration: SWIPE_CONFIG.WIGGLE_DURATION,
              ease: 'easeInOut',
            }
          : {
              type: 'spring',
              stiffness: 400,
              damping: 30,
              mass: 1,
            },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
      },
    },
    exit: (dir: DIRECTION | null) => ({
      x: dir === 'left' ? -SWIPE_CONFIG.EXIT_X : dir === 'right' ? SWIPE_CONFIG.EXIT_X : 0,
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 },
    }),
  };

  const imageUrl = data.firstimage || data.firstimage2;

  return (
    <motion.div
      data-testid="landmark-card"
      custom={direction}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={handleCardClick}
      style={{
        x,
        position: 'absolute',
        inset: 0,
        zIndex: isTop ? 10 : 0,
        touchAction: 'none',
        cursor: isTop ? 'pointer' : 'default',
        scale: isTop ? 1 : 0.95,
        opacity: isTop ? 1 : 0.6,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={isFirstCard ? { left: 0.8, right: 0.1 } : 0.8}
      onDragStart={onDragStart}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: isTop ? 1.01 : 1 }}
      className="flex h-full flex-col"
    >
      <Card className="pointer-events-none relative flex h-full w-full flex-col overflow-hidden rounded-3xl border-none p-0 shadow-[0px_8px_32px_-8px_rgba(0,0,0,0.12),0px_0px_1px_0px_rgba(0,0,0,0.05)] transition-shadow">
        {imageUrl ? (
          <ImageWithFallback
            src={imageUrl}
            alt={data.title}
            fill
            className="object-cover object-[center_30%]"
            priority={isTop}
            unoptimized={imageUrl.includes('visitkorea.or.kr')}
            sizes="(max-width: 480px) 100vw, 480px"
            quality={85}
          />
        ) : (
          <div className="bg-walkavel-gray-100 flex h-full w-full flex-col items-center justify-center gap-3">
            <div className="bg-walkavel-gray-200/50 flex h-16 w-16 items-center justify-center rounded-full">
              <ImageOff className="text-walkavel-gray-400 h-8 w-8" strokeWidth={1.5} />
            </div>
            <span className="text-walkavel-gray-500 text-sm font-medium">이미지 준비 중입니다</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[rgba(0,0,0,0.2)] via-50% to-[rgba(0,0,0,0.8)]" />

        <div className="pointer-events-auto absolute top-4 right-4 z-20 sm:top-5 sm:right-6">
          <Button
            onClick={handleBookmarkClick}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/95 p-0 shadow-lg transition-transform hover:bg-white/70 active:scale-95"
            aria-label={isBookmarked ? '북마크 취소' : '북마크 추가'}
          >
            <BookmarkIcon
              className={cn(
                'h-5 w-5 stroke-[2.5] transition-colors',
                isBookmarked ? 'fill-brand-blue text-brand-blue' : 'text-walkavel-gray-700',
              )}
            />
          </Button>
        </div>

        <div className="relative z-10 mt-auto px-5 py-6 text-white sm:px-6">
          <motion.div
            layoutId={`info-container-${data.contentid}`}
            className="flex flex-col gap-1.5 sm:gap-2"
          >
            <motion.h2
              layoutId={`title-${data.contentid}`}
              className="line-clamp-2 text-2xl font-bold tracking-tight break-keep drop-shadow-md sm:text-3xl"
            >
              {data.title}
            </motion.h2>
            <div className="flex items-center gap-1.5 drop-shadow-sm">
              <MapPin className="h-4 w-4 shrink-0 text-white/90" />
              <motion.p
                layoutId={`addr-${data.contentid}`}
                className="truncate text-sm font-medium tracking-tight text-white/90 sm:text-base"
              >
                {data.addr1 || '상세 주소 정보가 없습니다.'}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
