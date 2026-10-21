// Handing out application problems, from the full formula bank (server only). Prompts and
// answer checking live in check.ts, which the demo uses with its own slice of the bank.

import { FORMULA_BY_ID, type Formula } from "./formulas";
import { setupApply } from "./practice";
import type { ApplyPrompt } from "./check";

export * from "./check";

/** A fresh problem (not `lastProblemId`) with look-alike distractors from the student's deck and topic. */
export function applyPrompt(f: Formula, avoid: string[], deck: string[]): ApplyPrompt {
  const { problem, options } = setupApply(f, avoid, deck);
  return {
    kind: "apply",
    formulaId: f.id,
    problemId: problem.id,
    text: problem.text,
    needs: problem.uses.length,
    options: options.map((id) => ({ id, name: FORMULA_BY_ID[id].name })),
    figure: problem.figure,
  };
}
