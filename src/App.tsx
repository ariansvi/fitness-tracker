import { useState } from 'react';
import { Nav, type Tab } from './components/Nav';
import { Dashboard } from './components/Dashboard';
import { LogWorkout } from './components/LogWorkout';
import { StrengthProgress } from './components/StrengthProgress';
import { WeeklyView } from './components/WeeklyView';
import { useWorkouts } from './lib/useWorkouts';

const TITLES: Record<Tab, string> = {
  home: 'Show Up',
  log: 'Log Workout',
  lifts: 'Strength',
  weeks: 'Consistency',
};

function App() {
  const [tab, setTab] = useState<Tab>('home');
  const { workouts, addWorkout, deleteWorkout } = useWorkouts();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
        <div className="mx-auto max-w-md px-4 py-3">
          <h1 className="text-lg font-bold tracking-tight">{TITLES[tab]}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pb-24 pt-4">
        {tab === 'home' && <Dashboard workouts={workouts} />}
        {tab === 'log' && (
          <LogWorkout
            workouts={workouts}
            addWorkout={addWorkout}
            deleteWorkout={deleteWorkout}
            onSaved={() => setTab('home')}
          />
        )}
        {tab === 'lifts' && <StrengthProgress workouts={workouts} />}
        {tab === 'weeks' && <WeeklyView workouts={workouts} />}
      </main>

      <Nav active={tab} onChange={setTab} />
    </div>
  );
}

export default App;
