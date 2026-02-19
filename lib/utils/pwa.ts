export const VIBRATION_PATTERNS = {
  SUCCESS: [100, 50, 100],
  ACQUIRED: [200, 100, 200],
  ERROR: [300, 100, 300, 100],
  SWIPE: 40,
} as const;

export const triggerVibration = (pattern: number | number[]) => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('Vibration failed:', error);
    }
  }
};
