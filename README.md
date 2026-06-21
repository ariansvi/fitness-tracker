# Show Up — Fitness Tracker

A simple, mobile-first personal fitness tracker. Consistency first, strength second.
The headline question it answers every week: **"Did I show up this week?"**

No backend, no login. All data lives in the browser via `localStorage`. Units are kg.

## What it does

- **Dashboard** — the "Did I show up this week?" hero, current week streak, the three
  main strength goals with current best set, progress %, and estimated 1RM.
- **Log** — add a workout (CrossFit / Run / Strength / Other) with optional notes. For
  strength, log lift name, weight (kg), reps, sets, and optional RPE.
- **Lifts** — per-lift history table with the best set highlighted, Epley estimated 1RM,
  and a simple trend line over time.
- **Weeks** — calendar-style weekly view. A week is "successful" with 2+ CrossFit
  sessions. Shows totals for this week and this month.

## Goals (baked in)

| Lift        | Target     | Deadline   |
| ----------- | ---------- | ---------- |
| Back Squat  | 100 kg × 5 | 2026-12-31 |
| Bench Press | 80 kg × 5  | 2026-12-31 |
| Deadlift    | 120 kg × 5 | 2026-12-31 |

Process goal: **2+ CrossFit sessions per week.**

Edit these in [`src/data/goals.ts`](src/data/goals.ts).

## Stack

React + TypeScript + Vite + Tailwind CSS v4. No runtime dependencies beyond that.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build
npm run lint     # eslint
```

## Notes

- Estimated 1RM uses the Epley formula: `1RM = weight × (1 + reps / 30)`.
- Weeks start on Monday.
- Progress toward a goal is measured by estimated 1RM (current best ÷ target).
- Data is stored under the `fitness-tracker:workouts:v1` key in `localStorage`.
