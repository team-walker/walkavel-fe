import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('query');
  const region = searchParams.get('region'); // Custom parameter for strict filtering

  if (!query) {
    return NextResponse.json({ error: 'Query is required.' }, { status: 400 });
  }

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Naver API credentials are not set in environment variables.');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const SEOUL_COORDINATE = '126.978388,37.566610';

  let url = `https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(query)}`;
  url += `&coordinate=${SEOUL_COORDINATE}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-NCP-APIGW-API-KEY-ID': clientId,
        'X-NCP-APIGW-API-KEY': clientSecret,
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    if (region && data.addresses) {
      data.addresses = data.addresses.filter(
        (address: { roadAddress: string; jibunAddress: string }) =>
          address.roadAddress.includes(region) || address.jibunAddress.includes(region),
      );

      data.meta.totalCount = data.addresses.length;
      data.meta.count = data.addresses.length;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch geocode data.' }, { status: 500 });
  }
}
