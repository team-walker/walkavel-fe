'use client';

import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';

import { removeBookmarkAction } from '@/app/actions/bookmark';
import { BookmarkItem } from '@/components/bookmark/BookmarkItem';
import EmptyView from '@/components/bookmark/EmptyView';
import { ROUTES } from '@/constants/navigation';
import { showErrorToast } from '@/lib/utils/toast';
import { useBookmarkStore } from '@/store/bookmarkStore';
import { BookmarkedLandmark } from '@/types/app';

interface BookmarkListClientProps {
  initialBookmarks: BookmarkedLandmark[];
}

export function BookmarkListClient({ initialBookmarks }: BookmarkListClientProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const removeBookmarkLocally = useBookmarkStore((s) => s.removeBookmarkLocally);

  const [optimisticBookmarks, removeOptimisticBookmark] = useOptimistic(
    initialBookmarks,
    (state, id: number) => state.filter((item) => item.contentid !== id),
  );

  const handleDelete = (contentId: number) => {
    startTransition(async () => {
      removeOptimisticBookmark(contentId);

      removeBookmarkLocally(contentId);

      const result = await removeBookmarkAction(contentId);
      if (!result.success) {
        showErrorToast(result.error || '삭제에 실패했습니다.');
      }
    });
  };

  const navigateToDetail = (id: number) => {
    router.push(ROUTES.LANDMARK_DETAIL(id));
  };

  if (optimisticBookmarks.length === 0) {
    return <EmptyView />;
  }

  return (
    <div className="space-y-3 pb-32">
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex items-baseline gap-1">
          <span className="text-walkavel-gray-600 text-lg font-bold">저장한 장소</span>
          <span className="text-walkavel-gray-600 text-lg font-bold">
            <span className="text-brand-blue text-xl font-extrabold">
              {optimisticBookmarks.length}
            </span>
            개
          </span>
        </div>
        <p className="text-walkavel-gray-400 text-center text-sm break-keep">
          카드를 왼쪽으로 밀어서 삭제할 수 있어요
        </p>
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {optimisticBookmarks.map((landmark, index) => (
          <BookmarkItem
            key={landmark.contentid || `bookmark-${index}`}
            landmark={landmark}
            onRemove={handleDelete}
            onSelect={navigateToDetail}
            priority={index === 0}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
