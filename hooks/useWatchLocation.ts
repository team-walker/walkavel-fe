import { useCallback, useEffect, useRef } from 'react';

import { GEOLOCATION_CONFIG } from '@/constants/config';
import { calculateHaversineDistance } from '@/lib/utils/math';
import { triggerVibration, VIBRATION_PATTERNS } from '@/lib/utils/pwa';
import { showErrorToast } from '@/lib/utils/toast';
import { useExploreStore } from '@/store/exploreStore';

export const useWatchLocation = (targetLat?: number, targetLng?: number) => {
  const { setUserLocation, setDistanceToTarget, isExploring } = useExploreStore();
  const watchId = useRef<number | null>(null);

  const startWatching = useCallback(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      showErrorToast('GPS를 지원하지 않는 브라우저입니다.');
      return;
    }

    if (watchId.current !== null) return;

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });

        if (targetLat && targetLng) {
          const dist = calculateHaversineDistance(latitude, longitude, targetLat, targetLng);
          setDistanceToTarget(dist);
        }
      },
      (error) => {
        if (error.code === 1) {
          showErrorToast('위치 권한을 허용해주세요.');
          triggerVibration([...VIBRATION_PATTERNS.ERROR]);
        } else if (error.code !== 2) {
          console.error('GPS Error: ', error);
        }
      },
      {
        enableHighAccuracy: isExploring,
        maximumAge: isExploring ? GEOLOCATION_CONFIG.MAX_AGE_HIGH : GEOLOCATION_CONFIG.MAX_AGE_LOW,
        timeout: GEOLOCATION_CONFIG.SEARCH_TIMEOUT,
      },
    );
  }, [targetLat, targetLng, isExploring, setUserLocation, setDistanceToTarget]);

  const stopWatching = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }, []);

  useEffect(() => {
    startWatching();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopWatching();
      } else {
        startWatching();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopWatching();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startWatching, stopWatching]);
};
