// A rough "how hard is this formula" ranking for sorting the bank: mostly the contest
// level where it first shows up, nudged by how much there is to remember.

import { FORMULAS, type Formula, type Level } from "./formulas";

const LEVEL_RANK: Record<Level, number> = { "AMC 8": 0, "AMC 10": 1, "AMC 12": 2, Calculus: 2, AIME: 3 };

function complexity(f: Formula) {
  // Length of what has to be recalled, plus a bump for each extra blank.
  const symbols = f.recall.reduce((n, b) => n + b.answer.replace(/\\[a-z]+|[{}\s]/gi, "x").length, 0);
  return Math.min(1, symbols / 60) + (f.recall.length - 1) * 0.15;
}

const SCORE = new Map(FORMULAS.map((f) => [f.id, LEVEL_RANK[f.level] + Math.min(0.95, complexity(f))]));
const SORTED = [...SCORE.values()].sort((a, b) => a - b);

export const difficultyScore = (f: Formula) => SCORE.get(f.id) ?? 0;

/** 1 (easiest) to 5 (hardest), by quintile across the whole bank. */
export function difficultyTier(f: Formula) {
  const rank = SORTED.findIndex((s) => s >= difficultyScore(f));
  return Math.min(5, 1 + Math.floor((rank / SORTED.length) * 5));
}

export const byDifficulty = (a: Formula, b: Formula) => difficultyScore(a) - difficultyScore(b);
