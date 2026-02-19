import { getApi } from '@/types/api';
import { BookmarkResponseDto } from '@/types/model';

/**
 * 북마크 데이터에 대한 영속성 레이어입니다.
 * API 호출 로직을 중앙 집중화하여 서비스 훅이나 서버 액션에서 재사용합니다.
 */
export const bookmarkRepository = {
  /**
   * 유저의 모든 북마크를 가져옵니다.
   */
  async getAll(): Promise<BookmarkResponseDto[]> {
    const { bookmarkControllerGetBookmarks } = getApi();
    return await bookmarkControllerGetBookmarks({ offset: 0 });
  },

  /**
   * 새로운 북마크를 추가합니다.
   */
  async add(contentId: number): Promise<BookmarkResponseDto> {
    const { bookmarkControllerAddBookmark } = getApi();
    return await bookmarkControllerAddBookmark({ contentId });
  },

  /**
   * 북마크를 삭제합니다.
   */
  async remove(contentId: number): Promise<void> {
    const { bookmarkControllerRemoveBookmark } = getApi();
    await bookmarkControllerRemoveBookmark(contentId);
  },

  /**
   * 특정 랜드마크의 북마크 상태를 확인합니다.
   */
  async getStatus(contentId: number): Promise<boolean> {
    const api = getApi();
    const response = await api.bookmarkControllerCheckBookmarkStatus(contentId);
    return response.isBookmarked;
  },
};
