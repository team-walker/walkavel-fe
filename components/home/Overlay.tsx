'use client';

import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

interface OverlayProps {
  onDismiss: () => void;
}

export default function Overlay({ onDismiss }: OverlayProps) {
  const target = typeof document !== 'undefined' ? document.getElementById('app-frame') : null;

  if (!target) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDismiss}
      className="absolute inset-0 z-10001 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-120 px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative mx-auto flex w-full max-w-80 flex-col items-center overflow-hidden rounded-4xl bg-white px-8 pt-12 pb-10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-walkavel-gray-50 relative mb-10 flex h-36 w-full items-center justify-center overflow-hidden rounded-3xl">
            <motion.div
              animate={{ x: [60, -60, 60] }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: 'easeInOut',
              }}
              className="flex gap-4"
            >
              <div className="bg-walkavel-gray-200 h-28 w-24 shrink-0 rounded-2xl" />
              <div className="bg-brand-blue/20 outline-brand-blue/30 h-28 w-24 shrink-0 rounded-2xl shadow-sm outline-2" />
              <div className="bg-walkavel-gray-200 h-28 w-24 shrink-0 rounded-2xl" />
            </motion.div>

            <motion.div
              animate={{
                x: [60, -60, 60],
                y: [0, -5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: 'easeInOut',
              }}
              className="pointer-events-none absolute text-5xl drop-shadow-lg select-none"
            >
              👆
            </motion.div>
          </div>

          <div className="text-center">
            <h3 className="text-walkavel-gray-900 mb-2 text-xl font-bold tracking-tight break-keep">
              카드를 옆으로 밀어보세요
            </h3>
            <p className="text-walkavel-gray-500 text-sm leading-relaxed font-medium break-keep">
              스와이프해서 새로운 장소를
              <br />
              발견해 보세요
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>,
    target,
  );
}
