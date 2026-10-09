'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Workout } from '@/types/workout';

type Store = {
  plan: Workout[];
  saved: Workout[];
  done: number[];
  ready: boolean;
  toast: string;
  addPlan: (workout: Workout) => boolean;
  save: (workout: Workout) => void;
  removePlan: (id: number) => void;
  removeSaved: (id: number) => void;
  toggleDone: (id: number) => void;
  notify: (message: string) => void;
};

const StoreContext = createContext<Store | null>(null);
const PLAN_KEY = 'fitlog-plan';
const SAVED_KEY = 'fitlog-saved';
const DONE_KEY = 'fitlog-done';

function readArray<T>(key: string): T[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(key) ?? '[]');
    return Array.isArray(value) ? value as T[] : [];
  } catch {
    try { window.localStorage.removeItem(key); } catch { /* Storage may be disabled. */ }
    return [];
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<Workout[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setPlan(readArray<Workout>(PLAN_KEY).filter((w) => w && Number.isFinite(w.id)).slice(0, 5));
    setSaved(readArray<Workout>(SAVED_KEY).filter((w) => w && Number.isFinite(w.id)));
    setDone(readArray<number>(DONE_KEY).filter(Number.isFinite));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
      window.localStorage.setItem(DONE_KEY, JSON.stringify(done));
    } catch {
      // The app remains usable in private browsing or when storage is unavailable.
    }
  }, [plan, saved, done, ready]);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2600);
  }, []);

  const addPlan = useCallback((workout: Workout) => {
    if (plan.some((item) => item.id === workout.id)) {
      notify('Already in today’s plan');
      return false;
    }
    if (plan.length >= 5) {
      notify('Your plan is full — five workouts max');
      return false;
    }
    setPlan((current) => current.some((item) => item.id === workout.id || current.length >= 5) ? current : [...current, workout]);
    notify('Added to today’s plan');
    return true;
  }, [plan, notify]);

  const save = useCallback((workout: Workout) => {
    if (saved.some((item) => item.id === workout.id)) {
      notify('Already saved for later');
      return;
    }
    setSaved((current) => current.some((item) => item.id === workout.id) ? current : [...current, workout]);
    notify('Saved for later');
  }, [saved, notify]);

  const removePlan = useCallback((id: number) => {
    setPlan((current) => current.filter((workout) => workout.id !== id));
    setDone((current) => current.filter((item) => item !== id));
    notify('Workout removed from plan');
  }, [notify]);

  const removeSaved = useCallback((id: number) => {
    setSaved((current) => current.filter((workout) => workout.id !== id));
    notify('Workout removed from saved');
  }, [notify]);

  const toggleDone = useCallback((id: number) => {
    const wasDone = done.includes(id);
    setDone((current) => wasDone ? current.filter((item) => item !== id) : [...current, id]);
    notify(wasDone ? 'Workout marked as not done' : 'Workout marked as done');
  }, [done, notify]);

  const value = useMemo(() => ({ plan, saved, done, ready, toast, addPlan, save, removePlan, removeSaved, toggleDone, notify }), [plan, saved, done, ready, toast, addPlan, save, removePlan, removeSaved, toggleDone, notify]);

  return (
    <StoreContext.Provider value={value}>
      {children}
      {toast && <div className="toast" role="status" aria-live="polite"><span className="toast-dot" />{toast}</div>}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useStore must be used inside StoreProvider');
  return value;
}
