import type { Card } from "./srs";

export const NEW_PER_DAY = 6;

/**
 * How many days of the review log the apps load. Every chart looks back at most 35 days, and
 * points come from `scored`, so older reviews stay in the database without being read on every page.
 */
export const LOG_DAYS = 42;

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

export interface StudentRecord {
  cards: Record<string, Card>;
  /** Reviews from the last LOG_DAYS days (or none, where a page doesn't need them). */
  log: LogEntry[];
  /** For all time: cards finished each day that earn points (not self-added), by day number. */
  scored: Record<number, number>;
  doneDays: number[];
  /** Assigned cards left undone on each past day (0 when the review was finished). */
  missed: Record<number, number>;
}
