export type STEP = 'SEARCH' | 'SWIPE' | 'FINISH';

export const STORAGE_KEYS = {
  ONBOARDING_SEEN: 'walkavel_onboarding_seen',
  BOOKMARK_STORAGE: 'walkavel-bookmark-storage',
} as const;

export const SWIPE_CONFIG = {
  THRESHOLD: -100, // 삭제 트리거 거리
  VELOCITY: -400, // 삭제 트리거 속도
  VISIBLE_RANGE: [0, -60], // 배경 아이콘 표시 범위
} as const;
