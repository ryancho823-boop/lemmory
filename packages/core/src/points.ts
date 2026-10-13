import type { StudentRecord } from "./records";

// ── points ──
// Every finished card is worth the same, however many tries it took (review is graded
// on completion). Finishing the day's review adds a bonus that grows with the streak.
export const CARD_POINTS = 10;
export const STREAK_POINTS = 5;
export const STREAK_CAP = 20;
export const streakBonus = (streakLength: number) => STREAK_POINTS * Math.min(streakLength, STREAK_CAP);

/** Points earned from `from` to `to` (inclusive). Self-added cards are extra practice and earn nothing. */
export function pointsBetween(s: StudentRecord, from: number, to: number) {
  const cards = s.log.filter((l) => !l.extra && l.day >= from && l.day <= to).length * CARD_POINTS;
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
