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
import { ALGEBRA_3 } from "./content/extra/algebra";
import { GEOMETRY_3 } from "./content/extra/geometry";
import { TRIG_3 } from "./content/extra/trig";
import type { Formula } from "./content/types";

export * from "./content/types";

export const FORMULAS: Formula[] = [
  ...ALGEBRA,
  ...ALGEBRA_2,
  ...ALGEBRA_3,
  ...GEOMETRY,
  ...GEOMETRY_2,
  ...GEOMETRY_3,
  ...TRIG,
  ...TRIG_2,
  ...TRIG_3,
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
