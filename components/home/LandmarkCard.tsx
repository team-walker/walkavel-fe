'use client';

import { motion, PanInfo, useMotionValue, Variants } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

import { Card } from '@/components/ui/card';
import BookmarkIcon from '@/public/images/bookmark.svg';
import { LandmarkDto } from '@/types/model';

type DIRECTION = 'left' | 'right';

interface LandmarkcardProps {
  data: LandmarkDto;
  onSwipe?: (direction: DIRECTION) => void;
  onDragStart?: () => void;
  onClick?: (id: number) => void;
  onBookmark?: (id: number) => void;
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
}: LandmarkcardProps) {
  const x = useMotionValue(0);
  const [imageError, setImageError] = useState(false);

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
    onBookmark?.(data.contentid);
    console.log('Bookmark clicked:', data.contentid);
  };

  const handleCardClick = () => {
    if (isTop) {
      onClick?.(data.contentid);
    }
  };

  const variants: Variants = {
    initial: (dir: DIRECTION | null) => ({
      x: dir === 'right' ? -1000 : 0, // 이전 카드로 돌아올 때 왼쪽에서 들어옴
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
      className="flex h-full flex-col py-4"
    >
      <Card className="pointer-events-none relative flex h-full w-full flex-col overflow-hidden rounded-[40px] border-none p-0 transition-shadow">
        {!imageError && (data.firstimage || data.firstimage2) ? (
          <Image
            src={data.firstimage || data.firstimage2 || ''}
            alt={data.title}
            fill
            className="object-cover object-[center_30%]"
            priority={isTop}
            sizes="(max-width: 768px) 100vw, 500px"
            quality={85}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-100">
            <span className="text-sm font-medium text-zinc-400">이미지를 불러올 수 없습니다</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent" />

        <div className="pointer-events-auto absolute top-6 right-6 z-20">
          <button
            onClick={handleBookmarkClick}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/20 p-0 backdrop-blur-xl transition hover:bg-white/40 active:scale-90"
          >
            <BookmarkIcon
              className={`h-6 w-6 transition-colors ${
                isBookmarked ? 'fill-[#3182F6] text-[#3182F6]' : 'text-white'
              }`}
            />
          </button>
        </div>

        <div className="relative z-10 mt-auto p-10 text-white">
          <motion.h2
            layoutId={`title-${data.contentid}`}
            className="mb-3 text-4xl leading-[1.1] font-bold tracking-tight"
          >
            {data.title}
          </motion.h2>
          <motion.p
            layoutId={`addr-${data.contentid}`}
            className="line-clamp-2 text-lg font-medium text-white/80"
          >
            {data.addr1 || '상세 주소 정보가 없습니다.'}
          </motion.p>
        </div>
      </Card>
    </motion.div>
  );
}
