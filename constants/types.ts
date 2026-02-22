export type STEP = 'SEARCH' | 'SWIPE' | 'FINISH';

export const STORAGE_KEYS = {
  ONBOARDING_SEEN: 'walkavel_onboarding_seen',
  BOOKMARK_STORAGE: 'walkavel-bookmark-storage',
  STAMP_STORAGE: 'walkavel-stamp-storage',
  EXPLORE_STORAGE: 'walkavel-explore-storage',
  REGION_STORAGE: 'walkavel-region-storage',
  SPLASH_STORAGE: 'splash-storage',
} as const;

export const SWIPE_CONFIG = {
  SWIPE_THRESHOLD: 100,
  VELOCITY_THRESHOLD: 500,
  EXIT_X: 1000,
  WIGGLE_DELAY: 0.5,
  WIGGLE_DURATION: 0.6,
  VISIBLE_RANGE: [-200, 0],
  THRESHOLD: -100,
  VELOCITY: -500,
} as const;

/**
 * 프로젝트 전체에서 공통으로 사용되는 리터럴 상수를 정의합니다.
 */
export const COMMON_LITERALS = {
  NO_ADDR: '상세 주소 정보가 없습니다.',
  LOADING_MAP: '지도 로딩 중...',
  SEARCH_PLACEHOLDER: '동 이름으로 검색 (예: 인사동, 명동)',
} as const;
