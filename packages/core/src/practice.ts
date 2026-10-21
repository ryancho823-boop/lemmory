import { FORMULAS, FORMULA_BY_ID, type Formula } from "./formulas";

export function shuffle<T>(xs: T[]) {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * The problems a card can quiz. The first one is the worked example on the formula's page, with
 * its answer, so it's left out whenever there are others.
 */
export const quizProblems = (formula: Formula) => (formula.problems.length > 1 ? formula.problems.slice(1) : formula.problems);

/**
 * A random problem not in `avoid` (the ones already shown today, and the last one shown before)
 * plus look-alike distractor formulas. When every problem has been shown, any but the last will do.
 */
export function setupApply(formula: Formula, avoid: string[], deck: string[]) {
  const all = quizProblems(formula);
  const fresh = all.filter((p) => !avoid.includes(p.id));
  const notLast = all.filter((p) => p.id !== avoid[avoid.length - 1]);
  const problem = shuffle(fresh.length ? fresh : notLast.length ? notLast : all)[0];
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

