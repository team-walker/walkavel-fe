import { useEffect } from 'react';

import { calculateHaversineDistance } from '@/lib/haversine';
import { useExploreStore } from '@/store/exploreStore';

// 순수하게 현재 위치 업데이트 및 대상과의 거리 계산만 담당
export const useWatchLocation = (targetLat?: number, targetLng?: number) => {
  const { setUserLocation, setDistanceToTarget, isExploring } = useExploreStore();

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
    isExploring, // isExploring이 변할 때마다 watch 설정 다시 함 (정확도 변경 목적)
    setUserLocation,
    setDistanceToTarget,
  ]);
};
