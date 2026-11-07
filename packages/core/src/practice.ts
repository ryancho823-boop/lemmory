// Takes the bank as an argument rather than importing it, so the demo can use it with its own slice.
import type { Bank, Formula } from "./content/types";

/**
 * Formulas that can do each other's job. A problem that needs one of these can often be solved
 * with another (Law of Cosines works on most Stewart problems), so it would be wrong to mark that
 * choice wrong: one is never offered as a wrong answer to a problem that needs another.
 */
const INTERCHANGEABLE = [
  ["stewart", "median-length", "bisector-length", "law-of-cosines", "british-flag"],
  ["vieta-quadratic", "vieta-cubic", "vieta-general", "symmetric-sums", "power-sums-two", "newton-sums", "reciprocal-roots", "root-difference", "transformed-roots"],
  ["amgm", "qm-am-gm-hm", "weighted-amgm", "power-mean", "trivial-inequality"],
  ["cauchy-schwarz", "titu", "holder", "lagrange-identity"],
  ["heron", "brahmagupta", "bretschneider", "area-sine"],
  ["shoelace", "vector-area", "picks"],
  ["right-triangle-radii", "inradius-circumradius"],
  ["inscribed-angle", "circle-angles", "cyclic-quadrilateral"],
  ["power-of-a-point", "tangent-length", "coordinate-power", "right-triangle-altitude"],
  ["point-line-distance", "parallel-line-distance"],
  ["ceva", "mass-points"],
  ["menelaus", "mass-points"],
  ["double-angle", "half-angle", "power-reduction", "angle-addition", "triple-angle"],
  ["sum-to-product", "product-to-sum", "angle-addition"],
  ["tan-addition", "angle-addition", "arctan-sum"],
  ["half-angle-tan-identity", "tan-half-sub", "half-angle"],
  ["sine-ap-sum", "equal-angle-sums", "roots-of-unity"],
  ["euler-de-moivre", "roots-of-unity", "complex-modulus"],
  ["law-of-sines", "area-sines", "inradius-sines"],
  ["fermat", "euler-theorem", "order-mod", "last-digits"],
  ["legendre", "trailing-zeros", "legendre-digits", "p-adic-valuation", "kummer"],
  ["totient", "multiplicative-functions"],
  ["gcd-lcm-exponents", "gcd-exponents", "unique-factorization"],
  ["bezout", "linear-diophantine", "euclidean-algorithm", "linear-congruence", "modular-inverse"],
  ["stars-and-bars", "compositions", "balls-in-boxes"],
  ["pie", "pie-probability", "stars-bars-limits", "surjections", "derangements", "fixed-points"],
  ["pascal-rule", "hockey-stick", "binomial-identities", "binomial-sums", "vandermonde"],
  ["fibonacci-recursion", "linear-recurrence", "binet"],
  ["sum-of-cubes", "common-factorizations", "power-difference", "sum-of-three-cubes"],
  ["remainder-theorem", "factor-theorem", "rational-root"],
  ["total-probability", "bayes", "conditional-probability"],
  ["total-expectation", "first-step-analysis", "expected-value", "indicator-variables", "binomial-expectation"],
];

/** Formulas that can stand in for any of `ids`, including the formulas themselves. */
const standIns = (ids: string[]) => new Set([...ids, ...INTERCHANGEABLE.filter((g) => ids.some((id) => g.includes(id))).flat()]);

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
export function setupApply(bank: Bank, formula: Formula, avoid: string[], deck: string[]) {
  const all = quizProblems(formula);
  const fresh = all.filter((p) => !avoid.includes(p.id));
  const notLast = all.filter((p) => p.id !== avoid[avoid.length - 1]);
  const problem = shuffle(fresh.length ? fresh : notLast.length ? notLast : all)[0];
  const opts = new Set(problem.uses);
  const workToo = standIns(problem.uses);
  const candidates = [
    ...shuffle(problem.uses.flatMap((u) => bank.byId[u].related)),
    ...shuffle(bank.formulas.filter((f) => f.topic === formula.topic && deck.includes(f.id)).map((f) => f.id)),
    ...shuffle(bank.formulas.filter((f) => f.topic === formula.topic).map((f) => f.id)),
    // A small bank (the demo's) can run out of a topic, and every card shows four choices.
    ...shuffle(bank.formulas.map((f) => f.id)),
  ];
  for (const c of candidates) {
    if (opts.size >= 4) break;
    if (!workToo.has(c) && bank.byId[c]) opts.add(c);
  }
  return { problem, options: shuffle([...opts]) };
}

