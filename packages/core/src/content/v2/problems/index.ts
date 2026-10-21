// The extra application problems, by topic: each formula has a worked example plus four problems to quiz.
import type { Problem } from "../../types";
import { ALGEBRA_PROBLEMS } from "./algebra";

export const MORE_PROBLEMS: Record<string, Omit<Problem, "uses">[]> = {
  ...ALGEBRA_PROBLEMS,
};
