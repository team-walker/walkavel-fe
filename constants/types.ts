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
  SWIPE_THRESHOLD: 100, // 스와이프 판정 거리 (px)
  VELOCITY_THRESHOLD: 500, // 스와이프 판정 속도
  EXIT_X: 1000, // 화면 밖으로 나가는 거리
  WIGGLE_DELAY: 0.5,
  WIGGLE_DURATION: 0.6,
  VISIBLE_RANGE: [-200, 0], // 스와이프 가이드/배경 가시 거리
  THRESHOLD: -100, // 삭제 판정 기준 (왼쪽으로 100px)
  VELOCITY: -500, // 삭제 판정 속도
} as const;

/**
 * 프로젝트 전체에서 공통으로 사용되는 리터럴 상수를 정의합니다.
 */
export const COMMON_LITERALS = {
  NO_ADDR: '상세 주소 정보가 없습니다.',
  LOADING_MAP: '지도 로딩 중...',
  SEARCH_PLACEHOLDER: '동 이름으로 검색 (예: 인사동, 명동)',
} as const;
