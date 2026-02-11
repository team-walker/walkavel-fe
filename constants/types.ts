export type STEP = 'SEARCH' | 'SWIPE' | 'FINISH';

export const STORAGE_KEYS = {
  ONBOARDING_SEEN: 'walkavel_onboarding_seen',
  BOOKMARK_STORAGE: 'walkavel-bookmark-storage',
} as const;

export const SWIPE_CONFIG = {
  THRESHOLD: -100,
  VELOCITY: -400,
  VISIBLE_RANGE: [0, -60],
} as const;
