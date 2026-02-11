import { useEffect, useMemo, useState } from 'react';

import { getAPIDocumentation } from '@/types/api';
import { LandmarkDetailResponseDto } from '@/types/model';

export function useLandmarkDetail(id: number | null) {
  const [data, setData] = useState<LandmarkDetailResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { tourControllerGetLandmarkDetail } = useMemo(() => getAPIDocumentation(), []);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await tourControllerGetLandmarkDetail(id);
        setData(response);
      } catch (error) {
        console.error('Failed to fetch landmark detail:', error);
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, tourControllerGetLandmarkDetail]);

  const galleryImages = useMemo<string[]>(() => {
    if (!data) return [];
    const { detail, images } = data;
    const imgs =
      images && images.length > 0
        ? images.map((img) => img.originimgurl || img.smallimageurl)
        : [detail.firstimage || detail.firstimage2];
    return imgs.filter((url): url is string => !!url);
  }, [data]);

  return { data, galleryImages, loading, error };
}
