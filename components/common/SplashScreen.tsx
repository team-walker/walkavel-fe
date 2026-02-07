'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface SplashScreenProps {
  onComplete: () => void;
  isAppReady: boolean;
  minDisplayTime?: number;
}

export default function SplashScreen({
  onComplete,
  isAppReady,
  minDisplayTime = 2000,
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(mountTimer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  useEffect(() => {
    if (!mounted || !minTimePassed || !isAppReady) return;

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 0);

    const exitTimer = setTimeout(() => {
      onComplete();
    }, 800);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(exitTimer);
    };
  }, [mounted, isAppReady, minTimePassed, onComplete]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-9999 flex h-dvh w-full flex-col items-center justify-center bg-white p-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              ease: [0, 0.71, 0.2, 1.01],
              scale: {
                type: 'spring',
                damping: 12,
                stiffness: 100,
                restDelta: 0.001,
              },
            }}
            className="flex flex-col items-center gap-4 sm:gap-6"
          >
            <div className="relative h-20 w-20 sm:h-24 sm:w-24">
              <Image
                src="/icons/logo.svg"
                alt="Walkavel Logo"
                fill
                priority
                className="object-contain"
              />
            </div>

            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="font-outfit text-2xl font-bold tracking-tight text-blue-600 sm:text-3xl"
              >
                Walkavel
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="mt-2 px-4 text-xs font-medium text-gray-400 sm:text-sm"
              >
                우리만의 걷기 좋은 길, 특별한 여행의 시작
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-12 mb-[env(safe-area-inset-bottom)] flex items-center gap-2 sm:bottom-16"
          >
            <div className="h-1 w-1 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]" />
            <div className="h-1 w-1 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.15s]" />
            <div className="h-1 w-1 animate-bounce rounded-full bg-blue-400" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
