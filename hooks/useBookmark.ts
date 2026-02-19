'use client';

import { useCallback } from 'react';

import { bookmarkRepository } from '@/lib/repositories/bookmark.repository';
import { showErrorToast } from '@/lib/utils/toast';
import { useBookmarkStore } from '@/store/bookmarkStore';
import { BookmarkedLandmark } from '@/types/app';
import { BookmarkResponseDto, LandmarkDto } from '@/types/model';

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

export const useBookmark = () => {
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const isLoading = useBookmarkStore((s) => s.isLoading);
  const setIsLoading = useBookmarkStore((s) => s.setIsLoading);
  const setBookmarks = useBookmarkStore((s) => s.setBookmarks);
  const addBookmarkLocally = useBookmarkStore((s) => s.addBookmarkLocally);
  const removeBookmarkLocally = useBookmarkStore((s) => s.removeBookmarkLocally);
  const isBookmarked = useBookmarkStore((s) => s.isBookmarked);

  const fetchBookmarks = useCallback(async () => {
    // isLoading을 직접 스토어에서 확인하여 dependency loop를 방지합니다.
    if (useBookmarkStore.getState().isLoading) return;

    setIsLoading(true);

    try {
      const response = await bookmarkRepository.getAll();
      const validBookmarks = response
        .map(mapToBookmarkedLandmark)
        .filter((l): l is BookmarkedLandmark => l !== null);

      setBookmarks(validBookmarks);
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
      showErrorToast('북마크를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setBookmarks]);

  const addBookmark = useCallback(
    async (landmark: LandmarkDto) => {
      if (isBookmarked(landmark.contentid)) return;

      const tempId = Date.now();
      const optimisticBookmark: BookmarkedLandmark = { ...landmark, bookmarkId: tempId };
      addBookmarkLocally(optimisticBookmark);

      try {
        const response = await bookmarkRepository.add(landmark.contentid);

        // 백엔드 응답에서 ID 확인
        if (!response || typeof response.id === 'undefined') {
          throw new Error('Invalid response from server: missing bookmark ID');
        }

        // 성공 시 실제 ID로 업데이트
        const currentBookmarks = useBookmarkStore.getState().bookmarks;
        const updatedBookmarks = currentBookmarks.map((b) =>
          b.contentid === landmark.contentid ? { ...b, bookmarkId: response.id } : b,
        );
        setBookmarks(updatedBookmarks);
      } catch (error) {
        console.error('Failed to add bookmark:', error);
        showErrorToast('북마크 추가에 실패했습니다.');
        removeBookmarkLocally(landmark.contentid);
      }
    },
    [isBookmarked, addBookmarkLocally, removeBookmarkLocally, setBookmarks],
  );

  const removeBookmark = useCallback(
    async (contentId: number) => {
      const bookmarks = useBookmarkStore.getState().bookmarks;
      const previousBookmarks = [...bookmarks];

      // 낙관적 업데이트: 먼저 로컬 상태에서 제거
      removeBookmarkLocally(contentId);

      try {
        // API 호출 시 contentId 사용 (백엔드 스펙에 따름)
        await bookmarkRepository.remove(contentId);
      } catch (error) {
        console.error('Failed to remove bookmark:', error);
        showErrorToast('북마크 해제에 실패했습니다.');
        // 실패 시 롤백
        setBookmarks(previousBookmarks);
      }
    },
    [removeBookmarkLocally, setBookmarks],
  );

  const toggleBookmark = useCallback(
    async (landmark: LandmarkDto) => {
      if (isBookmarked(landmark.contentid)) {
        await removeBookmark(landmark.contentid);
      } else {
        await addBookmark(landmark);
      }
    },
    [isBookmarked, removeBookmark, addBookmark],
  );

  return {
    bookmarks,
    isLoading,
    fetchBookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
  };
};
