'use client';

import { Locate, Minus, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

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
      if (typeof naver === 'undefined' || !mapElement.current) return;

      const location = new naver.maps.LatLng(lat, lng);

      if (!mapRef.current) {
        const mapOptions: naver.maps.MapOptions = {
          center: location,
          zoom: 16,
          zoomControl: false,
          zoomControlOptions: {
            style: naver.maps.ZoomControlStyle.SMALL,
            position: naver.maps.Position.RIGHT_CENTER,
          },
          scrollWheel: false,
          draggable: true,
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
      const timer = setInterval(() => {
        if (typeof naver !== 'undefined' && naver.maps) {
          initMap();
          clearInterval(timer);
        }
      }, 100);
      return () => clearInterval(timer);
    }
  }, [lat, lng]);

  const handleZoom = (delta: number) => {
    if (!mapRef.current) return;
    const currentZoom = mapRef.current.getZoom();
    mapRef.current.setZoom(currentZoom + delta);
  };

  const handleCurrentLocation = () => {
    if (!mapRef.current || isLocating) return;

    if (!navigator.geolocation) {
      toast.error('GPS를 지원하지 않는 브라우저입니다.');
      return;
    }

    setIsLocating(true);
    toast.info('현재 위치를 확인하는 중입니다.');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = new naver.maps.LatLng(latitude, longitude);

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

      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {showCurrentLocationButton && (
          <Button
            onClick={handleCurrentLocation}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-md transition-colors hover:bg-gray-50 active:bg-gray-100"
            aria-label="내 위치 찾기"
          >
            <Locate
              size={20}
              className={`${isLocating ? 'animate-spin text-blue-500' : 'text-gray-700'}`}
            />
          </Button>
        )}

        <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md">
          <Button
            onClick={() => handleZoom(1)}
            className="flex h-9 w-9 items-center justify-center rounded-none bg-white p-0 hover:bg-gray-50 active:bg-gray-100"
            aria-label="지도 확대"
          >
            <Plus size={20} className="text-gray-700" />
          </Button>
          <div className="h-px w-full bg-gray-100" />
          <Button
            onClick={() => handleZoom(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-none bg-white p-0 hover:bg-gray-50 active:bg-gray-100"
            aria-label="지도 축소"
          >
            <Minus size={20} className="text-gray-700" />
          </Button>
        </div>
      </div>
    </div>
  );
};
