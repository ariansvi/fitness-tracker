export type WorkoutType = 'CrossFit' | 'Run' | 'Strength' | 'Other';

export const WORKOUT_TYPES: WorkoutType[] = ['CrossFit', 'Run', 'Strength', 'Other'];

/** A single logged set group for a strength lift. */
export interface LiftEntry {
  id: string;
  name: string;
  weightKg: number;
  reps: number;
  sets: number;
  /** Perceived effort, 1-10. Optional. */
  rpe?: number;
}

export interface Workout {
  id: string;
  /** Local calendar date, 'YYYY-MM-DD'. */
  date: string;
  type: WorkoutType;
  notes?: string;
  /** Strength lifts logged in this session (usually only for type 'Strength'). */
  lifts: LiftEntry[];
}
