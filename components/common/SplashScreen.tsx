'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface SplashScreenProps {
  onComplete: () => void;
  isAppReady: boolean; // 앱 초기화(데이터 로딩 등) 완료 여부
  minDisplayTime?: number; // 최소 노출 시간 (ms)
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
    // eslint-disable-next-line
    setMounted(true);

    // 최소 노출 시간 타이머 시작
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  useEffect(() => {
    if (!mounted) return;

    const isMobileDevice = () => {
      const userAgent = typeof window !== 'undefined' ? navigator.userAgent : '';
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent,
      );
      const narrowScreen = typeof window !== 'undefined' && window.innerWidth < 768;
      return mobile || narrowScreen;
    };

    // 모바일이 아니면 바로 종료 (필요하다면 로직 변경 가능)
    // 개발 및 테스트를 위해 일시적으로 모바일 체크 비활성화
    if (!isMobileDevice()) {
      onComplete();
      return;
    }

    // 앱 준비 완료 + 최소 시간 경과 시 퇴장 애니메이션 시작
    if (isAppReady && minTimePassed) {
      // 비동기로 상태 업데이트하여 렌더링 사이클 충돌 방지
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 0);

      // 퇴장 애니메이션(0.8s)이 끝난 후 언마운트
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 800);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(exitTimer);
      };
    }
  }, [mounted, isAppReady, minTimePassed, onComplete]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex h-dvh w-full flex-col items-center justify-center bg-white p-6"
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
