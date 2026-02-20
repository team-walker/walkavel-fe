import { NextRequest, NextResponse } from 'next/server';

import { getGeocodeAction } from '@/lib/api/geocode-service';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('query');
  const region = searchParams.get('region');

  if (!query) {
    return NextResponse.json({ error: 'Query is required.' }, { status: 400 });
  }

  try {
    const addresses = await getGeocodeAction(query, region || undefined);

    return NextResponse.json({
      status: 'OK',
      meta: {
        totalCount: addresses.length,
        page: 1,
        count: addresses.length,
      },
      addresses,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Geocode API Route error:', error);

    return NextResponse.json(
      {
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
