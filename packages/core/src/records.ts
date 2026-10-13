import type { Card } from "./srs";

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

export interface StudentRecord {
  cards: Record<string, Card>;
  log: LogEntry[];
  doneDays: number[];
  /** Assigned cards left undone on each past day (0 when the review was finished). */
  missed: Record<number, number>;
}
