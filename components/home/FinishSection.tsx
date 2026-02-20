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
          <h2 className="text-walkavel-gray-900 text-[26px] leading-[32.5px] font-bold tracking-[0.2158px]">
            여기까지 다 둘러봤어요
          </h2>
          <p className="text-walkavel-gray-600 text-[17px] leading-[27.625px] font-normal tracking-[-0.4316px]">
            다른 지역도 한 번 볼까요?
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          <Button
            variant="default"
            onClick={onReselect}
            className="bg-brand-blue hover:bg-brand-blue/90 h-[61.5px] w-full cursor-pointer rounded-3xl text-[17px] font-semibold tracking-[-0.4316px] text-white shadow-none transition-all active:scale-[0.98]"
          >
            다른 지역 보러가기
          </Button>

          <Button
            variant="ghost"
            onClick={onReset}
            className="text-walkavel-gray-600 hover:text-walkavel-gray-900 h-auto cursor-pointer p-0 text-[15px] leading-[22.5px] font-medium tracking-[-0.2344px] hover:bg-transparent"
          >
            처음부터 다시 보기
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
