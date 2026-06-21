import type { Workout } from '../types';
import { STRENGTH_GOALS } from '../data/goals';
import { liftHistory, loggedLiftNames, prettyDate, round1, type LiftHistoryRow } from '../lib/calc';
import { Card, SectionTitle } from './ui';

function Sparkline({ values }: { values: number[] }) {
  const w = 240;
  const h = 48;
  const pad = 4;
  if (values.length < 2) {
    return <p className="text-xs text-neutral-500">Log more sets to see a trend.</p>;
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = (w - pad * 2) / (values.length - 1);
  const points = values.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (h - pad * 2) * (1 - (v - min) / span);
    return `${round1(x)},${round1(y)}`;
  });
  const last = points[points.length - 1].split(',');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="rgb(16 185 129)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r={3} fill="rgb(16 185 129)" />
    </svg>
  );
}

function HistoryTable({ rows }: { rows: LiftHistoryRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-neutral-500">
            <th className="py-1 pr-2 font-medium">Date</th>
            <th className="py-1 px-2 font-medium">kg</th>
            <th className="py-1 px-2 font-medium">Reps</th>
            <th className="py-1 px-2 font-medium">Sets</th>
            <th className="py-1 px-2 font-medium">RPE</th>
            <th className="py-1 pl-2 text-right font-medium">e1RM</th>
          </tr>
        </thead>
        <tbody>
          {[...rows].reverse().map((r) => (
            <tr
              key={r.id}
              className={`border-t border-neutral-800 ${r.isBest ? 'bg-emerald-500/10' : ''}`}
            >
              <td className="py-1.5 pr-2 text-neutral-300">
                {prettyDate(r.date)}
                {r.isBest && <span className="ml-1 text-emerald-400" title="Best set">★</span>}
              </td>
              <td className="py-1.5 px-2 text-neutral-200">{r.weightKg}</td>
              <td className="py-1.5 px-2 text-neutral-200">{r.reps}</td>
              <td className="py-1.5 px-2 text-neutral-200">{r.sets}</td>
              <td className="py-1.5 px-2 text-neutral-400">{r.rpe ?? '—'}</td>
              <td className="py-1.5 pl-2 text-right font-medium text-neutral-100">{round1(r.e1rm)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LiftSection({ workouts, name }: { workouts: Workout[]; name: string }) {
  const rows = liftHistory(workouts, name);
  const best = rows.find((r) => r.isBest);

  return (
    <Card className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="font-semibold text-neutral-100">{name}</h3>
        {best ? (
          <span className="text-sm text-emerald-400">
            best {best.weightKg} × {best.reps} · e1RM {round1(best.e1rm)}
          </span>
        ) : (
          <span className="text-sm text-neutral-500">no sets yet</span>
        )}
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-neutral-500">Nothing logged for this lift.</p>
      ) : (
        <>
          <Sparkline values={rows.map((r) => r.e1rm)} />
          <HistoryTable rows={rows} />
        </>
      )}
    </Card>
  );
}

export function StrengthProgress({ workouts }: { workouts: Workout[] }) {
  const goalLifts = STRENGTH_GOALS.map((g) => g.lift);
  const extras = loggedLiftNames(workouts).filter((n) => !goalLifts.includes(n));
  const all = [...goalLifts, ...extras];

  return (
    <div className="space-y-6">
      <section>
        <SectionTitle>Strength progress</SectionTitle>
        <div className="space-y-3">
          {all.map((name) => (
            <LiftSection key={name} workouts={workouts} name={name} />
          ))}
        </div>
      </section>
    </div>
  );
}
