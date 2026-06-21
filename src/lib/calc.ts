import type { LiftEntry, Workout } from '../types';
import { PROCESS_GOAL, type StrengthGoal } from '../data/goals';

/* ------------------------------------------------------------------ */
/* Dates — all work on local 'YYYY-MM-DD' strings to avoid TZ shifts. */
/* ------------------------------------------------------------------ */

/** Parse 'YYYY-MM-DD' as a local date (no UTC offset surprises). */
export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Format a Date as a local 'YYYY-MM-DD'. */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

/** Monday-of-the-week for a date, as an ISO string. Weeks start Monday. */
export function weekStart(iso: string): string {
  const d = parseDate(iso);
  const offset = (d.getDay() + 6) % 7; // 0 = Monday
  d.setDate(d.getDate() - offset);
  return toISODate(d);
}

export function addDays(iso: string, days: number): string {
  const d = parseDate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** "Jun 16 – 22" style label for the week starting at `weekStartIso`. */
export function weekLabel(weekStartIso: string): string {
  const start = parseDate(weekStartIso);
  const end = parseDate(addDays(weekStartIso, 6));
  const m = (d: Date) => d.toLocaleDateString('en-US', { month: 'short' });
  if (start.getMonth() === end.getMonth()) {
    return `${m(start)} ${start.getDate()} – ${end.getDate()}`;
  }
  return `${m(start)} ${start.getDate()} – ${m(end)} ${end.getDate()}`;
}

export function prettyDate(iso: string): string {
  return parseDate(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/* ------------------------------------------------------------------ */
/* Strength                                                            */
/* ------------------------------------------------------------------ */

/** Estimated one-rep max via the Epley formula. */
export function epley1RM(weightKg: number, reps: number): number {
  if (reps <= 1) return weightKg;
  return weightKg * (1 + reps / 30);
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export interface LiftHistoryRow extends LiftEntry {
  date: string;
  e1rm: number;
  isBest: boolean;
}

/** All sets for a given lift, oldest first, with e1RM and best-set flag. */
export function liftHistory(workouts: Workout[], liftName: string): LiftHistoryRow[] {
  const rows: LiftHistoryRow[] = [];
  for (const w of workouts) {
    for (const l of w.lifts) {
      if (l.name === liftName) {
        rows.push({ ...l, date: w.date, e1rm: epley1RM(l.weightKg, l.reps), isBest: false });
      }
    }
  }
  rows.sort((a, b) => a.date.localeCompare(b.date));
  let bestIdx = -1;
  rows.forEach((r, i) => {
    if (bestIdx === -1 || r.e1rm > rows[bestIdx].e1rm) bestIdx = i;
  });
  if (bestIdx >= 0) rows[bestIdx].isBest = true;
  return rows;
}

/** The single best set for a lift, by estimated 1RM. */
export function bestSet(workouts: Workout[], liftName: string): LiftHistoryRow | null {
  const rows = liftHistory(workouts, liftName);
  return rows.find((r) => r.isBest) ?? null;
}

/** Progress 0..1 toward a goal, measured by estimated 1RM. */
export function goalProgress(workouts: Workout[], goal: StrengthGoal): number {
  const best = bestSet(workouts, goal.lift);
  if (!best) return 0;
  const target = epley1RM(goal.targetWeightKg, goal.targetReps);
  return Math.max(0, Math.min(1, best.e1rm / target));
}

/** Distinct lift names ever logged, in insertion order. */
export function loggedLiftNames(workouts: Workout[]): string[] {
  const seen: string[] = [];
  for (const w of workouts) {
    for (const l of w.lifts) {
      if (!seen.includes(l.name)) seen.push(l.name);
    }
  }
  return seen;
}

/* ------------------------------------------------------------------ */
/* Consistency                                                         */
/* ------------------------------------------------------------------ */

export interface WeekStat {
  weekStart: string;
  total: number;
  crossfit: number;
  success: boolean;
  isCurrent: boolean;
}

function summarizeWeek(workouts: Workout[], wkStart: string, currentWeek: string): WeekStat {
  const inWeek = workouts.filter((w) => weekStart(w.date) === wkStart);
  const crossfit = inWeek.filter((w) => w.type === 'CrossFit').length;
  return {
    weekStart: wkStart,
    total: inWeek.length,
    crossfit,
    success: crossfit >= PROCESS_GOAL.weeklyTarget,
    isCurrent: wkStart === currentWeek,
  };
}

/**
 * Contiguous weekly stats from the first logged week (or `weeks` ago)
 * up to the current week, most recent first.
 */
export function weeklyStats(workouts: Workout[], minWeeks = 8): WeekStat[] {
  const current = weekStart(todayISO());
  let earliest = current;
  for (const w of workouts) {
    const ws = weekStart(w.date);
    if (ws < earliest) earliest = ws;
  }
  // Ensure at least `minWeeks` of history is shown.
  const floor = addDays(current, -7 * (minWeeks - 1));
  if (floor < earliest) earliest = floor;

  const out: WeekStat[] = [];
  let cursor = current;
  while (cursor >= earliest) {
    out.push(summarizeWeek(workouts, cursor, current));
    cursor = addDays(cursor, -7);
  }
  return out; // most recent first
}

/**
 * Consecutive successful weeks ending now. The current week gets a grace
 * pass: if it isn't successful *yet*, it doesn't break the streak.
 */
export function currentStreak(workouts: Workout[]): number {
  const weeks = weeklyStats(workouts); // most recent first
  let i = 0;
  if (weeks.length && weeks[0].isCurrent && !weeks[0].success) i = 1;
  let streak = 0;
  for (; i < weeks.length; i++) {
    if (weeks[i].success) streak++;
    else break;
  }
  return streak;
}

export function thisWeek(workouts: Workout[]): WeekStat {
  const current = weekStart(todayISO());
  return summarizeWeek(workouts, current, current);
}

export function thisMonthCount(workouts: Workout[]): number {
  const now = todayISO().slice(0, 7); // 'YYYY-MM'
  return workouts.filter((w) => w.date.slice(0, 7) === now).length;
}
