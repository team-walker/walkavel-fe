/**
 * PWA/모바일 환경을 위한 진동 패턴 정의 및 유틸리티
 */

export const VIBRATION_PATTERNS = {
  SUCCESS: [100, 50, 100], // 가벼운 성공 (스탬프 발견 등)
  ACQUIRED: [200, 100, 200], // 중요 성공 (스탬프 획득)
  ERROR: [300, 100, 300, 100], // 경고/오류 (GPS 연결 실패 등)
  SWIPE: 40, // 가벼운 틱 (스와이프 피드백)
} as const;

/**
 * 브라우저의 진동 API를 안전하게 실행합니다.
 */
export const triggerVibration = (pattern: number | number[]) => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('Vibration failed:', error);
    }
  }
};
