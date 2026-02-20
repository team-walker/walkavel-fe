'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useStamp } from '@/hooks/useStamp';
import { useExploreStore } from '@/store/exploreStore';

import { Button } from '../ui/button';
import { RadarAnimation } from './RadarAnimation';

function StampSuccessUI() {
  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 w-full text-center"
      >
        <h2 className="text-walkavel-gray-900 mb-2 text-xl font-bold tracking-tight">
          스탬프 획득 중!
        </h2>
        <p className="text-walkavel-gray-700 text-[15px]">성공적으로 스탬프를 획득했어요!</p>
      </motion.div>

      <div className="relative flex h-64 w-full items-center justify-center overflow-visible">
        <div className="absolute inset-0 flex items-center justify-center overflow-visible">
          {[...Array(24)].map((_, i) => {
            const randomX = (Math.sin(i * 12.9898) * 43758.5453) % 1;
            const randomY = (Math.sin(i * 78.233) * 43758.5453) % 1;
            const randomRotate = (Math.sin(i * 45.164) * 43758.5453) % 1;
            const colors = [
              'bg-brand-blue',
              'bg-brand-blue-dark',
              'bg-yellow-300',
              'bg-pink-400',
              'bg-emerald-400',
            ];
            return (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0.7, 0],
                  x: (randomX - 0.5) * 300,
                  y: (randomY - 0.5) * 300,
                  rotate: randomRotate * 540,
                }}
                transition={{
                  duration: 1.5,
                  ease: [0.23, 1, 0.32, 1],
                  delay: 0.1 + (i % 5) * 0.05,
                }}
                className={`absolute h-2.5 w-2.5 rounded-[2px] ${colors[i % colors.length]}`}
              />
            );
          })}
        </div>

        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{
              duration: 1.2,
              ease: 'easeOut',
              delay: 0.1 + i * 0.2,
            }}
            className="border-brand-blue/30 absolute h-32 w-32 rounded-full border"
          />
        ))}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            damping: 12,
            stiffness: 200,
          }}
          className="from-brand-blue to-brand-blue-dark shadow-brand-blue/40 relative z-10 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-linear-to-br shadow-xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-white drop-shadow-md"
          >
            <Check size={70} strokeWidth={3} />
          </motion.div>

          <motion.div
            animate={{ x: ['-250%', '250%'] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: 'easeInOut',
            }}
            className="absolute top-0 bottom-0 w-16 skew-x-[-30deg] bg-linear-to-r from-transparent via-white/50 to-transparent"
            style={{ filter: 'blur(2px)' }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export function RadarSheet({ id }: { id: string | number }) {
  const { distanceToTarget, isExploring, setIsExploring } = useExploreStore();
  const { isCollected: checkCollected } = useStamp();
  const isCollected = checkCollected(Number(id));

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isCollected && isExploring) {
      const successTimer = setTimeout(() => {
        setShowSuccess(true);
      }, 0);

      const closeTimer = setTimeout(() => {
        setIsExploring(false);
      }, 1500);

      return () => {
        clearTimeout(successTimer);
        clearTimeout(closeTimer);
      };
    } else {
      setTimeout(() => setShowSuccess(false), 0);
    }
  }, [isCollected, isExploring, setIsExploring]);

  return (
    <AnimatePresence>
      {isExploring && (
        <div key="radar-sheet-wrapper" className="relative z-10000">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsExploring(false);
            }}
            className="fixed inset-y-0 left-1/2 z-10000 w-full max-w-120 -translate-x-1/2 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%', x: '-50%' }}
            animate={{ y: 0, x: '-50%' }}
            exit={{ y: '100%', x: '-50%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.8 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) {
                setIsExploring(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-0 left-1/2 z-10001 flex min-h-[500px] w-full max-w-120 flex-col items-center rounded-t-[24px] bg-white px-6 pt-3 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
          >
            <div className="bg-walkavel-gray-300 mb-8 h-1.5 w-12 rounded-full" />

            {showSuccess ? (
              <StampSuccessUI />
            ) : (
              <>
                <div className="w-full text-center">
                  <h2 className="text-walkavel-gray-900 mb-2 text-xl font-bold tracking-tight">
                    탐험 중...
                  </h2>
                  <p className="text-walkavel-gray-700 mb-10 text-[15px]">
                    {distanceToTarget !== null
                      ? `현재 위치에서 약 ${distanceToTarget}m 떨어져 있어요`
                      : '위치 정보를 수신하고 있습니다...'}
                  </p>
                </div>

                <RadarAnimation distance={distanceToTarget} />

                <div className="mt-8 w-full space-y-2 px-4">
                  <div className="bg-walkavel-gray-100 h-2 w-full overflow-hidden rounded-full">
                    <motion.div
                      className="bg-brand-blue h-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.max(0, Math.min(100, ((150 - (distanceToTarget ?? 150)) / 100) * 100))}%`,
                      }}
                      transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                    />
                  </div>
                  <p className="text-walkavel-gray-600 text-center text-[13px]">
                    50m 이내로 접근해주세요
                  </p>
                </div>
              </>
            )}

            {!showSuccess && (
              <Button
                variant="ghost"
                onClick={() => setIsExploring(false)}
                className="text-walkavel-gray-400 hover:text-walkavel-gray-600 mt-6 cursor-pointer text-sm font-medium hover:bg-transparent"
              >
                그만하기
              </Button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
