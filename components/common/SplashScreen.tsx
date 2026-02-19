'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import FootLogoIcon from '@/public/images/foot-logo.svg';

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

  useEffect(() => {
    // 모바일 환경이 아니면 즉시 완료 처리 (데스크탑 대응)
    if (window.innerWidth >= 768) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      // 로딩이 완료되었을 때만 시작
      if (isAppReady) {
        setIsVisible(false);
        setTimeout(onComplete, 800); // exit 애니메이션 시간 대기
      }
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [isAppReady, minDisplayTime, onComplete]);

  // isAppReady가 나중에 true가 되었을 때를 대비한 effect
  useEffect(() => {
    if (isAppReady && isVisible) {
      const checkTimer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onComplete, 800);
      }, minDisplayTime);
      return () => clearTimeout(checkTimer);
    }
  }, [isAppReady, minDisplayTime, onComplete, isVisible]);

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          data-testid="splash-screen"
          className="fixed inset-y-0 left-1/2 z-9999 flex h-dvh w-full max-w-120 -translate-x-1/2 flex-col items-center justify-center bg-white p-6"
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
            <div className="bg-brand-blue shadow-brand-blue/15 mb-14 flex h-25 w-25 items-center justify-center rounded-[32px] shadow-xl">
              <FootLogoIcon className="h-12 w-12 text-white" />
            </div>

            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="font-outfit text-brand-blue text-2xl font-bold tracking-tight sm:text-3xl"
              >
                Walkavel
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="text-walkavel-gray-400 mt-2 px-4 text-xs font-medium sm:text-sm"
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
            <div className="bg-brand-blue h-1 w-1 animate-bounce rounded-full [animation-delay:-0.3s]" />
            <div className="bg-brand-blue h-1 w-1 animate-bounce rounded-full [animation-delay:-0.15s]" />
            <div className="bg-brand-blue h-1 w-1 animate-bounce rounded-full" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
