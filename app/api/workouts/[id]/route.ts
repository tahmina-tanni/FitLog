import { NextResponse } from 'next/server';

const endpoints = [
  'https://api.abcz.workers.dev/api/fitlog',
  'https://api.api-store.workers.dev/api/fitlog',
] as const;

type Envelope = { data?: unknown; workout?: unknown };
function unwrap(payload: unknown): unknown {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    const envelope = payload as Envelope;
    return envelope.workout ?? envelope.data ?? payload;
  }
  return payload;
}
function idOf(value: unknown): number | null {
  if (!value || typeof value !== 'object') return null;
  const id = Number((value as { id?: unknown }).id);
  return Number.isFinite(id) ? id : null;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid workout ID.' }, { status: 404 });
  }

  const errors: string[] = [];
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${endpoint}/${id}`, { cache: 'no-store', signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload: unknown = unwrap(await response.json());
      if (idOf(payload) !== id) throw new Error('API returned a different workout ID');
      return NextResponse.json(payload, { headers: { 'Cache-Control': 'no-store' } });
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown API error');
    }
  }

  // Some provider deployments may not support the individual endpoint reliably.
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, { cache: 'no-store', signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload: unknown = await response.json();
      const list = Array.isArray(payload)
        ? payload
        : payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)
          ? (payload as { data: unknown[] }).data
          : payload && typeof payload === 'object' && Array.isArray((payload as { workouts?: unknown }).workouts)
            ? (payload as { workouts: unknown[] }).workouts
            : [];
      const found = list.find((item) => idOf(item) === id);
      if (found) return NextResponse.json(found, { headers: { 'Cache-Control': 'no-store' } });
      errors.push('Workout not found in this provider list');
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown API error');
    }
  }

  return NextResponse.json(
    { error: 'Unable to load this workout.', details: errors },
    { status: 502, headers: { 'Cache-Control': 'no-store' } },
  );
}
