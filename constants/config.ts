export const STAMP_CONFIG = {
  DISCOVERY_DISTANCE: 150, // 스탬프 미션 시작 가능 거리 (미터 단위)
  ACQUISITION_DISTANCE: 50, // 스탬프 자동 획득 허용 거리 (미터 단위)
} as const;

export const GEOLOCATION_CONFIG = {
  HIGH_ACCURACY_THRESHOLD: 3000, // 고정밀 모드 유지 시간 (ms)
  SEARCH_TIMEOUT: 10000, // 위치 조회 타임아웃 (ms)
  MAX_AGE_HIGH: 0, // 고정밀 모드 시 위치 캐시 수명
  MAX_AGE_LOW: 3000, // 일반 모드 시 위치 캐시 수명
} as const;

export const API_CONFIG = {
  DEFAULT_TIMEOUT: 10000,
  SEARCH_DEBOUNCE: 300,
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
} as const;

export const UI_CONFIG = {
  ANIMATION_DURATION: 0.3,
  TOAST_DURATION: 3000,
} as const;
