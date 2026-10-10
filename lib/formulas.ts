// The formula bank. Content lives in lib/content/, one file per topic.
import { ALGEBRA } from "./content/algebra";
import { CALCULUS } from "./content/calculus";
import { COMBINATORICS } from "./content/combinatorics";
import { GEOMETRY } from "./content/geometry";
import { NUMBER_THEORY } from "./content/numberTheory";
import { PROBABILITY } from "./content/probability";
import { TRIG } from "./content/trig";
import { ALGEBRA_2 } from "./content/more/algebra";
import { CALCULUS_2 } from "./content/more/calculus";
import { COMBINATORICS_2 } from "./content/more/combinatorics";
import { GEOMETRY_2 } from "./content/more/geometry";
import { NUMBER_THEORY_2 } from "./content/more/numberTheory";
import { PROBABILITY_2 } from "./content/more/probability";
import { TRIG_2 } from "./content/more/trig";
import type { Formula, Topic } from "./content/types";

export * from "./content/types";

export const FORMULAS: Formula[] = [
  ...ALGEBRA,
  ...ALGEBRA_2,
  ...GEOMETRY,
  ...GEOMETRY_2,
  ...TRIG,
  ...TRIG_2,
  ...NUMBER_THEORY,
  ...NUMBER_THEORY_2,
  ...COMBINATORICS,
  ...COMBINATORICS_2,
  ...PROBABILITY,
  ...PROBABILITY_2,
  ...CALCULUS,
  ...CALCULUS_2,
];

export const FORMULA_BY_ID: Record<string, Formula> = Object.fromEntries(FORMULAS.map((f) => [f.id, f]));

/**
 * Topic identity colors, chosen to be clearly different with normal color vision
 * (every pair passes the palette validator's normal-vision floor). Seven hues can't all
 * stay apart under color blindness, so topic names are always shown next to the color.
 */
export const TOPIC_COLOR: Record<Topic, string> = {
  Algebra: "#2563eb",
  Geometry: "#e11d48",
  Trigonometry: "#16a34a",
  "Number Theory": "#f59e0b",
  Combinatorics: "#9333ea",
  Probability: "#06b6d4",
  Calculus: "#a16207",
};
