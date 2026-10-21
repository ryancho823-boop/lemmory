// The daily review session: which cards are left today, in what order.
// Only the first attempt each day is reported to the scheduler; misses come back
// until the student gets them right.

import { NEW_PER_DAY, type StudentRecord } from "./records";
import { type Card, isNew } from "./srs";

export interface DaySession {
  day: number;
  /** First-try result for each card attempted today. */
  attempts: Record<string, boolean>;
  confusions: Record<string, string[]>;
  completed: string[];
  newStarted: string[];
  /** Cards that already used their one free "fix the typo" retry today. */
  typoOffered: string[];
  /** The application problem handed out for each card, so answers are checked against it. */
  problems: Record<string, string>;
  /** Every problem shown for each card today, so a card that comes back gets a new one. */
  shown?: Record<string, string[]>;
}

export const emptySession = (day: number): DaySession => ({
  day,
  attempts: {},
  confusions: {},
  completed: [],
  newStarted: [],
  typoOffered: [],
  problems: {},
  shown: {},
});

/** Today's remaining cards: unfinished retries, then due reviews with new cards mixed in. */
export function buildQueue(cards: Record<string, Card>, session: DaySession, today: number) {
  const all = Object.values(cards);
  const pending = Object.keys(session.attempts).filter((id) => !session.completed.includes(id) && cards[id]);
  const due = all
    .filter((c) => !isNew(c) && c.memory.due <= today && !pending.includes(c.formulaId))
    .sort((a, b) => a.memory.due - b.memory.due)
    .map((c) => c.formulaId);
  const room = Math.max(0, NEW_PER_DAY - session.newStarted.length);
  // Assigned homework is introduced first, so cards a student adds on their own can't push it back.
  const fresh = all
    .filter((c) => isNew(c) && !pending.includes(c.formulaId))
    .sort((a, b) => Number(a.source === "self") - Number(b.source === "self") || a.addedDay - b.addedDay)
    .slice(0, room)
    .map((c) => c.formulaId);
  // Interleave new cards among reviews (mixed practice beats blocked practice).
  const out = [...pending, ...due];
  fresh.forEach((id, i) => out.splice(Math.min(out.length, 1 + i * 3), 0, id));
  return out;
}

/** Nothing was scheduled today at all (not "everything is already finished"). */
export function nothingDue(record: StudentRecord, today: number) {
  return (
    !record.doneDays.includes(today) &&
    !record.log.some((l) => l.day === today) &&
    !Object.values(record.cards).some((c) => c.memory.due <= today)
  );
}

/** The day counts as done: the review was finished, or nothing was due. */
export const isDoneToday = (record: StudentRecord, today: number) => record.doneDays.includes(today) || nothingDue(record, today);

export interface DayRow {
  day: number;
  done: boolean;
  missed: number;
}

/**
 * Rows for past days `from`..`to` that don't have one yet: done if nothing was due,
 * otherwise how many assigned cards were left. Settling runs before anything changes a
 * student's cards, so the cards' due dates are still what they were on those days.
 */
export function settleDays(record: StudentRecord, from: number, to: number): DayRow[] {
  const cards = Object.values(record.cards);
  const out: DayRow[] = [];
  for (let d = from; d <= to; d++) {
    if (record.doneDays.includes(d) || d in record.missed) continue;
    const due = cards.filter((c) => c.addedDay <= d && c.memory.due <= d);
    out.push(due.length ? { day: d, done: false, missed: due.filter((c) => c.source === "teacher").length } : { day: d, done: true, missed: 0 });
  }
  return out;
}

/** Fold settled rows into a record (in place). */
export function applyDays(record: StudentRecord, rows: DayRow[]) {
  for (const r of rows) {
    if (r.done && !record.doneDays.includes(r.day)) record.doneDays.push(r.day);
    record.missed[r.day] = r.missed;
  }
  record.doneDays.sort((a, b) => a - b);
}
