import { motion } from 'framer-motion';

import CheckIcon from '@/public/images/check.svg';

import { Button } from '../ui/button';

export default function FinishSection({
  onReset,
  onReselect,
}: {
  onReset: () => void;
  onReselect: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full flex-col items-center justify-center bg-white px-8"
    >
      <div className="flex w-full flex-col items-center text-center">
        <div className="bg-walkavel-gray-100 mb-8 flex h-14 w-14 items-center justify-center rounded-full">
          <CheckIcon width={24} height={24} className="text-brand-blue" />
        </div>

        <div className="mb-8 flex flex-col gap-3">
          <h2 className="text-walkavel-gray-900 text-2xl leading-8 font-bold tracking-wide break-keep">
            여기까지 다 둘러봤어요
          </h2>
          <p className="text-walkavel-gray-600 text-lg leading-7 font-normal tracking-tight break-keep">
            다른 지역도 한 번 볼까요?
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          <Button
            variant="default"
            onClick={onReselect}
            className="bg-brand-blue hover:bg-brand-blue/90 h-15.25 min-h-15.25 w-full cursor-pointer rounded-3xl text-[1.0625rem] font-semibold tracking-tight text-white shadow-none transition-all active:scale-[0.98]"
          >
            다른 지역 보러 가기
          </Button>

          <Button
            variant="ghost"
            onClick={onReset}
            className="text-walkavel-gray-600 hover:text-walkavel-gray-900 h-auto min-h-12 cursor-pointer p-0 text-[0.9375rem] leading-5.5 font-medium tracking-tight hover:bg-transparent"
          >
            처음부터 다시 보기
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
