// Card prompts and answer checking, with no formula bank of its own: whatever needs other
// formulas' names or statements is passed the app's bank (the full one, or the demo's slice).
// In the apps this runs on the server, so answers come back only after an attempt is recorded.

import type { Figure, Formula, Problem, Topic } from "./content/types";
import { findTypo, gradeNumber, gradeRecall } from "./grade";

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

export function checkPick(problem: Problem, picked: string[], formulaById: Record<string, Formula>): PickResult {
  const want = new Set(problem.uses);
  const right = picked.length === want.size && picked.every((id) => want.has(id));
  const shown = [...new Set([...problem.uses, ...picked])].filter((id) => formulaById[id]);
  return {
    right,
    uses: problem.uses,
    statements: Object.fromEntries(shown.map((id) => [id, formulaById[id].statement])),
    whenToUse: formulaById[problem.uses[0]].whenToUse,
  };
}

export function checkSolve(problem: Problem, input: string): SolveResult {
  return { right: gradeNumber(problem.answer, input), answer: problem.answer, solution: problem.solution };
}

/** Formulas picked that the problem didn't need (recorded as mix-ups). */
export const wrongPicks = (problem: Problem, picked: string[]) => picked.filter((id) => !problem.uses.includes(id));
