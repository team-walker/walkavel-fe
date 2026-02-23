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
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="border-brand-blue absolute h-24 w-24 rounded-full border"
          animate={{
            scale: [1, 8],
            opacity: [0, 0.25, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeOut',
            delay: i * 2,
          }}
        />
      ))}

      <div className="bg-brand-blue shadow-brand-blue/20 relative z-10 flex h-24 w-24 items-center justify-center rounded-full shadow-xl">
        <motion.div
          animate={{
            y: [-1, 1, -1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Navigation size={40} className="fill-white text-white" />
        </motion.div>
      </div>
    </div>
  );
}

RadarAnimation.Icon = Navigation;
