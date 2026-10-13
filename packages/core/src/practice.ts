import { FORMULAS, FORMULA_BY_ID, type Formula } from "./formulas";

export function shuffle<T>(xs: T[]) {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** A fresh problem (not the last one shown) plus look-alike distractor formulas. */
export function setupApply(formula: Formula, lastProblemId: string | undefined, deck: string[]) {
  const pool = formula.problems.filter((p) => p.id !== lastProblemId);
  const problem = shuffle(pool.length ? pool : formula.problems)[0];
  const opts = new Set(problem.uses);
  const candidates = [
    ...shuffle(problem.uses.flatMap((u) => FORMULA_BY_ID[u].related)),
    ...shuffle(FORMULAS.filter((f) => f.topic === formula.topic && deck.includes(f.id)).map((f) => f.id)),
    ...shuffle(FORMULAS.filter((f) => f.topic === formula.topic).map((f) => f.id)),
  ];
  for (const c of candidates) {
    if (opts.size >= 4) break;
    opts.add(c);
  }
  return { problem, options: shuffle([...opts]) };
}

