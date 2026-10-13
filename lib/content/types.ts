export type Topic =
  | "Algebra"
  | "Geometry"
  | "Trigonometry"
  | "Number Theory"
  | "Combinatorics"
  | "Probability"
  | "Calculus";

export type Level = "AMC 8" | "AMC 10" | "AMC 12" | "AIME" | "Calculus";

export const TOPICS: Topic[] = [
  "Algebra",
  "Geometry",
  "Trigonometry",
  "Number Theory",
  "Combinatorics",
  "Probability",
  "Calculus",
];
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

export const LEVELS: Level[] = ["AMC 8", "AMC 10", "AMC 12", "AIME", "Calculus"];

/** "Calculus" covers the calculus rounds at tournaments like SMT and BMT. */
export const LEVEL_LABEL: Record<Level, string> = {
  "AMC 8": "AMC 8",
  "AMC 10": "AMC 10",
  "AMC 12": "AMC 12",
  AIME: "AIME",
  Calculus: "Calc rounds",
};

/** [min, max, integer?] sampling range for a variable during numeric grading. */
export type VarRange = [number, number, boolean?];

export interface RecallBlank {
  /** Shown before the input box, e.g. "r_1 + r_2 =". */
  lhs: string;
  /** Canonical answer (LaTeX). */
  answer: string;
  /** Other accepted answers (e.g. p-1 for -1 mod p). */
  accept?: string[];
  /** Variables allowed in the answer. Anything else (like retyping the left side) is rejected. */
  vars: Record<string, VarRange>;
  /** Substrings that may not appear in the input, so the left side can't be retyped as the answer. */
  banned?: string[];
  /** Require a factored ("product") or expanded ("sum") answer for identities. */
  form?: "product" | "sum";
}

export interface Problem {
  id: string;
  /** Text with inline $...$ math. */
  text: string;
  /** Numeric answer as LaTeX. */
  answer: string;
  /** Formula ids the problem needs. */
  uses: string[];
  solution: string;
}

export interface Formula {
  id: string;
  name: string;
  topic: Topic;
  level: Level;
  statement: string;
  setup: string;
  whenToUse: string;
  recall: RecallBlank[];
  related: string[];
  problems: Problem[];
}

type Def = Omit<Formula, "topic" | "problems"> & {
  problems: (Omit<Problem, "uses"> & { uses?: string[] })[];
};

/** Fill in topic and default `uses` (the formula itself). */
export function defineTopic(topic: Topic, defs: Def[]): Formula[] {
  return defs.map((d) => ({
    ...d,
    topic,
    problems: d.problems.map((p) => ({ ...p, uses: p.uses ?? [d.id] })),
  }));
}

export const pos: VarRange = [1, 5];
export const int = (lo: number, hi: number): VarRange => [lo, hi, true];
