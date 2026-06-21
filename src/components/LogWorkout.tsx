import { useState } from 'react';
import type { LiftEntry, Workout, WorkoutType } from '../types';
import { WORKOUT_TYPES } from '../types';
import { STRENGTH_GOALS } from '../data/goals';
import { prettyDate, todayISO } from '../lib/calc';
import { newId } from '../lib/storage';
import { Card, SectionTitle, TypeBadge } from './ui';

const inputCls =
  'w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100 placeholder-neutral-500 focus:border-emerald-500 focus:outline-none';

const labelCls = 'mb-1 block text-xs font-medium text-neutral-400';

interface DraftLift {
  name: string;
  weight: string;
  reps: string;
  sets: string;
  rpe: string;
}

const emptyLift: DraftLift = { name: 'Back Squat', weight: '', reps: '', sets: '', rpe: '' };

export function LogWorkout({
  workouts,
  addWorkout,
  deleteWorkout,
  onSaved,
}: {
  workouts: Workout[];
  addWorkout: (w: Workout) => void;
  deleteWorkout: (id: string) => void;
  onSaved: () => void;
}) {
  const [date, setDate] = useState(todayISO());
  const [type, setType] = useState<WorkoutType>('CrossFit');
  const [notes, setNotes] = useState('');
  const [lifts, setLifts] = useState<LiftEntry[]>([]);
  const [draft, setDraft] = useState<DraftLift>(emptyLift);

  const addDraftLift = () => {
    const weightKg = parseFloat(draft.weight);
    const reps = parseInt(draft.reps, 10);
    const sets = parseInt(draft.sets, 10) || 1;
    const rpe = draft.rpe ? parseFloat(draft.rpe) : undefined;
    if (!draft.name.trim() || !Number.isFinite(weightKg) || !Number.isFinite(reps)) return;
    setLifts((prev) => [
      ...prev,
      { id: newId(), name: draft.name.trim(), weightKg, reps, sets, rpe },
    ]);
    setDraft({ ...emptyLift, name: draft.name });
  };

  const removeLift = (id: string) => setLifts((prev) => prev.filter((l) => l.id !== id));

  const save = () => {
    if (!date) return;
    const workout: Workout = {
      id: newId(),
      date,
      type,
      notes: notes.trim() || undefined,
      lifts: type === 'Strength' ? lifts : [],
    };
    addWorkout(workout);
    setNotes('');
    setLifts([]);
    setDraft(emptyLift);
    onSaved();
  };

  const recent = workouts.slice(0, 8);

  return (
    <div className="space-y-6">
      <section>
        <SectionTitle>Log a workout</SectionTitle>
        <Card className="space-y-4">
          <div className="flex gap-3">
            <div className="min-w-0 flex-1">
              <label className={labelCls} htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="min-w-0 flex-1">
              <label className={labelCls} htmlFor="type">Type</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as WorkoutType)}
                className={inputCls}
              >
                {WORKOUT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {type === 'Strength' && (
            <div className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-950/50 p-3">
              <p className="text-xs font-medium text-neutral-400">Lifts</p>

              {lifts.length > 0 && (
                <ul className="space-y-1">
                  {lifts.map((l) => (
                    <li
                      key={l.id}
                      className="flex items-center justify-between rounded-lg bg-neutral-800 px-3 py-1.5 text-sm"
                    >
                      <span className="text-neutral-200">
                        {l.name} — {l.weightKg} kg × {l.reps} × {l.sets}
                        {l.rpe ? ` @ RPE ${l.rpe}` : ''}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeLift(l.id)}
                        className="text-neutral-500 hover:text-red-400"
                        aria-label="Remove lift"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <input
                list="lift-names"
                placeholder="Lift name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className={inputCls}
              />
              <datalist id="lift-names">
                {STRENGTH_GOALS.map((g) => (
                  <option key={g.lift} value={g.lift} />
                ))}
              </datalist>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="Weight (kg)"
                  value={draft.weight}
                  onChange={(e) => setDraft({ ...draft, weight: e.target.value })}
                  className={inputCls}
                />
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Reps"
                  value={draft.reps}
                  onChange={(e) => setDraft({ ...draft, reps: e.target.value })}
                  className={inputCls}
                />
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Sets"
                  value={draft.sets}
                  onChange={(e) => setDraft({ ...draft, sets: e.target.value })}
                  className={inputCls}
                />
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="RPE (optional)"
                  value={draft.rpe}
                  onChange={(e) => setDraft({ ...draft, rpe: e.target.value })}
                  className={inputCls}
                />
              </div>
              <button
                type="button"
                onClick={addDraftLift}
                className="w-full rounded-xl border border-neutral-700 py-2 text-sm font-medium text-neutral-200 hover:border-emerald-500 hover:text-emerald-400"
              >
                + Add lift
              </button>
            </div>
          )}

          <div>
            <label className={labelCls} htmlFor="notes">Notes (optional)</label>
            <textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it feel?"
              className={inputCls}
            />
          </div>

          <button
            type="button"
            onClick={save}
            className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-neutral-950 hover:bg-emerald-400"
          >
            Save workout
          </button>
        </Card>
      </section>

      <section>
        <SectionTitle>Recent</SectionTitle>
        {recent.length === 0 ? (
          <p className="text-sm text-neutral-500">No workouts logged yet.</p>
        ) : (
          <ul className="space-y-2">
            {recent.map((w) => (
              <li
                key={w.id}
                className="flex items-start justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <TypeBadge type={w.type} />
                    <span className="text-sm text-neutral-300">{prettyDate(w.date)}</span>
                  </div>
                  {w.lifts.length > 0 && (
                    <p className="mt-1 text-xs text-neutral-400">
                      {w.lifts.map((l) => `${l.name} ${l.weightKg}×${l.reps}`).join(' · ')}
                    </p>
                  )}
                  {w.notes && <p className="mt-1 truncate text-xs text-neutral-500">{w.notes}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => deleteWorkout(w.id)}
                  className="ml-2 shrink-0 text-neutral-600 hover:text-red-400"
                  aria-label="Delete workout"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
