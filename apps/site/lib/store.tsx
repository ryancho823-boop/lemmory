"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { type Competition, type Student, pointsBetween, scoredByDay } from "@lemmory/core/analytics";
import { type Assignment, CLASSMATES, type LogEntry, YOU, seedAssignments, simulate } from "./sim";
import { type Card, isNew, newCard, realToday } from "@lemmory/core/srs";
import { type QueueSession, buildQueue as coreBuildQueue, newCards, recordAttempt as recordCore } from "@lemmory/core/session";
import { DEMO_MAX_DAYS } from "./demo";
import { FORMULA_BY_ID } from "./bank";

// Demo persistence: the demo student's data lives in localStorage; classmates are
// re-simulated from the assignments. Swap for an API + database for real classes.

const KEY = "lemmory:v4";

/** The demo keeps only the session fields the queue needs (no server-side problem tracking). */
type Session = QueueSession;

interface State {
  /** The real day this demo was set up. A save from an earlier day starts over (see below). */
  createdOn: number;
  dayOffset: number;
  currentWeek: number;
  assignments: Assignment[];
  cards: Record<string, Card>;
  log: LogEntry[];
  doneDays: number[];
  missed: Record<number, number>;
  competition: Competition;
  session: Session;
  /** Last problem shown per formula, so application mode rotates problems. */
  lastProblem: Record<string, string>;
}

const emptySession = (day: number): Session => ({ day, attempts: {}, confusions: {}, completed: [], newStarted: [] });

function seed(today: number): State {
  const assignments = seedAssignments(today);
  const streakDays = new Set(Array.from({ length: 9 }, (_, i) => today - 1 - i));
  const you = simulate(YOU, assignments, today - 1, { forceDays: streakDays });
  const cards = { ...you.cards };
  for (const a of assignments) if (!cards[a.formulaId]) cards[a.formulaId] = newCard(a.formulaId, "teacher", a.day);
  return {
    createdOn: today,
    dayOffset: 0,
    currentWeek: Math.max(...assignments.map((a) => a.week)),
    assignments,
    cards,
    log: you.log,
    doneDays: you.doneDays,
    missed: you.missed,
    // This week's leaderboard started a few days ago; the teacher can restart it.
    competition: { day: today - 4, baseline: {} },
    session: emptySession(today),
    lastProblem: {},
  };
}

interface Store {
  ready: boolean;
  today: number;
  state: State;
  you: Student;
  classmates: Student[];
  students: Student[];
  doneToday: boolean;
  /** The scheduler has no cards for today, so the day counts as done on its own. */
  nothingDue: boolean;
  buildQueue: () => string[];
  recordAttempt: (formulaId: string, correct: boolean, confusedWith?: string[]) => { promoted: boolean };
  finishSession: () => void;
  addToDeck: (formulaId: string) => void;
  removeFromDeck: (formulaId: string) => void;
  assign: (formulaId: string) => void;
  unassign: (formulaId: string) => void;
  startNextWeek: () => void;
  resetCompetition: () => void;
  setLastProblem: (formulaId: string, problemId: string) => void;
  nextDay: () => void;
  reset: () => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Placeholder until mount: the real date and saved data are only read in the browser.
  const [state, setState] = useState<State>(() => seed(0));
  const [ready, setReady] = useState(false);
  const [baseDay, setBaseDay] = useState(0);

  useEffect(() => {
    const t = realToday();
    try {
      const raw = localStorage.getItem(KEY);
      const saved: State | null = raw ? JSON.parse(raw) : null;
      // A save that mentions a formula no longer in the bank starts over instead of crashing.
      const known = saved && saved.assignments.every((a) => FORMULA_BY_ID[a.formulaId]) && Object.keys(saved.cards).every((id) => FORMULA_BY_ID[id]);
      // A save from an earlier day starts over too: days passed with no reviews, so the student
      // would open behind, with a broken streak and a pile of cards due.
      const fresh = known && saved.createdOn === t;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage after mount
      setState(fresh ? saved : seed(t));
    } catch {
      setState(seed(t));
    }
    setBaseDay(t);
    setReady(true);
  }, []);

  // Keep "today" on the real calendar date, even if the tab stays open past midnight.
  useEffect(() => {
    const sync = () => setBaseDay(realToday());
    const id = setInterval(sync, 60_000);
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state, ready]);

  const today = baseDay + state.dayOffset;
  const session = state.session.day === today ? state.session : emptySession(today);

  const update = useCallback((fn: (s: State, today: number) => State) => {
    setState((s) => {
      const t = realToday() + s.dayOffset;
      return fn(s.session.day === t ? s : { ...s, session: emptySession(t) }, t);
    });
  }, []);

