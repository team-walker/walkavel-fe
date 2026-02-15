'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useExploreStore } from '@/store/exploreStore';
import { useStampStore } from '@/store/stampStore';

import { Button } from '../ui/button';
import { RadarAnimation } from './RadarAnimation';

// 성공 시 나타나는 스탬프 컴포넌트 (Figma 110:1318 스타일 + 숏폼 세대 타겟 도파민 연출)
function StampSuccessUI() {
  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 w-full text-center"
      >
        <h2 className="mb-2 text-xl font-bold tracking-tight text-[#101828]">스탬프 획득!</h2>
        <p className="text-[15px] text-[#4a5565]">성공적으로 스탬프를 획득했어요!</p>
      </motion.div>

      <div className="relative flex h-64 w-full items-center justify-center overflow-visible">
        {/* 화려한 배경 파티클 (꽃가루 효과) */}
        <div className="absolute inset-0 flex items-center justify-center overflow-visible">
          {[...Array(24)].map((_, i) => {
            const randomX = (Math.sin(i * 12.9898) * 43758.5453) % 1;
            const randomY = (Math.sin(i * 78.233) * 43758.5453) % 1;
            const randomRotate = (Math.sin(i * 45.164) * 43758.5453) % 1;
            const colors = [
              'bg-[#3182f6]',
              'bg-[#00d2ff]',
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
            className="absolute h-32 w-32 rounded-full border border-blue-500/30"
          />
        ))}

        {/* 장식용 도트들 (회전 애니메이션 추가) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute h-52 w-52"
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="absolute h-2 w-2 rounded-full bg-blue-500/40"
              style={{
                top: `${50 + 45 * Math.sin((angle * Math.PI) / 180)}%`,
                left: `${50 + 45 * Math.cos((angle * Math.PI) / 180)}%`,
              }}
            />
          ))}
        </motion.div>

        {/* 메인 스탬프 (임팩트 있는 등장) */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: -3.5 }}
          transition={{
            type: 'spring',
            damping: 12,
            stiffness: 200,
          }}
          className="relative z-10 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#3182f6] to-[#00d2ff] shadow-[0_30px_60px_rgba(49,130,246,0.4)]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-white drop-shadow-md"
          >
            <RadarAnimation.Icon size={70} />
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
  const { isExploring, setIsExploring, distanceToTarget } = useExploreStore();
  // // [수정] 함수 대신 '수집 여부'라는 값(Boolean)을 직접 구독
  const collected = useStampStore((state) => state.collectedIds.includes(Number(id)));
  const [showSuccess, setShowSuccess] = useState(false);

  // 스탬프가 찍혔을 때의 연출과 1초 후 시트가 닫히는 로직
  useEffect(() => {
    // 스탬프가 찍히면 성공 연출 시작
    if (collected && isExploring) {
      // UX 개선: 시트가 열리자마자 바로 성공창이 뜨면 당황스러울 수 있으므로
      // 최소 0.8초 정도는 레이더 애니메이션을 보여준 뒤 성공 연출로 전환
      const successTimer = setTimeout(() => {
        setShowSuccess(true);
        // [숏폼 도파민] 진동 효과 피드백
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([15, 30, 15, 60]);
        }
      }, 800);

      // 3.5초 후 자동으로 탐험 종료 (성공 연출을 충분히 즐길 수 있도록 시간 연장)
      const closeTimer = setTimeout(() => {
        setIsExploring(false);
        setShowSuccess(false);
      }, 3500);

      return () => {
        clearTimeout(successTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [id, collected, isExploring, setIsExploring]);

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
            className="fixed inset-0 z-10000 bg-black/60 backdrop-blur-sm"
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
            <div className="mb-8 h-1.5 w-12 rounded-full bg-[#d1d5dc]" />

            {/* 성공 연출 */}
            {showSuccess ? (
              <StampSuccessUI />
            ) : (
              <>
                <div className="w-full text-center">
                  <h2 className="mb-2 text-xl font-bold tracking-tight text-[#101828]">
                    탐험 중...
                  </h2>
                  <p className="mb-10 text-[15px] text-[#4a5565]">
                    {distanceToTarget !== null
                      ? `현재 위치에서 약 ${distanceToTarget}m 떨어져 있어요`
                      : '위치 정보를 수신하고 있습니다...'}
                  </p>
                </div>

                <RadarAnimation distance={distanceToTarget} />

                {/* 하단 진행 바 (Figma 스타일) */}
                <div className="mt-8 w-full space-y-2 px-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#f3f4f6]">
                    <motion.div
                      className="h-full bg-[#3182f6]"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.max(0, Math.min(100, ((150 - (distanceToTarget ?? 150)) / 100) * 100))}%`,
                      }}
                      transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                    />
                  </div>
                  <p className="text-center text-[13px] text-[#6a7282]">50m 이내로 접근해주세요</p>
                </div>
              </>
            )}

            {/* 닫기 버튼 (기존 기능 유지하되 Figma의 절제된 느낌으로 수정) */}
            {!showSuccess && (
              <Button
                variant="ghost"
                onClick={() => setIsExploring(false)}
                className="mt-6 cursor-pointer text-sm font-medium text-gray-400 hover:bg-transparent hover:text-gray-600"
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
