import { useCallback, useEffect, useState } from 'react';
import type { Workout } from '../types';
import { loadWorkouts, saveWorkouts } from './storage';

/** Workouts state, persisted to localStorage and sorted newest-first. */
export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>(() => loadWorkouts());

  useEffect(() => {
    saveWorkouts(workouts);
  }, [workouts]);

  const addWorkout = useCallback((w: Workout) => {
    setWorkouts((prev) => [...prev, w].sort((a, b) => b.date.localeCompare(a.date)));
  }, []);

  const deleteWorkout = useCallback((id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  }, []);

  return { workouts, addWorkout, deleteWorkout };
}
