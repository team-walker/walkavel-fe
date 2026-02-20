import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/types';
import { BookmarkedLandmark } from '@/types/app';

interface BookmarkState {
  bookmarks: BookmarkedLandmark[];
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setBookmarks: (bookmarks: BookmarkedLandmark[]) => void;
  addBookmarkLocally: (landmark: BookmarkedLandmark) => void;
  removeBookmarkLocally: (id: number) => void;
  isBookmarked: (id: number) => boolean;
  clearBookmarks: () => void;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),
      setBookmarks: (bookmarks) => set({ bookmarks }),
      addBookmarkLocally: (landmark) => {
        if (get().isBookmarked(landmark.contentid)) return;
        set((state) => ({ bookmarks: [landmark, ...state.bookmarks] }));
      },
      removeBookmarkLocally: (id) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((bookmark) => bookmark.contentid !== id),
        }));
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
