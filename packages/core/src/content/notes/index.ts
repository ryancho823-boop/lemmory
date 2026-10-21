import { ALGEBRA_NOTES } from "./algebra";
import { CALCULUS_NOTES } from "./calculus";
import { COMBINATORICS_NOTES } from "./combinatorics";
import { EXTRA_NOTES } from "./extra";
import { GEOMETRY_NOTES } from "./geometry";
import { NUMBER_THEORY_NOTES } from "./numberTheory";
import { PROBABILITY_NOTES } from "./probability";
import { TRIG_NOTES } from "./trig";
import type { Notes } from "./types";
import { ALGEBRA_V2_NOTES } from "./v2Algebra";
import { NUMBER_THEORY_V2_NOTES } from "./v2NumberTheory";
import { COMBINATORICS_V2_NOTES } from "./v2Combinatorics";
import { PROBABILITY_V2_NOTES } from "./v2Probability";
import { TRIG_V2_NOTES } from "./v2Trig";
import { GEOMETRY_V2_NOTES } from "./v2Geometry";

export type { Note } from "./types";

export const NOTES: Notes = {
  ...ALGEBRA_NOTES,
  ...GEOMETRY_NOTES,
  ...TRIG_NOTES,
  ...NUMBER_THEORY_NOTES,
  ...COMBINATORICS_NOTES,
  ...PROBABILITY_NOTES,
  ...CALCULUS_NOTES,
  ...EXTRA_NOTES,
  ...ALGEBRA_V2_NOTES,
  ...NUMBER_THEORY_V2_NOTES,
  ...COMBINATORICS_V2_NOTES,
  ...PROBABILITY_V2_NOTES,
  ...TRIG_V2_NOTES,
  ...GEOMETRY_V2_NOTES,
};
