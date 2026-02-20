'use server';

import { revalidatePath } from 'next/cache';

import { fetchServerApi } from '@/lib/api/server-api';
import { BookmarkResponseDto } from '@/types/model';

/**
 * 북마크 목록 조회 (서버 사이드)
 */
export async function getBookmarksAction() {
  try {
    return await fetchServerApi<BookmarkResponseDto[]>('/bookmarks?offset=0');
  } catch (error) {
    console.error('getBookmarksAction error:', error);
    return [];
  }
}

/**
 * 북마크 추가 (Server Action)
 */
export async function addBookmarkAction(contentId: number) {
  try {
    await fetchServerApi('/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ contentId }),
    });
    revalidatePath('/bookmark');
    return { success: true };
  } catch (error) {
    console.error('addBookmarkAction error:', error);
    return { success: false, error: '북마크 추가에 실패했습니다.' };
  }
}

/**
 * 북마크 삭제 (Server Action)
 */
export async function removeBookmarkAction(contentId: number) {
  try {
    await fetchServerApi(`/bookmarks/${contentId}`, {
      method: 'DELETE',
    });
    revalidatePath('/bookmark');
    return { success: true };
  } catch (error) {
    console.error('removeBookmarkAction error:', error);
    return { success: false, error: '북마크 삭제에 실패했습니다.' };
  }
}
