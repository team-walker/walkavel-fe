'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { Button } from '@/components/ui/button';

interface LandmarkImageGalleryProps {
  images: string[];
  title: string;
  onBack: () => void;
}

export function LandmarkImageGallery({ images, title, onBack }: LandmarkImageGalleryProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);

  const paginate = (newDirection: number) => {
    if (images.length <= 1) return;
    setSlideDirection(newDirection);
    setCurrentSlide((prev) => (prev + newDirection + images.length) % images.length);
  };

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

  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-100">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {images.length > 0
          ? `${images.length}장 중 ${currentSlide + 1}번째 이미지: ${title}`
          : '이미지가 없습니다'}
      </div>
      {images.length > 0 ? (
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
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                const threshold = 50;
                const velocityThreshold = 500;

                if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
                  paginate(1);
                } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute inset-0 h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
            >
              <ImageWithFallback
                src={images[currentSlide]}
                alt={`${title} 이미지 ${currentSlide + 1}`}
                fill
                className="object-cover select-none"
                priority
                loading="eager"
                unoptimized={images[currentSlide]?.includes('visitkorea.or.kr')}
                sizes="(max-width: 480px) 100vw, 480px"
                onDragStart={(e) => e.preventDefault()}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
          이미지가 없습니다
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-transparent" />

      <Button
        onClick={onBack}
        aria-label="이전 페이지로 돌아가기"
        className="absolute top-[calc(env(safe-area-inset-top)+1.5rem)] left-6 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white p-0 text-gray-900 shadow-md backdrop-blur-sm transition-transform hover:bg-white/70 active:scale-95"
      >
        <ChevronLeft size={24} strokeWidth={2.5} />
      </Button>

      {images.length > 1 && (
        <div
          aria-hidden="true"
          className="absolute right-4 bottom-4 z-10 flex items-center justify-center rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm"
        >
          <span className="text-[12px] leading-none font-medium tracking-tighter text-white tabular-nums">
            {currentSlide + 1}/{images.length}
          </span>
        </div>
      )}
    </div>
  );
}