  const classmates = useMemo<Student[]>(
    () =>
      ready
        ? CLASSMATES.map((p) => ({ ...simulate(p, state.assignments, today), id: p.id, name: p.name, isYou: false }))
        : [],
    [ready, state.assignments, today],
  );
  // Nothing was scheduled today at all (not "everything is already finished").
  const nothingDue =
    ready &&
    !state.doneDays.includes(today) &&
    !state.log.some((l) => l.day === today) &&
    !Object.values(state.cards).some((c) => c.memory.due <= today);
  const you = useMemo<Student>(
    () => ({
      id: YOU.id,
      name: YOU.name,
      isYou: true,
      cards: state.cards,
      log: state.log,
      scored: scoredByDay(state.log),
      doneDays: nothingDue && !state.doneDays.includes(today) ? [...state.doneDays, today] : state.doneDays,
      missed: state.missed,
    }),
    [state.cards, state.log, state.doneDays, state.missed, nothingDue, today],
  );
  const students = useMemo(() => [...classmates, you], [classmates, you]);

  // The same queue and attempt rules as the app (packages/core/src/session.ts).
  const buildQueue = useCallback(() => coreBuildQueue(state.cards, session, today), [state.cards, session, today]);

  const recordAttempt = useCallback(
    (formulaId: string, correct: boolean, confusedWith?: string[]) => {
      const card = state.cards[formulaId];
      const promoted = !!card && !!recordCore(session, card, correct, today, confusedWith).done?.promoted;
      update((s, t) => {
        const c = s.cards[formulaId];
        if (!c) return s;
        const { session: next, done } = recordCore(s.session, c, correct, t, confusedWith);
        if (!done) return { ...s, session: next };
        return { ...s, cards: { ...s.cards, [formulaId]: done.card }, log: [...s.log, done.entry], session: next };
      });
      return { promoted };
    },
    [update, state.cards, session, today],
  );

  const finishSession = useCallback(
    () => update((s, t) => (s.doneDays.includes(t) ? s : { ...s, doneDays: [...s.doneDays, t], missed: { ...s.missed, [t]: 0 } })),
    [update],
  );

  const addToDeck = useCallback(
    (id: string) => update((s, t) => (s.cards[id] ? s : { ...s, cards: { ...s.cards, [id]: newCards(Object.values(s.cards), [id], "self", t)[0] } })),
    [update],
  );

  const removeFromDeck = useCallback(
    (id: string) =>
      update((s) => {
        const cards = { ...s.cards };
        delete cards[id];
        return { ...s, cards };
      }),
    [update],
  );

  const assign = useCallback(
    (id: string) =>
      update((s, t) => {
        if (s.assignments.some((a) => a.formulaId === id)) return s;
        const card = s.cards[id];
        return {
          ...s,
          assignments: [...s.assignments, { formulaId: id, week: s.currentWeek, day: t }],
          cards: { ...s.cards, [id]: card ? { ...card, source: "teacher" } : newCards(Object.values(s.cards), [id], "teacher", t)[0] },
        };
      }),
    [update],
  );

  const unassign = useCallback(
    (id: string) =>
      update((s) => {
        const cards = { ...s.cards };
        // Only pull the card if the student never started it.
        if (cards[id]?.source === "teacher" && isNew(cards[id])) delete cards[id];
        return { ...s, assignments: s.assignments.filter((a) => a.formulaId !== id), cards };
      }),
    [update],
  );

  const startNextWeek = useCallback(() => update((s) => ({ ...s, currentWeek: s.currentWeek + 1 })), [update]);
  const setLastProblem = useCallback(
    (formulaId: string, problemId: string) => update((s) => ({ ...s, lastProblem: { ...s.lastProblem, [formulaId]: problemId } })),
    [update],
  );
  const resetCompetition = useCallback(() => {
    // Points already earned today before the reset don't count toward the new week.
    const baseline = Object.fromEntries(students.map((s) => [s.id, pointsBetween(s, today, today)]));
    update((s) => ({ ...s, competition: { day: today, baseline } }));
  }, [students, today, update]);

  const nextDay = useCallback(
    () =>
      setState((s) => {
        if (s.dayOffset >= DEMO_MAX_DAYS) return s;
        const t = realToday() + s.dayOffset;
        // Record how many assigned cards were left undone before the day rolls over.
        const left = s.doneDays.includes(t)
          ? 0
          : Object.values(s.cards).filter((c) => c.source === "teacher" && c.memory.due <= t).length;
        // A day with nothing due counts as done.
        const free = !Object.values(s.cards).some((c) => c.memory.due <= t);
        const doneDays = free && !s.doneDays.includes(t) ? [...s.doneDays, t] : s.doneDays;
        return { ...s, doneDays, missed: { ...s.missed, [t]: left }, dayOffset: s.dayOffset + 1 };
      }),
    [],
  );
  const reset = useCallback(() => setState(seed(realToday())), []);

  const value = useMemo<Store>(
    () => ({
      ready,
      today,
      state: { ...state, session },
      you,
      classmates,
      students,
      doneToday: state.doneDays.includes(today) || nothingDue,
      nothingDue,
      buildQueue,
      recordAttempt,
      finishSession,
      addToDeck,
      removeFromDeck,
      assign,
      unassign,
      startNextWeek,
      resetCompetition,
      setLastProblem,
      nextDay,
      reset,
    }),
    [ready, today, state, session, you, classmates, students, nothingDue, buildQueue, recordAttempt, finishSession, addToDeck, removeFromDeck, assign, unassign, startNextWeek, resetCompetition, setLastProblem, nextDay, reset],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside StoreProvider");
  return s;
}
