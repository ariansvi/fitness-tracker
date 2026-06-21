export type Tab = 'home' | 'log' | 'lifts' | 'weeks';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'log', label: 'Log', icon: '➕' },
  { id: 'lifts', label: 'Lifts', icon: '🏋️' },
  { id: 'weeks', label: 'Weeks', icon: '📅' },
];

export function Nav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-neutral-800 bg-neutral-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-md">
        {TABS.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs transition-colors ${
                isActive ? 'text-emerald-400' : 'text-neutral-500'
              }`}
            >
              <span className="text-lg leading-none">{t.icon}</span>
              {t.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
