// src/app/api/weather/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAdapter, isProviderId } from '../../../lib/weather/adapters';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const providerParam = req.nextUrl.searchParams.get('provider');
  const lat = Number(req.nextUrl.searchParams.get('lat'));
  const lon = Number(req.nextUrl.searchParams.get('lon'));

  if (!isProviderId(providerParam)) {
    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
  }
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: 'Invalid lat/lon' }, { status: 400 });
  }

  const adapter = getAdapter(providerParam);
  if (!adapter) {
    return NextResponse.json(
      { error: `Provider "${providerParam}" not implemented yet` },
      { status: 501 },
    );
  }

  try {
    const forecast = await adapter.getForecast({ lat, lon, forecastDays: 7 });
    return NextResponse.json(forecast);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 502 },
    );
  }
}
