'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, Sparkles } from 'lucide-react';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';

interface StampMissionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  landmarkName: string;
  distance: number | null;
  isCollected: boolean;
}

export function StampMissionSheet({
  isOpen,
  onClose,
  onStart,
  landmarkName,
  distance,
  isCollected,
}: StampMissionSheetProps) {
  // 발견 시 햅틱 피드백 (Figma 요구사항)
  useEffect(() => {
    if (isOpen && !isCollected) {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]); // 짧은 진동 2번
      }
    }
  }, [isOpen, isCollected]);

  if (isCollected) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배후 레이어 (Dimmed) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-10001 bg-black/60 backdrop-blur-[2px]"
          />

          {/* 바텀 시트 (토스 스타일) */}
          <motion.div
            initial={{ y: '100%', x: '-50%' }}
            animate={{ y: 0, x: '-50%' }}
            exit={{ y: '100%', x: '-50%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-1/2 z-10002 flex w-full max-w-120 flex-col items-center rounded-t-[32px] bg-white px-6 pt-3 pb-[calc(env(safe-area-inset-bottom)+24px)] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
          >
            {/* 드래그 핸들 */}
            <div className="mb-8 h-1.5 w-12 rounded-full bg-gray-200" />

            <div className="flex w-full flex-col items-center text-center">
              {/* 메인 아이콘/일러스트 영역 */}
              <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 shadow-inner">
                <Sparkles size={48} strokeWidth={1.5} />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-3xl bg-blue-400/20"
                />
              </div>

              <h2 className="mb-2 text-[22px] font-black tracking-tight text-gray-900">
                {landmarkName} 스탬프 발견!
              </h2>
              <p className="mb-8 text-[15px] leading-relaxed text-gray-500">
                현재 장소에서 약 <span className="font-bold text-blue-600">{distance}m</span> 거리에
                있어요.
                <br />
                탐험을 시작해서 스탬프를 획득해보세요!
              </p>

              {/* 가이드 카드 */}
              <div className="mb-8 flex w-full items-center gap-3 rounded-2xl bg-gray-50 p-4 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <MapPin size={20} className="text-blue-500" />
                </div>
                <div className="text-[13px] leading-snug text-gray-600">
                  <span className="font-bold text-gray-900">획득 조건</span>
                  <br />
                  장소 주변 50m 이내로 접근 시 자동 획득
                </div>
              </div>

              {/* 실행 버튼 */}
              <Button
                onClick={() => {
                  onStart();
                  onClose();
                }}
                className="h-15 w-full rounded-2xl bg-blue-600 text-[17px] font-bold text-white shadow-lg transition-all active:scale-[0.98]"
              >
                스탬프 탐험 시작하기
              </Button>

              <button
                onClick={onClose}
                className="mt-6 text-[14px] font-medium text-gray-400 hover:text-gray-600"
              >
                나중에 하기
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
