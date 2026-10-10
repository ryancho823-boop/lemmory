// Simulated class. Each classmate runs the real FSRS scheduler day by day; whether
// they answer correctly is drawn from a seeded model (their skill x the formula's
// difficulty x FSRS's predicted recall). So every dashboard number is computed from
// review logs, the same way it would be for real students.

import { FORMULA_BY_ID, FORMULAS, type Level } from "./formulas";
import { type Card, isNew, newCard, retrievability, review } from "./srs";

export const NEW_PER_DAY = 6;

export interface Assignment {
  formulaId: string;
  week: number;
  day: number;
}

export interface LogEntry {
  day: number;
  formulaId: string;
  stage: Card["stage"];
  firstTry: boolean;
  /** Application mode: formulas picked by mistake on the first try. */
  confusedWith?: string[];
  /** A card the student added themselves: extra practice that earns no class points. */
  extra?: boolean;
}

export interface Profile {
  id: string;
  name: string;
  /** 0..1 */
  skill: number;
  /** Chance of doing the daily review. */
  consistency: number;
}

export interface StudentRecord {
  cards: Record<string, Card>;
  log: LogEntry[];
  doneDays: number[];
  /** Assigned cards left undone on each past day (0 when the review was finished). */
  missed: Record<number, number>;
}

export const CLASS_NAME = "Long-Term AMC 10 Course";
export const CONTEST = "AMC 10A · Nov 6";

/** The contest label with a countdown from `today` (a local day number) to the next Nov 6. */
export function contestLabel(today: number) {
  const DAY = 86_400_000;
  const year = new Date(today * DAY).getUTCFullYear();
  let contest = Date.UTC(year, 10, 6) / DAY;
  if (contest < today) contest = Date.UTC(year + 1, 10, 6) / DAY;
  const n = contest - today;
  return `${CONTEST} · ${n === 0 ? "today" : n === 1 ? "tomorrow" : `${n} days away`}`;
}

export const YOU: Profile = { id: "you", name: "Alex Rivera", skill: 0.4, consistency: 0.92 };

export const CLASSMATES: Profile[] = [
  { id: "priya", name: "Priya Shah", skill: 0.85, consistency: 0.97 },
  { id: "aiden", name: "Aiden Lee", skill: 0.7, consistency: 0.9 },
  { id: "sofia", name: "Sofia Martinez", skill: 0.75, consistency: 0.93 },
  { id: "ethan", name: "Ethan Wong", skill: 0.45, consistency: 0.75 },
  { id: "maya", name: "Maya Robinson", skill: 0.6, consistency: 0.88 },
  { id: "kevin", name: "Kevin Zhou", skill: 0.3, consistency: 0.55 },
  { id: "daniel", name: "Daniel Kim", skill: 0.4, consistency: 0.7 },
  { id: "hannah", name: "Hannah Cohen", skill: 0.65, consistency: 0.95 },
  { id: "lucas", name: "Lucas Thompson", skill: 0.5, consistency: 0.82 },
  { id: "grace", name: "Grace Yamamoto", skill: 0.8, consistency: 0.86 },
  { id: "omar", name: "Omar Farouk", skill: 0.35, consistency: 0.62 },
  { id: "chloe", name: "Chloe Nguyen", skill: 0.58, consistency: 0.9 },
];

/** A four-week AMC 10 course. Week w is assigned on day start + 7(w - 1). */
export const SEED_WEEKS: string[][] = [
  ["quadratic-formula", "vieta-quadratic", "arithmetic-series", "geometric-series"],
  ["pythagorean", "heron", "inscribed-angle", "power-of-a-point", "special-angles"],
  ["num-divisors", "gcd-lcm", "legendre", "chicken-mcnugget"],
  ["perms-combs", "stars-and-bars", "pie", "complement"],
];
export const SEED_LENGTH = 21; // days of history before "today"

export function seedAssignments(today: number): Assignment[] {
  const start = today - SEED_LENGTH;
  return SEED_WEEKS.flatMap((ids, w) => ids.map((formulaId) => ({ formulaId, week: w + 1, day: start + w * 7 })));
}

// ── deterministic randomness ──
export function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (x: number, lo = 0.03, hi = 0.98) => Math.min(hi, Math.max(lo, x));

const LEVEL_DIFFICULTY: Record<Level, number> = { "AMC 8": 0.02, "AMC 10": 0.1, "AMC 12": 0.18, AIME: 0.28, Calculus: 0.15 };
export function difficulty(formulaId: string) {
  const f = FORMULA_BY_ID[formulaId];
  return LEVEL_DIFFICULTY[f.level] + ((hash(formulaId) % 100) / 100 - 0.5) * 0.14;
}

/** A plausible wrong pick: a look-alike formula. */
function confusion(formulaId: string, r: () => number) {
  const f = FORMULA_BY_ID[formulaId];
  const pool = f.related.length ? f.related : FORMULAS.filter((x) => x.topic === f.topic && x.id !== f.id).map((x) => x.id);
  return pool[Math.floor(r() * pool.length)];
}

/**
 * Run one student from the first assignment through `until` (inclusive).
 * `forceDays` are days the student definitely reviewed (used to give the demo student a streak).
 */
export function simulate(
  profile: Profile,
  assignments: Assignment[],
  until: number,
  opts: { forceDays?: Set<number>; skipDays?: Set<number> } = {},
): StudentRecord {
  const r = rng(hash(profile.id));
  const cards: Record<string, Card> = {};
  const log: LogEntry[] = [];
  const doneDays: number[] = [];
  const missed: Record<number, number> = {};
  const first = Math.min(...assignments.map((a) => a.day));

  for (let day = first; day <= until; day++) {
    for (const a of assignments) if (a.day <= day && !cards[a.formulaId]) cards[a.formulaId] = newCard(a.formulaId, "teacher", a.day);
    const roll = r();
    const does = opts.forceDays?.has(day) || (!opts.skipDays?.has(day) && roll < profile.consistency);
    const due = Object.values(cards).filter((c) => c.memory.due <= day);
    // The deck is checked every day, but only has cards when the scheduler says so.
    // A day with nothing due counts as done, so it never breaks a streak.
    if (!due.length) {
      doneDays.push(day);
      missed[day] = 0;
      continue;
    }
    if (!does) {
      missed[day] = due.length;
      continue;
    }
    doneDays.push(day);
    missed[day] = 0;

    const reviews = due.filter((c) => !isNew(c));
    const fresh = due.filter(isNew).slice(0, NEW_PER_DAY);
    for (const card of [...reviews, ...fresh]) {
      const d = difficulty(card.formulaId);
      const R = retrievability(card, day);
      let p: number;
      if (R === null) p = clamp(0.62 + 0.3 * profile.skill - d); // first time: learned in class
      else if (card.stage === "recall") p = clamp(Math.pow(R, 1.3 - profile.skill * 0.6) + 0.06 * profile.skill - d * 0.6);
      else p = clamp(R * (0.78 + 0.2 * profile.skill) - d * 0.9);
      const ok = r() < p;
      const entry: LogEntry = { day, formulaId: card.formulaId, stage: card.stage, firstTry: ok };
      if (!ok && card.stage === "apply") entry.confusedWith = [confusion(card.formulaId, r)];
      log.push(entry);
      cards[card.formulaId] = review(card, ok, day).card;
    }
  }
  return { cards, log, doneDays, missed };
}
