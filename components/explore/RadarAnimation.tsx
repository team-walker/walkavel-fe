'use client';

import { motion } from 'framer-motion';
import { Footprints } from 'lucide-react';

interface RadarAnimationProps {
  distance: number | null;
}

export function RadarAnimation({ distance }: RadarAnimationProps) {
  // 거리가 가까울수록 파동이 빨라지도록 설정 (최소 1초 ~ 최대 3초)
  const duration = distance ? Math.max(1, Math.min(3, distance / 100)) : 2;

  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden">
      {/* 바깥쪽 파동 1 (Figma: opacity 13%) */}
      <motion.div
        className="absolute h-140 w-140 rounded-full border-[3.8px] border-blue-500/30 opacity-13"
        animate={{ scale: [0.8, 1.1], opacity: [0.13, 0.05] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* 중간 파동 2 (Figma: opacity 43%) */}
      <motion.div
        className="absolute h-112 w-md rounded-full border-[3.8px] border-blue-500/30 opacity-43"
        animate={{ scale: [0.9, 1.1], opacity: [0.43, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      {/* 안쪽 파동 3 (Figma: opacity 84%) */}
      <motion.div
        className="absolute h-44 w-44 rounded-full border-[3.8px] border-blue-500/30 opacity-80"
        animate={{ scale: [1, 1.2], opacity: [0.84, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* 레이더 스캔 효과 (Figma 스타일은 아니지만 가독성/역동성을 위해 유지하되 색상 조정) */}
      <motion.div
        className="absolute h-72 w-72 rounded-full border-t-2 border-l-2 border-blue-500/40"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* 중앙 아이콘 (내 위치) - Figma: #3182f6 shadow-lg */}
      <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-[#3182f6] shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)]">
        <Footprints size={40} className="text-white" />
      </div>
    </div>
  );
}

RadarAnimation.Icon = Footprints;
