export interface StrengthGoal {
  lift: string;
  targetWeightKg: number;
  targetReps: number;
  /** ISO date the goal should be hit by. */
  deadline: string;
}

/** The three main strength goals. Targets are weight x reps by the deadline. */
export const STRENGTH_GOALS: StrengthGoal[] = [
  { lift: 'Back Squat', targetWeightKg: 100, targetReps: 5, deadline: '2026-12-31' },
  { lift: 'Bench Press', targetWeightKg: 80, targetReps: 5, deadline: '2026-12-31' },
  { lift: 'Deadlift', targetWeightKg: 120, targetReps: 5, deadline: '2026-12-31' },
];

/** Process goal: the thing that actually moves the needle — showing up. */
export const PROCESS_GOAL = {
  /** Minimum CrossFit sessions for a week to count as "successful". */
  weeklyTarget: 2,
};

/** Context shown as a gentle nudge until real momentum builds. */
export const KICKOFF = {
  reRegisteredDate: '2026-06-21',
  note: 'Re-registered to CrossFit on Jun 21 — first session planned for Wednesday.',
};
