import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { LandmarkDto } from '@/types/model';

interface BookmarkState {
  bookmarks: LandmarkDto[];
  addBookmark: (landmark: LandmarkDto) => void;
  removeBookmark: (id: number) => void;
  toggleBookmark: (landmark: LandmarkDto) => void;
  isBookmarked: (id: number) => boolean;
  clearBookmarks: () => void;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (landmark) => {
        if (!get().bookmarks.some((b) => b.contentid === landmark.contentid)) {
          set((state) => ({ bookmarks: [...state.bookmarks, landmark] }));
        }
      },
      removeBookmark: (id) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.contentid !== id),
        }));
      },
      toggleBookmark: (landmark) => {
        const { bookmarks, removeBookmark, addBookmark } = get();
        const exists = bookmarks.some((b) => b.contentid === landmark.contentid);
        if (exists) {
          removeBookmark(landmark.contentid);
        } else {
          addBookmark(landmark);
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
