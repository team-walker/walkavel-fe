'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import FootLogoIcon from '@/public/images/foot-logo.svg';

interface SplashScreenProps {
  onComplete: () => void;
  isAppReady: boolean;
  minDisplayTime?: number;
}

export function StaticSplash() {
  return (
    <div className="fixed inset-0 z-10000 flex flex-col items-center justify-center bg-white p-6">
      <div className="flex flex-col items-center gap-4 sm:gap-6">
        <div className="bg-brand-blue shadow-brand-blue/15 mb-14 flex h-25 w-25 items-center justify-center rounded-4xl shadow-xl">
          <FootLogoIcon className="h-12 w-12 text-white" />
        </div>

        <div className="text-center">
          <h1 className="font-outfit text-brand-blue text-2xl font-bold tracking-tight sm:text-3xl">
            Walkavel
          </h1>
          <p className="text-walkavel-gray-400 mt-2 px-4 text-xs font-medium sm:text-sm">
            일상의 발걸음을 여행으로, 워커블
          </p>
        </div>
      </div>

      <div className="absolute bottom-24 flex items-center gap-3 pb-[env(safe-area-inset-bottom)]">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-brand-blue h-2 w-2 animate-bounce rounded-full"
            style={{ animationDelay: `${i * 0.15}s`, opacity: 0.6 }}
          />
        ))}
      </div>
    </div>
  );
}

export default function SplashScreen({
  onComplete,
  isAppReady,
  minDisplayTime = 2000,
}: SplashScreenProps) {
  const [startTime] = useState(() => Date.now());

  useEffect(() => {
    if (window.innerWidth >= 768) {
      onComplete();
      return;
    }

    if (isAppReady) {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);

      const timer = setTimeout(() => {
        onComplete();
      }, remainingTime);

      return () => clearTimeout(timer);
    }
  }, [isAppReady, minDisplayTime, onComplete, startTime]);

  return (
    <div
      data-testid="splash-screen"
      className="flex h-dvh w-full flex-col items-center justify-center bg-white p-6"
    >
      <div className="flex flex-col items-center gap-4 sm:gap-6">
        <div className="bg-brand-blue shadow-brand-blue/15 mb-14 flex h-25 w-25 items-center justify-center rounded-4xl shadow-xl">
          <FootLogoIcon className="h-12 w-12 text-white" />
        </div>

        <div className="text-center">
          <h1 className="font-outfit text-brand-blue text-2xl font-bold tracking-tight sm:text-3xl">
            Walkavel
          </h1>
          <p className="text-walkavel-gray-400 mt-2 px-4 text-xs font-medium sm:text-sm">
            일상의 발걸음을 여행으로, 워커블
          </p>
        </div>
      </div>

      <div className="absolute bottom-24 flex items-center gap-3 pb-[env(safe-area-inset-bottom)]">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -8, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
            className="bg-brand-blue h-2 w-2 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
