import { AddressResult } from '@/types/address';

interface AddressElement {
  types: string[];
  longName: string;
  shortName: string;
  code: string;
}

interface NaverAddress {
  roadAddress: string;
  jibunAddress: string;
  englishAddress: string;
  addressElements: AddressElement[];
  x: string;
  y: string;
  distance: number;
}

interface NaverGeocodeResponse {
  status: string;
  meta: {
    totalCount: number;
    page: number;
    count: number;
  };
  addresses: NaverAddress[];
  errorMessage: string;
}

export async function getGeocodeAction(query: string, region?: string): Promise<AddressResult[]> {
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID || process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Naver API configuration error: Missing Client ID or Secret');
    throw new Error('Server configuration error.');
  }

  const SEOUL_COORDINATE = '126.978388,37.566610';
  const url = `https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(query)}&coordinate=${SEOUL_COORDINATE}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-NCP-APIGW-API-KEY-ID': clientId,
      'X-NCP-APIGW-API-KEY': clientSecret,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Naver API request failed with status ${response.status}`);
  }

  const data: NaverGeocodeResponse = await response.json();

  if (!data.addresses) return [];

  const addresses = data.addresses.map((address) => {
    const sido =
      address.addressElements.find((element) => element.types.includes('SIDO'))?.longName || '';
    const sigugun =
      address.addressElements.find((element) => element.types.includes('SIGUGUN'))?.longName || '';

    return {
      roadAddress: address.roadAddress,
      jibunAddress: address.jibunAddress,
      englishAddress: address.englishAddress,
      sido,
      sigugun,
    };
  });

  if (region) {
    return addresses.filter(
      (address) => address.roadAddress.includes(region) || address.jibunAddress.includes(region),
    );
  }

  return addresses;
}
