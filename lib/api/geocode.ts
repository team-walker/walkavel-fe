import { AddressResult } from '@/types/address';

export async function searchAddressGeocode(
  query: string,
  region: string = '서울특별시',
  signal?: AbortSignal,
): Promise<AddressResult[]> {
  const response = await fetch(
    `/api/geocode?query=${encodeURIComponent(query)}&region=${encodeURIComponent(region)}`,
    { signal },
  );
  const data = await response.json();

  return data.addresses || [];
}
