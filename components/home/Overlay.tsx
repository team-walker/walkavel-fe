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
      className="fixed inset-y-0 left-1/2 z-100 flex w-full max-w-120 -translate-x-1/2 items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative mx-6 flex w-full max-w-[320px] flex-col items-center overflow-hidden rounded-[40px] bg-white px-8 pt-12 pb-10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-walkavel-gray-50 relative mb-10 flex h-36 w-full items-center justify-center overflow-hidden rounded-[24px]">
          <motion.div
            animate={{ x: [40, -40, 40] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: 'easeInOut',
            }}
            className="flex gap-4"
          >
            <div className="bg-walkavel-gray-200 h-28 w-24 shrink-0 rounded-2xl" />
            <div className="\ bg-brand-blue/20 outline-brand-blue/30 h-28 w-24 shrink-0 rounded-2xl shadow-sm outline-2" />
            <div className="bg-walkavel-gray-200 h-28 w-24 shrink-0 rounded-2xl" />
          </motion.div>

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

        <div className="text-center">
          <p className="text-walkavel-gray-900 text-[18px] leading-tight font-bold tracking-tight">
            옆으로 밀어서
            <br />
            랜드마크를 둘러보세요
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
