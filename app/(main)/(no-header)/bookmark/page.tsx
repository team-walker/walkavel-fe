'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import BookmarkIcon from '@/public/images/bookmark.svg';
import ChevronRightIcon from '@/public/images/chevron-right.svg';
import { useBookmarkStore } from '@/store/bookmarkStore';

export default function BookmarkPage() {
  const router = useRouter();
  const { bookmarks, removeBookmark, fetchBookmarks } = useBookmarkStore();
  const isDragging = useRef(false);

  const savedLandmarks = bookmarks.map((bookmark) => ({
    id: bookmark.contentid,
    name: bookmark.title,
    location: bookmark.addr1 || '',
    image: bookmark.firstimage || '',
    price: '정보 없음',
  }));

  const savedIds = bookmarks.map((bookmark) => bookmark.contentid);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const onRemove = (id: number) => {
    removeBookmark(id);
  };

  const onSelectLandmark = (landmark: (typeof savedLandmarks)[0]) => {
    router.push(`/landmark/${landmark.id}`);
  };

  return (
    <div className="flex min-h-full w-full flex-col bg-white px-6 pt-8">
      <div className="mb-6 shrink-0">
        <h1 className="text-[28px] leading-tight font-bold text-gray-900">나의 워커블</h1>
        <p className="mt-2 text-[16px] text-gray-500">
          저장한 장소 <span className="font-bold text-[#3182F6]">{savedIds.length}개</span>
        </p>
      </div>

      {savedLandmarks.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2F4F6]">
            <BookmarkIcon width={28} height={28} className="text-gray-300" />
          </div>
          <h3 className="mb-2 text-[20px] font-bold text-gray-900">아직 저장한 장소가 없어요</h3>
          <p className="text-[15px] text-gray-500">마음에 드는 곳을 북마크해보세요</p>
        </div>
      ) : (
        <div className="space-y-3 pb-24">
          <AnimatePresence mode="popLayout">
            {savedLandmarks.map((landmark) => (
              <motion.div
                key={landmark.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, x: -200, transition: { duration: 0.2 } }}
                whileDrag={{ scale: 1.02, boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }}
                drag="x"
                // 수정 1: 왼쪽으로 충분히 움직일 수 있도록 constraints를 넉넉하게 잡습니다.
                dragConstraints={{ left: -300, right: 0 }}
                // 수정 2: 오른쪽으로는 안 밀리게 하고, 왼쪽은 부드럽게 밀리도록 조절
                dragElastic={{ left: 0.2, right: 0 }}
                // 드래그 방향 고정 (상하 스크롤 방해 방지)
                dragDirectionLock
                onDragStart={() => {
                  isDragging.current = true;
                }}
                onDragEnd={(_, info) => {
                  // 수정 3: 거리(-100px)뿐만 아니라 미는 속도(velocity)가 빠를 때도 삭제 트리거
                  const isSwipeLeft = info.offset.x < -100 || info.velocity.x < -500;

                  if (isSwipeLeft) {
                    onRemove(landmark.id);
                  }

                  setTimeout(() => {
                    isDragging.current = false;
                  }, 100);
                }}
                onClick={() => {
                  if (!isDragging.current) {
                    onSelectLandmark(landmark);
                  }
                }}
                className="relative z-10 flex cursor-pointer touch-pan-y items-center space-x-4 rounded-4xl border border-gray-100 bg-white p-4 shadow-sm transition-colors active:bg-[#F2F4F6]"
              >
                <div className="pointer-events-none h-20 w-20 shrink-0 overflow-hidden rounded-3xl bg-gray-100">
                  <ImageWithFallback
                    src={landmark.image}
                    alt={landmark.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="pointer-events-none min-w-0 flex-1">
                  <h3 className="mb-1 truncate text-[17px] font-bold text-gray-900">
                    {landmark.name}
                  </h3>
                  <p className="truncate text-[14px] text-gray-500">{landmark.location}</p>
                  <div className="mt-2 flex items-center text-[13px] text-gray-400">
                    <span>{landmark.price}</span>
                  </div>
                </div>
                <ChevronRightIcon width={22} height={22} className="shrink-0 text-gray-300" />
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="pt-4 pb-2 text-center">
            <p className="text-[13px] text-gray-400">카드를 왼쪽으로 밀어서 삭제할 수 있어요</p>
          </div>
        </div>
      )}
    </div>
  );
}
