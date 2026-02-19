'use server';

import { getGeocodeAction } from '@/lib/api/geocode-service';
import { AddressResult } from '@/types/address';

export async function searchAddressAction(
  query: string,
  region?: string,
): Promise<AddressResult[]> {
  try {
    return await getGeocodeAction(query, region);
  } catch (error) {
    console.error('Server Action Error (searchAddressAction):', error);
    return [];
  }
}
