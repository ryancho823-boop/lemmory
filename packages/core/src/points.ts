import type { LogEntry, StudentRecord } from "./records";

// ── points ──
// Every finished card is worth the same, however many tries it took (review is graded
// on completion). Finishing the day's review adds a bonus that grows with the streak.
export const CARD_POINTS = 10;
export const STREAK_POINTS = 5;
export const STREAK_CAP = 20;
export const streakBonus = (streakLength: number) => STREAK_POINTS * Math.min(streakLength, STREAK_CAP);

/** Cards that earn points (not self-added) finished each day: a record's `scored`, built from a full log. */
export function scoredByDay(log: LogEntry[]) {
  const out: Record<number, number> = {};
  for (const l of log) if (!l.extra) out[l.day] = (out[l.day] ?? 0) + 1;
  return out;
}

/** Points earned from `from` to `to` (inclusive). Self-added cards are extra practice and earn nothing. */
export function pointsBetween(s: Pick<StudentRecord, "scored" | "doneDays">, from: number, to: number) {
  let n = 0;
  for (const [day, count] of Object.entries(s.scored)) if (Number(day) >= from && Number(day) <= to) n += count;
  const cards = n * CARD_POINTS;
  const bonus = s.doneDays.filter((d) => d >= from && d <= to).reduce((sum, d) => sum + streakBonus(streak(s.doneDays, d)), 0);
  return cards + bonus;
}

export function streak(doneDays: number[], today: number) {
  const done = new Set(doneDays);
  let d = done.has(today) ? today : today - 1;
  let n = 0;
  while (done.has(d)) {
    n++;
    d--;
  }
  return n;
}
