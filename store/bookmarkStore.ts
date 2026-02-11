import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/types';
import { getAPIDocumentation } from '@/types/api';
import { LandmarkDto, LandmarkSummaryDto } from '@/types/model';

interface BookmarkState {
  bookmarks: LandmarkDto[];
  isLoading: boolean;
  fetchBookmarks: () => Promise<void>;
  addBookmark: (landmark: LandmarkDto) => Promise<void>;
  removeBookmark: (id: number) => Promise<void>;
  toggleBookmark: (landmark: LandmarkDto) => Promise<void>;
  isBookmarked: (id: number) => boolean;
  clearBookmarks: () => void;
}

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
        if (get().isLoading) return;
        const { bookmarkControllerGetBookmarks } = getAPIDocumentation();
        set({ isLoading: true });

        try {
          const response = await bookmarkControllerGetBookmarks({ offset: 0 });
          const validBookmarks = response
            .map((bookmark) => bookmark.landmark)
            .filter((l): l is LandmarkSummaryDto => l !== null)
            .map(mapSummaryToDto);

          set({ bookmarks: validBookmarks });
        } catch (error) {
          console.error('Failed to fetch bookmarks:', error);
          toast.error('북마크를 불러오는 데 실패했습니다.');
        } finally {
          set({ isLoading: false });
        }
      },
      addBookmark: async (landmark) => {
        if (get().isBookmarked(landmark.contentid)) return;

        const { bookmarkControllerAddBookmark } = getAPIDocumentation();

        set((state) => ({ bookmarks: [landmark, ...state.bookmarks] }));

        try {
          await bookmarkControllerAddBookmark({ contentId: landmark.contentid });
        } catch (error) {
          console.error('Failed to add bookmark:', error);
          toast.error('북마크 추가에 실패했습니다.');

          set((state) => ({
            bookmarks: state.bookmarks.filter(
              (bookmark) => bookmark.contentid !== landmark.contentid,
            ),
          }));
        }
      },
      removeBookmark: async (id) => {
        const { bookmarkControllerRemoveBookmark } = getAPIDocumentation();
        const previousBookmarks = [...get().bookmarks];

        set((state) => ({
          bookmarks: state.bookmarks.filter((bookmark) => bookmark.contentid !== id),
        }));

        try {
          await bookmarkControllerRemoveBookmark(id);
        } catch (error) {
          console.error('Failed to remove bookmark:', error);
          toast.error('북마크 해제에 실패했습니다.');

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
        return get().bookmarks.some((bookmark) => bookmark.contentid === id);
      },
      clearBookmarks: () => set({ bookmarks: [] }),
    }),
    {
      name: STORAGE_KEYS.BOOKMARK_STORAGE,
    },
  ),
);
