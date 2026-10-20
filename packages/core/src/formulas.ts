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
import { ALGEBRA_V2 } from "./content/v2/algebra";
import { NUMBER_THEORY_V2 } from "./content/v2/numberTheory";
import { COMBINATORICS_V2 } from "./content/v2/combinatorics";
import { PROBABILITY_V2 } from "./content/v2/probability";
import { TRIG_V2 } from "./content/v2/trig";
import { GEOMETRY_V2 } from "./content/v2/geometry";
import { GEOMETRY_V2B } from "./content/v2/geometry2";
import { FORMULA_FIGURES, PROBLEM_FIGURES } from "./content/v2/figures";
import type { Formula } from "./content/types";

export * from "./content/types";

const ALL: Formula[] = [
  ...ALGEBRA,
  ...ALGEBRA_2,
  ...ALGEBRA_3,
  ...ALGEBRA_V2,
  ...GEOMETRY,
  ...GEOMETRY_2,
  ...GEOMETRY_3,
  ...GEOMETRY_V2,
  ...GEOMETRY_V2B,
  ...TRIG,
  ...TRIG_2,
  ...TRIG_3,
  ...TRIG_V2,
  ...NUMBER_THEORY,
  ...NUMBER_THEORY_2,
  ...NUMBER_THEORY_V2,
  ...COMBINATORICS,
  ...COMBINATORICS_2,
  ...COMBINATORICS_V2,
  ...PROBABILITY,
  ...PROBABILITY_2,
  ...PROBABILITY_V2,
  ...CALCULUS,
  ...CALCULUS_2,
];

// Attach the diagrams drawn for formulas that predate diagrams.
export const FORMULAS: Formula[] = ALL.map((f) => {
  const figure = f.figure ?? FORMULA_FIGURES[f.id];
  const problems = f.problems.map((p) => (p.figure || !PROBLEM_FIGURES[p.id] ? p : { ...p, figure: PROBLEM_FIGURES[p.id] }));
  return figure ? { ...f, figure, problems } : { ...f, problems };
});

export const FORMULA_BY_ID: Record<string, Formula> = Object.fromEntries(FORMULAS.map((f) => [f.id, f]));
