'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useStamp } from '@/hooks/useStamp';
import { useExploreStore } from '@/store/exploreStore';

import { Button } from '../ui/button';
import { RadarAnimation } from './RadarAnimation';

// 성공 시 나타나는 스탬프 컴포넌트 (Figma 1.5안 스타일)
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
        {/* 화려한 배경 파티클 (꽃가루 효과) */}
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

        {/* 충격파 (Multiple Impact Rings) */}
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

        {/* 메인 스탬프 (피그마 이미지처럼 체크 아이콘) */}
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

          {/* 하이라이트 광택 모션 (고품질 글린트 효과) */}
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

// 유저 시나리오의 "하단에서 부드럽게 올라오며"를 구현하기 위해 AnimatePresence를 사용한 커스텀 시트
export function RadarSheet({ id }: { id: string | number }) {
  const { distanceToTarget, isExploring, setIsExploring } = useExploreStore();
  const { isCollected: checkCollected } = useStamp();
  const isCollected = checkCollected(Number(id));

  const [showSuccess, setShowSuccess] = useState(false);

  // 스탬프가 찍혔을 때의 연출과 1초 후 시트가 닫히는 로직
  useEffect(() => {
    // 스탬프가 찍히면 성공 연출 시작
    if (isCollected && isExploring) {
      // 획득 즉시 성공 연출로 전환
      const successTimer = setTimeout(() => {
        setShowSuccess(true);
      }, 0);

      // 1초간의 축하 연출 후 자동으로 탐험 종료 (Figma 1.5안 요구사항)
      const closeTimer = setTimeout(() => {
        setIsExploring(false);
        // setShowSuccess(false); // 리셋은 시트가 완전히 닫힌 후 하거나 AnimatePresence가 처리
      }, 1500); // 연출 시간을 고려하여 1.5초 정도로 설정 (등장 0.5s + 축하 1s)

      return () => {
        clearTimeout(successTimer);
        clearTimeout(closeTimer);
      };
    } else {
      // 동기적 상태 업데이트로 인한 Cascading Render 방지를 위해 비동기 처리
      setTimeout(() => setShowSuccess(false), 0);
    }
  }, [isCollected, isExploring, setIsExploring]);

  return (
    <AnimatePresence>
      {isExploring && (
        <div key="radar-sheet-wrapper" className="relative z-10000">
          {/* 어두운 배경 (Overlay) */}
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
          {/* 바텀 시트 (Sheet) */}
          <motion.div
            initial={{ y: '100%', x: '-50%' }}
            animate={{ y: 0, x: '-50%' }}
            exit={{ y: '100%', x: '-50%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-0 left-1/2 z-10001 flex w-full max-w-120 flex-col items-center rounded-t-[24px] bg-white px-6 pt-3 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
          >
            {/* 드래그 핸들 (Figma: #d1d5dc) */}
            <div className="bg-walkavel-gray-300 mb-8 h-1.5 w-12 rounded-full" />

            {/* 성공 연출 */}
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

                {/* 하단 진행 바 (Figma 스타일) */}
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

            {/* 닫기 버튼 (기존 기능 유지하되 Figma의 절제된 느낌으로 수정) */}
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
