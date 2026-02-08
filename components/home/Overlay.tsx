'use client';

import { motion } from 'framer-motion';
import { Pointer } from 'lucide-react';

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
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[5px]"
    >
      <div className="flex flex-col items-center gap-10 text-white">
        <div className="relative flex h-40 w-64 items-center justify-center">
          <div className="absolute h-1 w-48 rounded-full bg-white/20" />
          <motion.div
            animate={{
              x: [80, -80],
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1, 1, 0.8],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'easeInOut',
              times: [0, 0.2, 0.8, 1],
            }}
            className="relative z-10 select-none"
          >
            <Pointer
              size={80}
              className="rotate-[-20deg] fill-white/20 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
              className="absolute top-0 right-0 h-10 w-10 translate-x-1 -translate-y-1 rounded-full border border-white bg-white/40"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-full border border-white/20 bg-black/80 px-8 py-4 shadow-2xl"
        >
          <p className="text-lg font-bold tracking-tight text-white">
            옆으로 밀어서 랜드마크를 둘러보세요
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
