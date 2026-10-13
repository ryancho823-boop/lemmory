import type { Formula, Level, Topic } from "@lemmory/core/content/types";
import type { Notes } from "@lemmory/core/content/notes/types";

/**
 * The formulas the public demo includes: the simulated class's four weeks of homework
 * plus a few more for the teacher to assign. Picked so look-alikes (Heron vs. area with
 * sine, Power of a Point vs. inscribed angles) are both present and mix-ups show up.
 * Everything else appears in the bank as a locked name.
 */
export const DEMO_IDS = [
  // Algebra
  "quadratic-formula",
  "vieta-quadratic",
  "arithmetic-series",
  "geometric-series",
  "sfft",
  // Geometry
  "pythagorean",
  "heron",
  "inscribed-angle",
  "power-of-a-point",
  // Trigonometry
  "special-angles",
  "law-of-cosines",
  "area-sine",
  // Number theory
  "num-divisors",
  "gcd-lcm",
  "legendre",
  "chicken-mcnugget",
  // Combinatorics
  "perms-combs",
  "stars-and-bars",
  "pie",
  // Probability
  "complement",
  "expected-value",
  // Calculus
  "power-rule",
];

/** Application-mode problems per formula in the demo. */
export const DEMO_PROBLEMS_PER_FORMULA = 2;

/** How many days "Skip to tomorrow" can go past the real date. */
export const DEMO_MAX_DAYS = 30;

export interface LockedFormula {
  id: string;
  name: string;
  topic: Topic;
  level: Level;
}

export interface DemoBank {
  /** Formulas in the full bank. */
  total: number;
  formulas: Formula[];
  notes: Notes;
  /** Names only: shown in the bank so visitors see the full range. */
  locked: LockedFormula[];
  difficulty: Record<string, { score: number; tier: number }>;
}
