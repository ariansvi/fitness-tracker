import type { Workout } from '../types';

const KEY = 'fitness-tracker:workouts:v1';

/** Baseline entry so the app isn't empty on first open. */
const SEED: Workout[] = [
  {
    id: 'seed-run-2026-06-21',
    date: '2026-06-21',
    type: 'Run',
    notes: '20:01 · 2.69 km · avg pace 7:26/km · avg HR 139. Re-registered to CrossFit today.',
    lifts: [],
  },
];

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

export function loadWorkouts(): Workout[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) {
      localStorage.setItem(KEY, JSON.stringify(SEED));
      return SEED;
    }
    const parsed = JSON.parse(raw) as Workout[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveWorkouts(workouts: Workout[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(workouts));
  } catch {
    // Storage full or unavailable — nothing we can do, keep app responsive.
  }
}
