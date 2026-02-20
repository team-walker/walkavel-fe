import { getApi } from '@/types/api';
import { BookmarkResponseDto } from '@/types/model';

export const bookmarkRepository = {
  async getAll(): Promise<BookmarkResponseDto[]> {
    const { bookmarkControllerGetBookmarks } = getApi();
    return await bookmarkControllerGetBookmarks({ offset: 0 });
  },

  async add(contentId: number): Promise<BookmarkResponseDto> {
    const { bookmarkControllerAddBookmark } = getApi();
    return await bookmarkControllerAddBookmark({ contentId });
  },

  async remove(contentId: number): Promise<void> {
    const { bookmarkControllerRemoveBookmark } = getApi();
    await bookmarkControllerRemoveBookmark(contentId);
  },

  async getStatus(contentId: number): Promise<boolean> {
    const api = getApi();
    const response = await api.bookmarkControllerCheckBookmarkStatus(contentId);
    return response.isBookmarked;
  },
};
