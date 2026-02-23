import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, Sparkles } from 'lucide-react';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { triggerVibration, VIBRATION_PATTERNS } from '@/lib/utils/pwa';

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
  useEffect(() => {
    if (isOpen && !isCollected) {
      triggerVibration([...VIBRATION_PATTERNS.SUCCESS]);
    }
  }, [isOpen, isCollected]);

  if (isCollected) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-y-0 left-1/2 z-10001 w-full max-w-120 -translate-x-1/2 bg-black/60 backdrop-blur-sm"
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
                onClose();
              }
            }}
            className="fixed bottom-0 left-1/2 z-10002 flex min-h-fit w-full max-w-120 flex-col items-center rounded-t-4xl bg-white px-6 pt-3 pb-[calc(env(safe-area-inset-bottom)+5.5rem)] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] sm:pb-[calc(env(safe-area-inset-bottom)+7rem)]"
          >
            <div className="bg-walkavel-gray-200 mb-6 h-1.5 w-12 rounded-full" />

            <div className="flex w-full flex-col items-center text-center">
              <div className="bg-brand-blue-light text-brand-blue relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl shadow-inner">
                <Sparkles size={48} strokeWidth={1.5} className="z-10" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="bg-brand-blue/20 absolute inset-0 rounded-3xl"
                />
              </div>

              <h2 className="text-walkavel-gray-900 mb-2 text-2xl font-black tracking-tight">
                {landmarkName} 스탬프 발견!
              </h2>
              <p className="text-walkavel-gray-500 mb-6 text-sm leading-relaxed">
                현재 장소에서 약 <span className="text-brand-blue font-bold">{distance}m</span>{' '}
                거리에 있어요.
                <br />
                탐험을 시작해서 스탬프를 획득해 보세요!
              </p>

              <div className="bg-walkavel-gray-50 mb-6 flex w-full items-center gap-3 rounded-2xl p-4 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <MapPin size={20} className="text-brand-blue" />
                </div>
                <div className="text-walkavel-gray-600 text-sm leading-snug">
                  <span className="text-walkavel-gray-900 font-bold">획득 조건</span>
                  <br />
                  장소 주변 50m 이내로 접근 시 자동 획득
                </div>
              </div>

              <Button
                onClick={() => {
                  onStart();
                  onClose();
                }}
                className="bg-brand-blue h-15 w-full cursor-pointer rounded-2xl text-lg font-bold text-white shadow-lg transition-all active:scale-[0.98]"
              >
                스탬프 탐험 시작하기
              </Button>

              <button
                onClick={onClose}
                aria-label="스탬프 탐험 나중에 하기"
                className="text-walkavel-gray-400 hover:text-walkavel-gray-600 mt-6 cursor-pointer text-sm font-medium"
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
