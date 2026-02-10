'use client';

import { Locate } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface NaverMapProps {
  lat: number;
  lng: number;
  className?: string;
  showCurrentLocationButton?: boolean;
}

export const NaverMap = ({
  lat,
  lng,
  className,
  showCurrentLocationButton = true,
}: NaverMapProps) => {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markerRef = useRef<naver.maps.Marker | null>(null);
  const userMarkerRef = useRef<naver.maps.Marker | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (!mapElement.current) return;

    const initMap = () => {
      // naver 객체가 존재하는지 확인 (타입 안전성 확보)
      if (typeof naver === 'undefined' || !mapElement.current) return;

      const location = new naver.maps.LatLng(lat, lng);

      if (!mapRef.current) {
        const mapOptions: naver.maps.MapOptions = {
          center: location,
          zoom: 16,
          zoomControl: true,
          scrollWheel: false,
          draggable: true, // 드래그 가능하게 변경 (지도 탐색 용이)
          scaleControl: false,
          logoControl: false,
          mapDataControl: false,
        };

        mapRef.current = new naver.maps.Map(mapElement.current, mapOptions);

        markerRef.current = new naver.maps.Marker({
          position: location,
          map: mapRef.current,
          icon: {
            content: `
              <div style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; background-color: #3182F6; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            `,
            anchor: new naver.maps.Point(20, 20),
          },
        });
      } else {
        mapRef.current.setCenter(location);
        markerRef.current?.setPosition(location);
      }
    };

    if (typeof naver !== 'undefined' && naver.maps) {
      initMap();
    } else {
      // 스크립트가 아직 로드되지 않았을 경우를 대비해 일정 시간마다 체크
      const timer = setInterval(() => {
        if (typeof naver !== 'undefined' && naver.maps) {
          initMap();
          clearInterval(timer);
        }
      }, 100);
      return () => clearInterval(timer);
    }
  }, [lat, lng]);

  const handleCurrentLocation = () => {
    if (!mapRef.current || isLocating) return;

    if (!navigator.geolocation) {
      toast.error('GPS를 지원하지 않는 브라우저입니다.');
      return;
    }

    setIsLocating(true);
    toast.info('내 위치를 확인하는 중입니다...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = new naver.maps.LatLng(latitude, longitude);

        // 내 위치 마커 생성 또는 이동
        if (!userMarkerRef.current) {
          userMarkerRef.current = new naver.maps.Marker({
            position: userLocation,
            map: mapRef.current!,
            icon: {
              content: `
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
              `,
              anchor: new naver.maps.Point(12, 12),
            },
          });
        } else {
          userMarkerRef.current.setPosition(userLocation);
        }

        // 지도 중심 이동
        mapRef.current?.panTo(userLocation);
        setIsLocating(false);
      },
      (error) => {
        console.error(error);
        toast.error('위치 정보를 가져올 수 없습니다.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 5000 },
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div ref={mapElement} style={{ width: '100%', height: '100%' }} />
      {showCurrentLocationButton && (
        <button
          onClick={handleCurrentLocation}
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-md transition-colors hover:bg-gray-50 active:bg-gray-100"
          aria-label="내 위치 찾기"
        >
          <Locate
            size={20}
            className={`${isLocating ? 'animate-spin text-blue-500' : 'text-gray-700'}`}
          />
        </button>
      )}
    </div>
  );
};
