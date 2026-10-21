import { FORMULAS, type Level, type Topic } from "./formulas";
import { rankDifficulty } from "./difficulty";

/** What the bank list needs about a formula: no recall answers or problems, so it can go to the browser. */
export interface BankEntry {
  id: string;
  name: string;
  topic: Topic;
  level: Level;
  statement: string;
  whenToUse: string;
  /** 1 (easiest) to 5 (hardest). */
  tier: number;
}

const RANK = rankDifficulty(FORMULAS);

/** Every formula, easiest first. */
export const bankEntries = (): BankEntry[] =>
  [...FORMULAS].sort((a, b) => RANK[a.id].score - RANK[b.id].score).map((f) => ({
    id: f.id,
    name: f.name,
    topic: f.topic,
    level: f.level,
    statement: f.statement,
    whenToUse: f.whenToUse,
    tier: RANK[f.id].tier,
  }));
