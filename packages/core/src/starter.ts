// A first deck for a student who signs up on their own, so day one isn't an empty screen.

import { FORMULAS } from "./formulas";
import { rankDifficulty } from "./difficulty";

export const STARTER_LEVELS = ["AMC 8", "AMC 10", "AMC 12", "AIME"] as const;
export type StarterLevel = (typeof STARTER_LEVELS)[number];

const RANK = rankDifficulty(FORMULAS);
const easiestFirst = <T extends { id: string }>(fs: T[]) => [...fs].sort((a, b) => RANK[a.id].score - RANK[b.id].score);

/**
 * Every formula at that contest's level (six new cards come in each day, so a big deck is fine).
 * The AMC 8 has only a handful of its own, so its deck adds the 20 easiest AMC 10 ones.
 */
export function starterDeck(level: StarterLevel): string[] {
  const own = FORMULAS.filter((f) => f.level === level);
  const extra = level === "AMC 8" ? easiestFirst(FORMULAS.filter((f) => f.level === "AMC 10")).slice(0, 20) : [];
  return [...own, ...extra].map((f) => f.id);
}
