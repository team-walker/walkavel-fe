'use client';

import { Locate, Minus, Plus } from 'lucide-react';
import Script from 'next/script';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useNaverMap } from '@/hooks/useNaverMap';

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
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const { isLocating, handleZoom, handleCurrentLocation } = useNaverMap({
    lat,
    lng,
    isMapLoaded,
    mapElement,
  });

  return (
    <div className={`relative ${className}`}>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID}`}
        onReady={() => setIsMapLoaded(true)}
      />
      <div ref={mapElement} style={{ width: '100%', height: '100%' }} />

      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {showCurrentLocationButton && (
          <Button
            onClick={handleCurrentLocation}
            className="hover:bg-walkavel-gray-50 active:bg-walkavel-gray-100 flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-md transition-colors"
            aria-label="내 위치 찾기"
          >
            <Locate
              size={24}
              className={`${isLocating ? 'text-brand-blue animate-spin' : 'text-walkavel-gray-700'}`}
            />
          </Button>
        )}

        <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md">
          <Button
            onClick={() => handleZoom(1)}
            className="hover:bg-walkavel-gray-50 active:bg-walkavel-gray-100 flex h-12 w-12 items-center justify-center rounded-none bg-white p-0"
            aria-label="지도 확대"
          >
            <Plus size={24} className="text-walkavel-gray-700" />
          </Button>
          <div className="bg-walkavel-gray-100 h-px w-full" />
          <Button
            onClick={() => handleZoom(-1)}
            className="hover:bg-walkavel-gray-50 active:bg-walkavel-gray-100 flex h-12 w-12 items-center justify-center rounded-none bg-white p-0"
            aria-label="지도 축소"
          >
            <Minus size={24} className="text-walkavel-gray-700" />
          </Button>
        </div>
      </div>
    </div>
  );
};
