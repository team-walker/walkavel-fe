import { motion } from 'framer-motion';

import CheckIcon from '@/public/icons/check.svg';

export default function FinishSection({
  onReset,
  onResetUnbookmarked,
  onReselect,
}: {
  onReset: () => void;
  onResetUnbookmarked: () => void;
  onReselect: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full flex-col items-center justify-center bg-white px-8"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-12 flex h-14 w-14 items-center justify-center rounded-full bg-[#F2F8FF]">
          <CheckIcon width={24} height={24} className="text-blue-500" />
        </div>

        <h2 className="mb-4 text-3xl font-bold tracking-tight text-[#111827]">
          여기까지 다 둘러봤어요
        </h2>

        <p className="mb-16 text-xl font-medium text-zinc-400">다른 지역도 한 번 볼까요?</p>

        <div className="flex w-full min-w-[320px] flex-col gap-6">
          <button
            onClick={onReselect}
            className="flex h-16 w-full items-center justify-center rounded-2xl bg-[#3182F6] text-lg font-bold text-white transition-all active:scale-[0.98]"
          >
            다른 지역 보러가기
          </button>

          <button
            onClick={onReset}
            className="text-lg font-semibold text-zinc-500 transition-colors hover:text-zinc-800"
          >
            처음부터 다시 보기
          </button>
        </div>
      </div>
    </motion.div>
  );
}
