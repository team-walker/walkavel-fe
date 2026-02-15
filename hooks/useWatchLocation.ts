import { useEffect } from 'react';

import { calculateHaversineDistance } from '@/lib/haversine';
import { useExploreStore } from '@/store/exploreStore';
import { useStampStore } from '@/store/stampStore';

export const useWatchLocation = (targetLat?: number, targetLng?: number, contentId?: number) => {
  const { setUserLocation, setDistanceToTarget, isExploring } = useExploreStore();
  const { addStamp, isCollected } = useStampStore();

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });

        if (targetLat && targetLng) {
          const dist = calculateHaversineDistance(latitude, longitude, targetLat, targetLng);
          setDistanceToTarget(dist);

          // 획득 시나리오: 탐험 중 + 50m 이내 + 미수집 상태일 때 자동 획득
          if (isExploring && dist <= 50 && contentId && !isCollected(contentId)) {
            console.log('🎯 Stamp Acquired!', contentId);
            addStamp(contentId);
            if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
          }
        }
      },
      (error) => {
        if (error.code !== 2) {
          console.error('GPS Error: ', error);
        }
      },
      {
        enableHighAccuracy: isExploring, // 탐험 중에는 고정밀 모드 사용
        maximumAge: isExploring ? 0 : 3000,
        timeout: 10000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [
    targetLat,
    targetLng,
    contentId,
    isExploring, // isExploring이 변할 때마다 watch 설정 다시 함 (정확도 변경 목적)
    isCollected,
    addStamp,
    setUserLocation,
    setDistanceToTarget,
  ]);
};
