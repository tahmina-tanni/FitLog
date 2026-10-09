import { NextResponse } from 'next/server';

const endpoints = [
  'https://api.abcz.workers.dev/api/fitlog',
  'https://api.api-store.workers.dev/api/fitlog',
] as const;

function asList(payload: unknown): unknown[] | null {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    const value = payload as { data?: unknown; workouts?: unknown };
    if (Array.isArray(value.data)) return value.data;
    if (Array.isArray(value.workouts)) return value.workouts;
  }
  return null;
}

export async function GET() {
  const errors: string[] = [];
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, { cache: 'no-store', signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload: unknown = await response.json();
      const list = asList(payload);
      if (!list) throw new Error('Unexpected API response format');
      return NextResponse.json(list, { headers: { 'Cache-Control': 'no-store' } });
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown API error');
    }
  }
  return NextResponse.json(
    { error: 'Unable to reach the workout providers.', details: errors },
    { status: 502, headers: { 'Cache-Control': 'no-store' } },
  );
}
