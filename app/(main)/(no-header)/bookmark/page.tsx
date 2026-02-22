import { Suspense } from 'react';

import { getBookmarksAction } from '@/app/actions/bookmark';
import { BookmarkedLandmark } from '@/types/app';
import { BookmarkResponseDto } from '@/types/model';

import { BookmarkListClient } from './BookmarkListClient';

export const dynamic = 'force-dynamic';

const mapToBookmarkedLandmark = (bookmark: BookmarkResponseDto): BookmarkedLandmark | null => {
  if (!bookmark.landmark) return null;
  return {
    contentid: bookmark.landmark.contentid || 0,
    title: bookmark.landmark.title,
    firstimage: bookmark.landmark.firstimage,
    addr1: bookmark.landmark.addr1,
    cat1: bookmark.landmark.cat1,
    cat2: bookmark.landmark.cat2,
    cat3: bookmark.landmark.cat3,
    bookmarkId: bookmark.id,
  } as BookmarkedLandmark;
};

export default async function BookmarkPage() {
  const response = await getBookmarksAction();

  const initialBookmarks: BookmarkedLandmark[] = (response || [])
    .map(mapToBookmarkedLandmark)
    .filter((l): l is BookmarkedLandmark => l !== null);

  return (
    <div className="flex min-h-full w-full flex-col bg-white px-6 pt-[calc(env(safe-area-inset-top,0px)+2rem)]">
      <div className="mb-6 shrink-0">
        <h1 className="text-walkavel-gray-900 text-[28px] leading-tight font-bold">나의 워커블</h1>
      </div>

      <Suspense fallback={<BookmarkSkeleton />}>
        <BookmarkListClient initialBookmarks={initialBookmarks} />
      </Suspense>
    </div>
  );
}

function BookmarkSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-walkavel-gray-50 h-28 w-full animate-pulse rounded-4xl" />
      ))}
    </div>
  );
}
