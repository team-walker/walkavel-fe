'use client';

import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';

interface RadarAnimationProps {
  distance: number | null;
}

export function RadarAnimation({ distance }: RadarAnimationProps) {
  const duration = distance ? Math.max(1, Math.min(3, distance / 100)) : 2;

  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden">
      <motion.div
        className="border-brand-blue/30 absolute h-140 w-140 rounded-full border-4 opacity-13"
        animate={{ scale: [0.8, 1.1], opacity: [0.13, 0.05] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="border-brand-blue/30 absolute h-112 w-md rounded-full border-4 opacity-43"
        animate={{ scale: [0.9, 1.1], opacity: [0.43, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.div
        className="border-brand-blue/30 absolute h-44 w-44 rounded-full border-4 opacity-80"
        animate={{ scale: [1, 1.2], opacity: [0.84, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <motion.div
        className="border-brand-blue/40 absolute h-72 w-72 rounded-full border-t-2 border-l-2"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      <div className="bg-brand-blue shadow-brand-blue/20 relative z-10 flex h-24 w-24 items-center justify-center rounded-full shadow-xl">
        <Navigation size={40} className="fill-white text-white" />
      </div>
    </div>
  );
}

RadarAnimation.Icon = Navigation;
