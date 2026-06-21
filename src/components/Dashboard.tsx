import type { Workout } from '../types';
import { KICKOFF, PROCESS_GOAL, STRENGTH_GOALS } from '../data/goals';
import {
  bestSet,
  currentStreak,
  epley1RM,
  goalProgress,
  round1,
  thisMonthCount,
  thisWeek,
} from '../lib/calc';
import { Card, ProgressBar, SectionTitle } from './ui';

function ShowedUpHero({ crossfit }: { crossfit: number }) {
  const target = PROCESS_GOAL.weeklyTarget;
  const done = crossfit >= target;
  const headline = done ? 'Yes 💪' : crossfit === 0 ? 'Not yet' : 'Almost';
  const sub = done
    ? `${crossfit} CrossFit session${crossfit === 1 ? '' : 's'} this week. Keep it rolling.`
    : `${crossfit} of ${target} CrossFit this week — ${target - crossfit} more to show up.`;

  return (
    <Card className={done ? 'border-emerald-500/40' : ''}>
      <p className="text-sm text-neutral-400">Did I show up this week?</p>
      <p className={`mt-1 text-4xl font-bold ${done ? 'text-emerald-400' : 'text-neutral-100'}`}>
        {headline}
      </p>
      <p className="mt-2 text-sm text-neutral-400">{sub}</p>
      <div className="mt-3 flex gap-2">
        {Array.from({ length: target }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${i < crossfit ? 'bg-emerald-500' : 'bg-neutral-800'}`}
          />
        ))}
        {crossfit > target && (
          <span className="text-xs font-medium text-emerald-400">+{crossfit - target}</span>
        )}
      </div>
    </Card>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <Card className="flex-1 text-center">
      <p className="text-3xl font-bold text-neutral-100">{value}</p>
      <p className="mt-1 text-xs text-neutral-400">{label}</p>
    </Card>
  );
}

function GoalCard({ workouts, goal }: { workouts: Workout[]; goal: (typeof STRENGTH_GOALS)[number] }) {
  const best = bestSet(workouts, goal.lift);
  const progress = goalProgress(workouts, goal);
  const pct = Math.round(progress * 100);
  const targetE1rm = round1(epley1RM(goal.targetWeightKg, goal.targetReps));

  return (
    <Card>
      <div className="flex items-baseline justify-between">
        <h3 className="font-semibold text-neutral-100">{goal.lift}</h3>
        <span className="text-sm text-neutral-400">
          target {goal.targetWeightKg} × {goal.targetReps}
        </span>
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-2xl font-bold text-neutral-100">
          {best ? `${best.weightKg} × ${best.reps}` : '—'}
        </span>
        <span className="text-sm font-medium text-emerald-400">{pct}%</span>
      </div>
      <div className="mt-2">
        <ProgressBar value={progress} />
      </div>
      <p className="mt-2 text-xs text-neutral-500">
        est. 1RM {best ? round1(best.e1rm) : 0} / {targetE1rm} kg
      </p>
    </Card>
  );
}

export function Dashboard({ workouts }: { workouts: Workout[] }) {
  const week = thisWeek(workouts);
  const streak = currentStreak(workouts);
  const month = thisMonthCount(workouts);
  const showKickoff = streak === 0 && workouts.length <= 1;

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <ShowedUpHero crossfit={week.crossfit} />
        <div className="flex gap-3">
          <Stat value={`🔥 ${streak}`} label={streak === 1 ? 'week streak' : 'week streak'} />
          <Stat value={week.total} label="workouts this week" />
          <Stat value={month} label="this month" />
        </div>
        {showKickoff && (
          <p className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-xs text-neutral-400">
            {KICKOFF.note}
          </p>
        )}
      </section>

      <section>
        <SectionTitle>Strength goals · by Dec 31, 2026</SectionTitle>
        <div className="space-y-3">
          {STRENGTH_GOALS.map((g) => (
            <GoalCard key={g.lift} workouts={workouts} goal={g} />
          ))}
        </div>
      </section>
    </div>
  );
}
