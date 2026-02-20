/**
 * Naver Map 관련 상수 설정
 */
export const MAP_CONFIG = {
  DEFAULT_ZOOM: 16,
  MIN_ZOOM: 6,
  MAX_ZOOM: 19,
  DEFAULT_CENTER: {
    lat: 37.5665,
    lng: 126.978,
  },
} as const;

export const LANDMARK_MARKER_CONTENT = `
  <div style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; background-color: #3182F6; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  </div>
`;

export const USER_MARKER_CONTENT = `
  <div style="position: relative; width: 24px; height: 24px;">
    <div style="position: absolute; width: 100%; height: 100%; background-color: rgba(49, 130, 246, 0.3); border-radius: 50%; animation: pulse 1.5s infinite;"></div>
    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 12px; height: 12px; background-color: #3182F6; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
  </div>
  <style>
    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.7; }
      70% { transform: scale(2.5); opacity: 0; }
      100% { transform: scale(1); opacity: 0; }
    }
  </style>
`;

export const MAP_APP_URLS = {
  NAVER_MOBILE: (lat: number, lng: number, title: string) =>
    `https://m.map.naver.com/map.naver?lat=${lat}&lng=${lng}&pinTitle=${encodeURIComponent(title)}&pinType=site&dlevel=11`,
  NAVER_DESKTOP: (keyword: string, lat: number, lng: number) =>
    `https://map.naver.com/p/search/${encodeURIComponent(keyword)}?c=${lng},${lat},15,0,0,0,dh`,
} as const;
