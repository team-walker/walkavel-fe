'use client';

import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { BookmarkItem } from '@/components/bookmark/BookmarkItem';
import EmptyView from '@/components/bookmark/EmptyView';
import { useBookmarkStore } from '@/store/bookmarkStore';

export default function BookmarkPage() {
  const router = useRouter();
  const { bookmarks, isLoading, removeBookmark, fetchBookmarks } = useBookmarkStore();

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const onDeleteBookmark = (id: number) => removeBookmark(id);
  const navigateToDetail = (id: number) => router.push(`/landmark/${id}`);

  if (isLoading && bookmarks.length === 0) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-white"
        role="status"
        aria-label="북마크 정보를 불러오는 중입니다"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-full w-full flex-col bg-white px-6 pt-8">
      <div className="mb-6 shrink-0">
        <h1 className="text-[28px] leading-tight font-bold text-gray-900">나의 워커블</h1>
        <p className="mt-2 text-[16px] text-gray-500">
          저장한 장소 <span className="font-bold text-[#3182F6]">{bookmarks.length}개</span>
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <EmptyView />
      ) : (
        <div className="space-y-3 pb-24">
          <AnimatePresence
            mode="popLayout"
            initial={false} // [개선 1] 처음 렌더링 시에는 애니메이션을 생략하여 불필요한 움직임 방지
          >
            {bookmarks.map((landmark) => (
              <BookmarkItem
                key={landmark.contentid}
                landmark={landmark}
                onRemove={onDeleteBookmark}
                onSelect={navigateToDetail}
              />
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
