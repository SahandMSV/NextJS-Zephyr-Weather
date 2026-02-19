import { NextRequest, NextResponse } from 'next/server';
import { isProviderId } from '../../../lib/weather/adapters';

export const dynamic = 'force-dynamic'; // To ensure it’s not cached

const mem = globalThis as unknown as {
  __usage?: Map<string, number>;
};

function store() {
  mem.__usage ??= new Map<string, number>();
  return mem.__usage;
}

export async function GET(req: NextRequest) {
  const provider = req.nextUrl.searchParams.get('provider');
  if (!isProviderId(provider)) {
    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
  }

  const key = `demo:${provider}`;
  const count = store().get(key) ?? 0;

  return NextResponse.json({ provider, count });
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    provider?: string;
  } | null;
  const provider = body?.provider ?? null;

  if (!isProviderId(provider)) {
    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
  }

  const key = `demo:${provider}`;
  const next = (store().get(key) ?? 0) + 1;
  store().set(key, next);

  return NextResponse.json({ provider, count: next });
}
