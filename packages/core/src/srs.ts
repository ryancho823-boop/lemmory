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
/**
 * Missing this many application reviews in a row sends a card back to recall. One miss can be a
 * slip; two in a row, on different days, mean the formula itself has gone, so problems won't help
 * until it's remembered again.
 */
export const DEMOTE_AFTER = 2;

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
  /** Application reviews missed in a row (older saves don't have it). */
  misses?: number;
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
  // FSRS keeps its four answer buttons at least a day apart, which pushes a weak card's "Good" out
  // to 3 days even when its memory only lasts 1. There's one button here, so the next review comes
  // when recall is due to reach 90%: at the stability. New cards haven't been through this yet.
  const days = c.state === 0 ? 0 : Math.max(1, Math.round(c.stability));
  return {
    stability: c.stability,
    difficulty: c.difficulty,
    state: c.state,
    reps: c.reps,
    lapses: c.lapses,
    scheduledDays: days,
    due: days ? day + days : toDay(c.due),
    last: day,
  };
}

function freshMemory(day: number): Memory {
  const c = createEmptyCard(toDate(day));
  return { ...fromFsrs(c, day), due: day, last: null };
}

/** A card that joins the deck on `day` and is first shown on `introduceOn` (see newCards in session.ts). */
export function newCard(formulaId: string, source: Card["source"], day: number, introduceOn = day): Card {
  return { formulaId, source, stage: "recall", memory: { ...freshMemory(day), due: introduceOn }, addedDay: day };
}

export function review(card: Card, firstTryCorrect: boolean, day: number): { card: Card; promoted: boolean; demoted: boolean } {
  const next = scheduler.next(toFsrs(card.memory), toDate(day), firstTryCorrect ? Rating.Good : Rating.Again);
  const memory = fromFsrs(next.card, day);
  // Each stage has its own memory model, so a card that changes stage starts over (still a reviewed card).
  const restart = { ...freshMemory(day), due: day + 1, last: day };
  if (card.stage === "recall") {
    // Knows it cold: start training recognition.
    if (memory.stability >= PROMOTE_STABILITY) return { card: { ...card, stage: "apply", memory: restart }, promoted: true, demoted: false };
    return { card: { ...card, memory }, promoted: false, demoted: false };
  }
  const misses = firstTryCorrect ? 0 : (card.memory.misses ?? 0) + 1;
  // Struggling: back to typing the formula from memory. It returns to problems the usual way.
  if (misses >= DEMOTE_AFTER) return { card: { ...card, stage: "recall", memory: restart }, promoted: false, demoted: true };
  return { card: { ...card, memory: { ...memory, misses } }, promoted: false, demoted: false };
}

/** Predicted probability the student remembers the card on `day` (null if never reviewed). */
export function retrievability(card: Card, day: number): number | null {
  if (card.memory.last === null) return null;
  return scheduler.get_retrievability(toFsrs(card.memory), toDate(day), false);
}

/** Never reviewed. A card that graduated to application was reviewed (older saves left its `last` empty). */
export const isNew = (c: Card) => c.stage === "recall" && c.memory.last === null;
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
