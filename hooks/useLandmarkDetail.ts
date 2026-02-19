import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getApi } from '@/types/api';
import { LandmarkDetailResponseDto } from '@/types/model';

export function useLandmarkDetail(id: number | null, initialData?: LandmarkDetailResponseDto) {
  const { tourControllerGetLandmarkDetail } = getApi();

  const { data, isLoading, error } = useQuery({
    queryKey: ['landmark', id],
    queryFn: () => tourControllerGetLandmarkDetail(id!),
    enabled: !!id,
    initialData,
  });

  const galleryImages = useMemo(() => {
    if (!data) return [];

    const { detail, images } = data;
    const imgs =
      images && images.length > 0
        ? images.map((img) => img.originimgurl || img.smallimageurl)
        : [detail.firstimage || detail.firstimage2];
    return imgs.filter((url): url is string => !!url);
  }, [data]);

  return { data, galleryImages, loading: isLoading, error };
}
