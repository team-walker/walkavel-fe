'use client';

import { motion, PanInfo, useMotionValue, Variants } from 'framer-motion';
import { MapPin } from 'lucide-react';

import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
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

    const threshold = 100;
    const velocityThreshold = 500;

    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      onSwipe?.('left');
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      if (isFirstCard) return;
      onSwipe?.('right');
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmark?.(data);
    console.log('Bookmark clicked:', data.contentid);
  };

  const handleCardClick = () => {
    if (isTop && Math.abs(x.get()) < 5) {
      onClick?.(data.contentid);
    }
  };

  const variants: Variants = {
    initial: (dir: DIRECTION | null) => ({
      x: dir === 'right' ? -1000 : 0,
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
              delay: 0.5,
              duration: 0.6,
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
      x: dir === 'left' ? -1000 : dir === 'right' ? 1000 : 0,
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
      <Card className="pointer-events-none relative flex h-full w-full flex-col overflow-hidden rounded-[28px] border-none p-0 shadow-[0px_8px_32px_-8px_rgba(0,0,0,0.12),0px_0px_1px_0px_rgba(0,0,0,0.05)] transition-shadow">
        {imageUrl ? (
          <ImageWithFallback
            src={imageUrl}
            alt={data.title}
            fill
            className="object-cover object-[center_30%]"
            priority={isTop}
            loading={isTop ? 'eager' : 'lazy'}
            unoptimized={imageUrl.includes('visitkorea.or.kr')}
            sizes="(max-width: 480px) 100vw, 480px"
            quality={85}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-100">
            <span className="text-sm font-medium text-zinc-400">이미지가 없습니다</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[rgba(0,0,0,0.2)] via-50% to-[rgba(0,0,0,0.8)]" />

        <div className="pointer-events-auto absolute top-5 right-6 z-20">
          <Button
            onClick={handleBookmarkClick}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/95 p-0 shadow-[0_10px_15px_0_rgba(0,0,0,0.1),0_4_6px_0_rgba(0,0,0,0.1)] transition-transform hover:bg-white/70 active:scale-95"
          >
            <BookmarkIcon
              className={cn(
                'stroke-2.5 h-5 w-5 transition-colors',
                isBookmarked ? 'fill-[#3182F6] text-[#3182F6]' : 'text-gray-700',
              )}
            />
          </Button>
        </div>

        <div className="relative z-10 mt-auto px-6 py-6 text-white">
          <motion.div layoutId={`info-container-${data.contentid}`} className="flex flex-col gap-2">
            <motion.h2
              layoutId={`title-${data.contentid}`}
              className="text-[28px] leading-tight font-bold tracking-[0.38px] drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
            >
              {data.title}
            </motion.h2>
            <div className="flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
              <MapPin className="h-4 w-4 text-white/90" />
              <motion.p
                layoutId={`addr-${data.contentid}`}
                className="truncate text-[15px] font-medium tracking-[-0.23px] text-white/90"
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
