import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getAPIDocumentation } from '@/types/api';
import { LandmarkDto, LandmarkSummaryDto } from '@/types/model';

interface BookmarkState {
  bookmarks: LandmarkDto[];
  isLoading: boolean;
  fetchBookmarks: () => Promise<void>;
  addBookmark: (landmark: LandmarkDto) => void;
  removeBookmark: (id: number) => void;
  toggleBookmark: (landmark: LandmarkDto) => void;
  isBookmarked: (id: number) => boolean;
  clearBookmarks: () => void;
}

// LandmarkSummaryDto를 LandmarkDto로 변환하는 헬퍼 함수
const mapSummaryToDto = (summary: LandmarkSummaryDto): LandmarkDto => {
  return {
    contentid: summary.contentId,
    title: summary.title,
    firstimage: summary.firstImage,
    addr1: summary.addr1,
    cat1: summary.cat1,
    cat2: summary.cat2,
    cat3: summary.cat3,
  } as LandmarkDto;
};

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      isLoading: false,
      fetchBookmarks: async () => {
        const { bookmarkControllerGetBookmarks } = getAPIDocumentation();
        set({ isLoading: true });

        try {
          const response = await bookmarkControllerGetBookmarks({ offset: 0 });
          // 유효한 랜드마크 데이터만 추출 및 변환
          const validBookmarks = response
            .map((bookmark) => bookmark.landmark)
            .filter((l): l is LandmarkSummaryDto => l !== null)
            .map(mapSummaryToDto);

          set({ bookmarks: validBookmarks });
        } catch (error) {
          console.error('Failed to fetch bookmarks:', error);
        } finally {
        }
      },
      addBookmark: async (landmark) => {
        const { bookmarkControllerAddBookmark } = getAPIDocumentation();

        // 낙관적 업데이트: 서버 요청 전 미리 UI 반영
        set((state) => ({ bookmarks: [...state.bookmarks, landmark] }));

        try {
          await bookmarkControllerAddBookmark({ contentId: landmark.contentid });
        } catch (error) {
          console.error('Failed to add bookmark:', error);
          toast.error('북마크 추가에 실패했습니다.');

          // 실패 시 롤백
          set((state) => ({
            bookmarks: state.bookmarks.filter((b) => b.contentid !== landmark.contentid),
          }));
        }
      },
      removeBookmark: async (id) => {
        const { bookmarkControllerRemoveBookmark } = getAPIDocumentation();
        const previousBookmarks = get().bookmarks;

        // 낙관적 업데이트: 서버 요청 전 미리 UI 반영
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.contentid !== id),
        }));

        try {
          await bookmarkControllerRemoveBookmark(id);
        } catch (error) {
          console.error('Failed to remove bookmark:', error);
          toast.error('북마크 해제에 실패했습니다.');

          // 실패 시 롤백
          set({ bookmarks: previousBookmarks });
        }
      },
      toggleBookmark: async (landmark) => {
        const { isBookmarked, removeBookmark, addBookmark } = get();
        if (isBookmarked(landmark.contentid)) {
          await removeBookmark(landmark.contentid);
        } else {
          await addBookmark(landmark);
        }
      },
      isBookmarked: (id) => {
        return get().bookmarks.some((b) => b.contentid === id);
      },
      clearBookmarks: () => set({ bookmarks: [] }),
    }),
    {
      name: 'walkavel-bookmark-storage',
    },
  ),
);
