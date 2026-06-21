import type { Workout } from '../types';
import { PROCESS_GOAL } from '../data/goals';
import { addDays, thisMonthCount, thisWeek, weekLabel, weeklyStats } from '../lib/calc';
import { Card, SectionTitle } from './ui';

const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function dayColor(workouts: Workout[], iso: string): string {
  const onDay = workouts.filter((w) => w.date === iso);
  if (onDay.some((w) => w.type === 'CrossFit')) return 'bg-emerald-500';
  if (onDay.length > 0) return 'bg-sky-500/70';
  return 'bg-neutral-800';
}

export function WeeklyView({ workouts }: { workouts: Workout[] }) {
  const week = thisWeek(workouts);
  const month = thisMonthCount(workouts);
  const weeks = weeklyStats(workouts, 10);

  return (
    <div className="space-y-6">
      <section>
        <SectionTitle>Consistency</SectionTitle>
        <div className="flex gap-3">
          <Card className="flex-1 text-center">
            <p className="text-3xl font-bold text-neutral-100">{week.total}</p>
            <p className="mt-1 text-xs text-neutral-400">this week</p>
          </Card>
          <Card className="flex-1 text-center">
            <p className="text-3xl font-bold text-neutral-100">{month}</p>
            <p className="mt-1 text-xs text-neutral-400">this month</p>
          </Card>
        </div>
      </section>

      <section>
        <SectionTitle>Weekly view · success = {PROCESS_GOAL.weeklyTarget}+ CrossFit</SectionTitle>
        <div className="space-y-2">
          {weeks.map((wk) => (
            <Card
              key={wk.weekStart}
              className={`flex items-center justify-between ${
                wk.success ? 'border-emerald-500/40' : ''
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-neutral-200">
                    {weekLabel(wk.weekStart)}
                  </span>
                  {wk.isCurrent && (
                    <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-400">
                      now
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {wk.crossfit} CrossFit · {wk.total} total
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {DOW.map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-[9px] text-neutral-600">{d}</span>
                      <div
                        className={`h-3.5 w-3.5 rounded-sm ${dayColor(
                          workouts,
                          addDays(wk.weekStart, i),
                        )}`}
                      />
                    </div>
                  ))}
                </div>
                <span
                  className={`text-lg ${wk.success ? 'text-emerald-400' : 'text-neutral-700'}`}
                  title={wk.success ? 'Showed up' : 'Did not hit 2'}
                >
                  {wk.success ? '✓' : '○'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
