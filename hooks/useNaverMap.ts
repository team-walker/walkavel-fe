'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { LANDMARK_MARKER_CONTENT, MAP_CONFIG, USER_MARKER_CONTENT } from '@/constants/map';
import { showErrorToast, showInfoToast } from '@/lib/utils/toast';

interface UseNaverMapProps {
  lat: number;
  lng: number;
  isMapLoaded: boolean;
  mapElement: React.RefObject<HTMLDivElement | null>;
}

export const useNaverMap = ({ lat, lng, isMapLoaded, mapElement }: UseNaverMapProps) => {
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markerRef = useRef<naver.maps.Marker | null>(null);
  const userMarkerRef = useRef<naver.maps.Marker | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (!isMapLoaded || !mapElement.current || typeof naver === 'undefined' || !naver.maps) return;

    const location = new naver.maps.LatLng(lat, lng);

    if (!mapRef.current) {
      const mapOptions: naver.maps.MapOptions = {
        center: location,
        zoom: MAP_CONFIG.DEFAULT_ZOOM,
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
          content: LANDMARK_MARKER_CONTENT,
          anchor: new naver.maps.Point(20, 20),
        },
      });
    } else {
      mapRef.current.setCenter(location);
      markerRef.current?.setPosition(location);
    }
  }, [isMapLoaded, lat, lng, mapElement]);

  const handleZoom = useCallback((delta: number) => {
    if (!mapRef.current) return;
    const currentZoom = mapRef.current.getZoom();
    mapRef.current.setZoom(currentZoom + delta);
  }, []);

  const handleCurrentLocation = useCallback(() => {
    if (!mapRef.current || isLocating) return;

    if (!navigator.geolocation) {
      showErrorToast('GPS를 지원하지 않는 브라우저입니다.');
      return;
    }

    setIsLocating(true);
    showInfoToast('현재 위치를 확인하는 중입니다.');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = new naver.maps.LatLng(latitude, longitude);

        if (!userMarkerRef.current) {
          userMarkerRef.current = new naver.maps.Marker({
            position: userLocation,
            map: mapRef.current!,
            icon: {
              content: USER_MARKER_CONTENT,
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
        showErrorToast('위치 정보를 가져올 수 없습니다.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 5000 },
    );
  }, [isLocating]);

  return {
    isLocating,
    handleZoom,
    handleCurrentLocation,
  };
};
