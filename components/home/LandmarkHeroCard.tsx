'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import React from 'react';

import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { cn } from '@/lib/utils';
import BookmarkIcon from '@/public/images/bookmark.svg';

import { Button } from '../ui/button';

interface LandmarkHeroCardProps {
  landmark: {
    id: number;
    name: string;
    location: string;
    image: string;
  };
  isBookmarked?: boolean;
  onSelect?: () => void;
  onToggleBookmark?: (e: React.MouseEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function LandmarkHeroCard({
  landmark,
  isBookmarked,
  onSelect,
  onToggleBookmark,
  className,
  style,
}: LandmarkHeroCardProps) {
  return (
    <motion.div
      className={cn(
        'relative h-full w-full cursor-pointer overflow-hidden rounded-[28px] bg-white select-none',
        className,
      )}
      style={{
        ...style,
        boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.05)',
      }}
      onTap={onSelect}
    >
      <ImageWithFallback
        src={landmark.image}
        alt={landmark.name}
        fill
        priority
        unoptimized={landmark.image.includes('visitkorea.or.kr')}
        sizes="(max-width: 480px) 100vw, 480px"
        className="pointer-events-none h-full w-full object-cover object-[center_30%]"
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-[rgba(0,0,0,0.2)] via-50% to-[rgba(0,0,0,0.8)]" />

      <Button
        onClick={(e) => {
          e.stopPropagation();
          onToggleBookmark?.(e);
        }}
        className="absolute top-5 right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-[0_10px_15px_0_rgba(0,0,0,0.1),0_4_6px_0_rgba(0,0,0,0.1)] transition-all hover:bg-white/70 active:scale-95"
      >
        <BookmarkIcon
          className={cn(
            'stroke-2.5 h-5 w-5 transition-colors',
            isBookmarked ? 'fill-brand-blue text-brand-blue' : 'text-walkavel-gray-700',
          )}
        />
      </Button>

      <div className="absolute right-0 bottom-0 left-0 flex flex-col px-6 py-6 transition-all">
        <div className="flex flex-col gap-2">
          <h2 className="text-[28px] leading-tight font-bold tracking-[0.38px] text-white [text-shadow:0_4px_8px_rgba(0,0,0,0.15)]">
            {landmark.name}
          </h2>
          <div className="flex items-center gap-1.5 text-white/90 [text-shadow:0_1px_4px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]">
            <MapPin size={16} className="shrink-0" />
            <span className="truncate text-[15px] font-medium tracking-[-0.23px]">
              {landmark.location}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
