import type { Workout } from '@/types/workout';

function normalizeWorkout(item: unknown): Workout {
  if (!item || typeof item !== 'object') throw new Error('The workout API returned an invalid workout.');
  const w = item as Record<string, unknown>;
  return {
    id: Number(w.id),
    name: String(w.name ?? 'Untitled workout'),
    image: typeof w.image === 'string' ? w.image : '',
    muscleGroups: Array.isArray(w.muscleGroups) ? w.muscleGroups.map(String) : [],
    equipment: String(w.equipment ?? 'Equipment varies'),
    difficulty: String(w.difficulty ?? 'All levels'),
    duration: Number.isFinite(Number(w.duration)) ? Number(w.duration) : 0,
    caloriesBurned: Number.isFinite(Number(w.caloriesBurned)) ? Number(w.caloriesBurned) : 0,
    sets: Number.isFinite(Number(w.sets)) ? Number(w.sets) : 0,
    reps: String(w.reps ?? '—'),
    rating: Number.isFinite(Number(w.rating)) ? Number(w.rating) : 0,
    description: String(w.description ?? 'A focused movement to build strength and consistency.'),
    instructions: Array.isArray(w.instructions) ? w.instructions.map(String) : [],
  };
}

async function requestJson(url: string): Promise<unknown> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    let message = `Workout request failed (HTTP ${response.status}).`;
    try {
      const body = await response.json() as { error?: string };
      if (body.error) message = body.error;
    } catch { /* Response may not contain JSON. */ }
    throw new Error(message);
  }
  return response.json() as Promise<unknown>;
}

export async function getWorkouts(): Promise<Workout[]> {
  const payload = await requestJson('/api/workouts');
  const list = Array.isArray(payload) ? payload : [];
  const workouts = list.map(normalizeWorkout).filter((workout) => Number.isFinite(workout.id));
  if (!workouts.length) throw new Error('No workouts are available right now. Please try again.');
  return workouts;
}

export async function getWorkout(id: number): Promise<Workout | undefined> {
  try {
    const payload = await requestJson(`/api/workouts/${id}`);
    const workout = normalizeWorkout(payload);
    return Number.isFinite(workout.id) && workout.id === id ? workout : undefined;
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes('not found')) return undefined;
    throw error;
  }
}
