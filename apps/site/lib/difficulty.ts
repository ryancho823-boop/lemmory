// A rough "how hard is this formula" ranking for sorting the bank: mostly the contest
// level where it first shows up, nudged by how much there is to remember.

import type { Formula, Level } from "@lemmory/core/content/types";

const LEVEL_RANK: Record<Level, number> = { "AMC 8": 0, "AMC 10": 1, "AMC 12": 2, Calculus: 2, AIME: 3 };

function complexity(f: Formula) {
  // Length of what has to be recalled, plus a bump for each extra blank.
  const symbols = f.recall.reduce((n, b) => n + b.answer.replace(/\\[a-z]+|[{}\s]/gi, "x").length, 0);
  return Math.min(1, symbols / 60) + (f.recall.length - 1) * 0.15;
}

/** A score per formula, and a tier from 1 (easiest) to 5 (hardest) by quintile across `formulas`. */
export function rankDifficulty(formulas: Formula[]) {
  const score = new Map(formulas.map((f) => [f.id, LEVEL_RANK[f.level] + Math.min(0.95, complexity(f))]));
  const sorted = [...score.values()].sort((a, b) => a - b);
  return Object.fromEntries(
    formulas.map((f) => {
      const s = score.get(f.id)!;
      const rank = sorted.findIndex((x) => x >= s);
      return [f.id, { score: s, tier: Math.min(5, 1 + Math.floor((rank / sorted.length) * 5)) }];
    }),
  );
}
