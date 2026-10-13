// Scheduling uses FSRS (Free Spaced Repetition Scheduler), the open-source algorithm
// Anki adopted in 23.10, via the official ts-fsrs package with its default parameters
// (fit on Anki's large review dataset). FSRS models each card's
//   - stability: days until recall probability drops to 90%
//   - difficulty: how hard the card is for this student
// and schedules the next review when predicted recall falls to the target retention.
//
// Only the FIRST attempt in a session is reported to FSRS. Students still retry until
// they get it right, because the daily session is graded on completion.

import { type Card as FsrsCard, Rating, createEmptyCard, fsrs, generatorParameters } from "ts-fsrs";

export type Stage = "recall" | "apply";

/** Target probability of remembering a card when it comes due. */
export const TARGET_RETENTION = 0.9;
/** A recall card graduates to application once FSRS predicts 90% recall after this many days. */
export const PROMOTE_STABILITY = 10;
/** An application card counts as mastered at this stability. */
export const MASTERED_STABILITY = 30;

const scheduler = fsrs(
  generatorParameters({ request_retention: TARGET_RETENTION, enable_fuzz: false, enable_short_term: false }),
);

const DAY = 86_400_000;
const toDate = (day: number) => new Date(day * DAY + DAY / 2);
const toDay = (d: Date) => Math.floor(d.getTime() / DAY);

/** FSRS memory state, stored with day numbers so it serializes cleanly. */
export interface Memory {
  stability: number;
  difficulty: number;
  state: number;
  reps: number;
  lapses: number;
  scheduledDays: number;
  due: number;
  last: number | null;
}

export interface Card {
  formulaId: string;
  source: "teacher" | "self";
  stage: Stage;
  memory: Memory;
  addedDay: number;
}

function toFsrs(m: Memory): FsrsCard {
  return {
    due: toDate(m.due),
    stability: m.stability,
    difficulty: m.difficulty,
    elapsed_days: 0,
    scheduled_days: m.scheduledDays,
    learning_steps: 0,
    reps: m.reps,
    lapses: m.lapses,
    state: m.state,
    last_review: m.last === null ? undefined : toDate(m.last),
  };
}

function fromFsrs(c: FsrsCard, day: number): Memory {
  return {
    stability: c.stability,
    difficulty: c.difficulty,
    state: c.state,
    reps: c.reps,
    lapses: c.lapses,
    scheduledDays: c.scheduled_days,
    due: Math.max(day + 1, toDay(c.due)),
    last: day,
  };
}

function freshMemory(day: number): Memory {
  const c = createEmptyCard(toDate(day));
  return { ...fromFsrs(c, day), due: day, last: null };
}

export function newCard(formulaId: string, source: Card["source"], day: number): Card {
  return { formulaId, source, stage: "recall", memory: freshMemory(day), addedDay: day };
}

export function review(card: Card, firstTryCorrect: boolean, day: number): { card: Card; promoted: boolean } {
  const next = scheduler.next(toFsrs(card.memory), toDate(day), firstTryCorrect ? Rating.Good : Rating.Again);
  const memory = fromFsrs(next.card, day);
  if (card.stage === "recall" && memory.stability >= PROMOTE_STABILITY) {
    // Knows it cold: start training recognition, with its own fresh memory model.
    return { card: { ...card, stage: "apply", memory: { ...freshMemory(day), due: day + 1 } }, promoted: true };
  }
  return { card: { ...card, memory }, promoted: false };
}

/** Predicted probability the student remembers the card on `day` (null if never reviewed). */
export function retrievability(card: Card, day: number): number | null {
  if (card.memory.last === null) return null;
  return scheduler.get_retrievability(toFsrs(card.memory), toDate(day), false);
}

export const isNew = (c: Card) => c.memory.last === null;
export const isDue = (c: Card, day: number) => c.memory.due <= day;
export const isMastered = (c: Card) => c.stage === "apply" && c.memory.stability >= MASTERED_STABILITY;

export function realToday() {
  const now = new Date();
  return Math.floor((now.getTime() - now.getTimezoneOffset() * 60_000) / DAY);
}

/**
 * 0..1 progress toward mastery: the recall stage fills the first half (up to promotion),
 * the application stage the second half (up to mastered).
 */
export function mastery(c: Card) {
  if (isNew(c)) return 0;
  if (c.stage === "recall") return 0.5 * Math.min(1, c.memory.stability / PROMOTE_STABILITY);
  return 0.5 + 0.5 * Math.min(1, c.memory.stability / MASTERED_STABILITY);
}
