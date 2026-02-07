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

  // 1. 서울 중심부 좌표 (Seoul Center)를 기본으로 활용하여 우선순위 확보
  const SEOUL_COORDINATE = '126.978388,37.566610';

  let url = `https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(query)}`;
  url += `&coordinate=${SEOUL_COORDINATE}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-NCP-APIGW-API-KEY-ID': clientId || '',
        'X-NCP-APIGW-API-KEY': clientSecret || '',
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    // 2. region 파라미터가 있을 경우, 결과 데이터에서 해당 지역만 필터링 (Strict Filtering)
    if (region && data.addresses) {
      data.addresses = data.addresses.filter(
        (address: { roadAddress: string; jibunAddress: string }) =>
          address.roadAddress.includes(region) || address.jibunAddress.includes(region),
      );
      // 필터링 후 전체 개수 등 메타 정보 업데이트
      data.meta.totalCount = data.addresses.length;
      data.meta.count = data.addresses.length;
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch geocode data.' }, { status: 500 });
  }
}
