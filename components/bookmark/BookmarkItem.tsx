import { motion } from 'framer-motion';
import { TrashIcon } from 'lucide-react';
import { memo } from 'react';

import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { useSwipeAction } from '@/hooks/useSwipeAction';
import ChevronRightIcon from '@/public/images/chevron-right.svg';
import { LandmarkDto } from '@/types/model';

export const BookmarkItem = memo(function BookmarkItem({
  landmark,
  onRemove,
  onSelect,
  priority = false,
}: {
  landmark: LandmarkDto;
  onRemove: (id: number) => void;
  onSelect: (id: number) => void;
  priority?: boolean;
}) {
  const { x, opacity, isDragging, DragStart, DragEnd } = useSwipeAction(() =>
    onRemove(landmark.contentid),
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{
        opacity: 0,
        x: -200,
        transition: { duration: 0.2 },
      }}
      className="relative overflow-hidden rounded-4xl bg-white"
    >
      <motion.div
        style={{ opacity }}
        className="absolute inset-0.5 flex items-center justify-end rounded-[inherit] bg-red-400 px-8"
      >
        <TrashIcon className="text-white" size={22} />
      </motion.div>

      <motion.div
        layout
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -300, right: 0 }}
        dragElastic={{ left: 0.1, right: 0 }}
        dragDirectionLock
        onDragStart={DragStart}
        onDragEnd={DragEnd}
        onClick={() => {
          if (!isDragging.current) onSelect(landmark.contentid);
        }}
        className="border-walkavel-gray-100 active:bg-walkavel-gray-50 relative z-10 flex cursor-pointer touch-pan-y items-center space-x-4 rounded-4xl border bg-white p-4 shadow-sm transition-colors"
      >
        <div className="border-walkavel-gray-100 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl border">
          <ImageWithFallback
            src={landmark.firstimage || ''}
            alt={landmark.title}
            width={80}
            height={80}
            className="h-full w-full object-cover"
            priority={priority}
            unoptimized={landmark.firstimage?.includes('visitkorea.or.kr')}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-walkavel-gray-900 mb-0.5 line-clamp-1 text-base font-bold break-all sm:text-lg">
            {landmark.title}
          </h3>
          <p className="text-walkavel-gray-500 truncate text-sm">
            {landmark.addr1 || '상세 주소 정보가 없습니다.'}
          </p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center">
          <ChevronRightIcon width={22} height={22} className="text-walkavel-gray-300" />
        </div>
      </motion.div>
    </motion.div>
  );
});
