// The extra application problems, by topic: each formula has a worked example plus four problems to quiz.
import type { Problem } from "../../types";
import { ALGEBRA_PROBLEMS } from "./algebra";
import { NUMBER_THEORY_PROBLEMS } from "./numberTheory";
import { COMBINATORICS_PROBLEMS } from "./combinatorics";
import { PROBABILITY_PROBLEMS } from "./probability";

export const MORE_PROBLEMS: Record<string, Omit<Problem, "uses">[]> = {
  ...ALGEBRA_PROBLEMS,
  ...NUMBER_THEORY_PROBLEMS,
  ...COMBINATORICS_PROBLEMS,
  ...PROBABILITY_PROBLEMS,
};
