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
  const [isPending, startTransition] = useTransition();
  const removeBookmarkLocally = useBookmarkStore((s) => s.removeBookmarkLocally);

  const [optimisticBookmarks, removeOptimisticBookmark] = useOptimistic(
    initialBookmarks,
    (state, id: number) => state.filter((item) => item.contentid !== id),
  );

  const handleDelete = (contentId: number) => {
    startTransition(async () => {
      // 1. 낙관적 업데이트 수행 (transition 내부에서 호출)
      removeOptimisticBookmark(contentId);

      // 2. Zustand 스토어 업데이트 (클라이언트 글로벌 상태 동기화)
      removeBookmarkLocally(contentId);

      // 3. 서버 액션 실행 (contentId를 사용하도록 수정)
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
    <div className="space-y-3 pb-24">
      <div className="mb-4">
        <p className="text-walkavel-gray-500 text-[16px]">
          저장한 장소{' '}
          <span className="text-brand-blue font-bold">{optimisticBookmarks.length}개</span>
        </p>
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {optimisticBookmarks.map((landmark, index) => (
          <BookmarkItem
            key={landmark.contentid || `bookmark-${index}`}
            landmark={landmark}
            onRemove={handleDelete}
            onSelect={navigateToDetail}
          />
        ))}
      </AnimatePresence>

      <div className="pt-4 pb-2 text-center">
        <p className="text-walkavel-gray-400 text-[13px]">
          {isPending ? '처리 중...' : '카드를 왼쪽으로 밀어서 삭제할 수 있어요'}
        </p>
      </div>
    </div>
  );
}
