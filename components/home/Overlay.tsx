'use client';

import { motion } from 'framer-motion';

interface OverlayProps {
  onDismiss: () => void;
}

export default function Overlay({ onDismiss }: OverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDismiss}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative mx-6 flex w-full max-w-[320px] flex-col items-center overflow-hidden rounded-[40px] bg-white px-8 pt-12 pb-10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 일러스트레이션 영역: 피그마 스타일의 스와이프 미리보기 */}
        <div className="relative mb-10 flex h-36 w-full items-center justify-center overflow-hidden rounded-[24px] bg-zinc-50">
          {/* 가상 카드 뭉치: 손가락 움직임에 맞춰 반대로 슬라이딩 */}
          <motion.div
            animate={{ x: [40, -40, 40] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: 'easeInOut',
            }}
            className="flex gap-4"
          >
            <div className="h-28 w-24 shrink-0 rounded-2xl bg-zinc-200" />
            <div className="\ h-28 w-24 shrink-0 rounded-2xl bg-[#3182F6]/20 shadow-sm outline-2 outline-[#3182F6]/30" />
            <div className="h-28 w-24 shrink-0 rounded-2xl bg-zinc-200" />
          </motion.div>

          {/* 스와이프하는 손 가이드: 카드 위에서 좌우로 이동 */}
          <motion.div
            animate={{
              x: [-60, 60, -60],
              y: [0, -5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: 'easeInOut',
            }}
            className="absolute text-[56px] drop-shadow-lg select-none"
          >
            👆
          </motion.div>
        </div>

        {/* 텍스트 영역: 피그마 타이포그래피 반영 */}
        <div className="text-center">
          <p className="text-[18px] leading-tight font-bold tracking-tight text-[#1D293D]">
            옆으로 밀어서
            <br />
            랜드마크를 둘러보세요
          </p>
          {/* <div className="mt-4 inline-flex items-center rounded-full bg-zinc-100 px-4 py-1.5 text-[13px] font-medium text-zinc-500">
            좌우 스와이프 가이드
          </div> */}
        </div>
      </motion.div>
    </motion.div>
  );
}
