// Server-side card checking. The browser only ever gets the prompt; answers come back
// after the attempt is graded and recorded, so they can't be read ahead of time.

import { FORMULA_BY_ID, type Figure, type Formula, type Problem, type Topic } from "./formulas";
import { findTypo, gradeNumber, gradeRecall } from "./grade";
import { setupApply } from "./practice";

export interface RecallPrompt {
  kind: "recall";
  formulaId: string;
  name: string;
  topic: Topic;
  setup: string;
  blanks: { lhs: string }[];
  figure?: Figure;
}

export interface ApplyPrompt {
  kind: "apply";
  formulaId: string;
  problemId: string;
  text: string;
  /** How many formulas the problem needs. */
  needs: number;
  options: { id: string; name: string }[];
  figure?: Figure;
}

export type Prompt = RecallPrompt | ApplyPrompt;

export type RecallResult =
  | { status: "typo"; typos: boolean[] }
  | { status: "graded"; results: boolean[]; answers: string[]; statement: string };

export interface PickResult {
  right: boolean;
  uses: string[];
  /** Statements for the needed formulas and any wrong picks, to show after checking. */
  statements: Record<string, string>;
  whenToUse: string;
}

export interface SolveResult {
  right: boolean;
  answer: string;
  solution: string;
}

/** What happened to the card after a graded attempt. */
export interface Outcome {
  formulaName: string;
  /** The card graduated from recall to application mode. */
  promoted: boolean;
  /** That was the last card today. */
  finished: boolean;
}

export function recallPrompt(f: Formula): RecallPrompt {
  return { kind: "recall", formulaId: f.id, name: f.name, topic: f.topic, setup: f.setup, blanks: f.recall.map((b) => ({ lhs: b.lhs })), figure: f.figure };
}

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

export const problemOf = (f: Formula, problemId: string) => f.problems.find((p) => p.id === problemId) ?? null;

/**
 * Grade typed recall answers. While `allowTypo` is set, a wrong answer that is one letter
 * away from right gets a hint instead of a grade (one free retry per card per day).
 */
export function checkRecall(f: Formula, inputs: string[], allowTypo: boolean): RecallResult {
  const results = f.recall.map((b, i) => gradeRecall(b, inputs[i] ?? ""));
  if (allowTypo && !results.every(Boolean)) {
    const typos = f.recall.map((b, i) => !results[i] && findTypo(b, inputs[i] ?? "") !== null);
    if (typos.some(Boolean)) return { status: "typo", typos };
  }
  return { status: "graded", results, answers: f.recall.map((b) => b.answer), statement: f.statement };
}

export function checkPick(problem: Problem, picked: string[]): PickResult {
  const want = new Set(problem.uses);
  const right = picked.length === want.size && picked.every((id) => want.has(id));
  const shown = [...new Set([...problem.uses, ...picked])].filter((id) => FORMULA_BY_ID[id]);
  return {
    right,
    uses: problem.uses,
    statements: Object.fromEntries(shown.map((id) => [id, FORMULA_BY_ID[id].statement])),
    whenToUse: FORMULA_BY_ID[problem.uses[0]].whenToUse,
  };
}

export function checkSolve(problem: Problem, input: string): SolveResult {
  return { right: gradeNumber(problem.answer, input), answer: problem.answer, solution: problem.solution };
}

/** Formulas picked that the problem didn't need (recorded as mix-ups). */
export const wrongPicks = (problem: Problem, picked: string[]) => picked.filter((id) => !problem.uses.includes(id));
