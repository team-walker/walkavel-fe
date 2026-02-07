import { AddressResult } from '@/types/address';

export async function searchAddressGeocode(
  query: string,
  signal?: AbortSignal,
): Promise<AddressResult[]> {
  const response = await fetch(
    `/api/geocode?query=${encodeURIComponent(query)}&region=${encodeURIComponent('서울특별시')}`,
    { signal },
  );
  const data = await response.json();

  return data.addresses || [];
}
