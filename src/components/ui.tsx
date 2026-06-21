import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-neutral-800 bg-neutral-900 p-4 ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">
      {children}
    </h2>
  );
}

export function ProgressBar({ value, accent = 'emerald' }: { value: number; accent?: 'emerald' | 'sky' }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  const bar = accent === 'emerald' ? 'bg-emerald-500' : 'bg-sky-500';
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
      <div className={`h-full rounded-full ${bar} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

const TYPE_STYLES: Record<string, string> = {
  CrossFit: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Run: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  Strength: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Other: 'bg-neutral-500/15 text-neutral-300 border-neutral-500/30',
};

export function TypeBadge({ type }: { type: string }) {
  const cls = TYPE_STYLES[type] ?? TYPE_STYLES.Other;
  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}>{type}</span>
  );
}
