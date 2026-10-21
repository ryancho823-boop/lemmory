import { FORMULAS, FORMULA_BY_ID } from "../src/formulas";
import { gradeRecall, gradeNumber, findTypo } from "../src/grade";
import { NOTES } from "../src/content/notes";
import { FORMULA_FIGURES, PROBLEM_FIGURES } from "../src/content/v2/figures";
import type { Figure } from "../src/content/types";
import katex from "katex";
let fail = 0;
const ids = new Set<string>(), pids = new Set<string>();
for (const f of FORMULAS) {
  if (ids.has(f.id)) { fail++; console.log("DUP", f.id); } ids.add(f.id);
  for (const r of f.related) if (!FORMULA_BY_ID[r]) { fail++; console.log("BAD RELATED", f.id, r); }
  for (const b of f.recall) {
    if (!gradeRecall(b, b.answer)) { fail++; console.log("SELF FAIL", f.id, b.answer); }
    if (gradeRecall(b, "a+b+1")) { fail++; console.log("FALSE PASS", f.id, b.lhs); }
    // Retyping the left-hand side must not count.
    const lhs = b.lhs.replace(/\\text\{[^}]*\}/g, "").replace(/[=:]\s*$/, "").replace(/\\ge\s*$/, "").replace(/<\s*$/, "");
    // Skip prompts whose left side is only words plus the variable names (e.g. "n numbers with mean m").
    const onlyNames = /^[\s a-zA-Z]*$/.test(lhs);
    if (lhs.trim() && !onlyNames && gradeRecall(b, lhs)) { fail++; console.log("LHS PASSES", f.id, lhs); }
  }
  // A worked example plus four to quiz, so a card that comes back the same day gets a fresh problem.
  if (f.problems.length < 5) { fail++; console.log("FEW PROBLEMS", f.id); }
  for (const p of f.problems) {
    if (pids.has(p.id)) { fail++; console.log("DUP PROBLEM", p.id); } pids.add(p.id);
    for (const u of p.uses) if (!FORMULA_BY_ID[u]) { fail++; console.log("BAD USES", p.id, u); }
    if (!gradeNumber(p.answer, p.answer)) { fail++; console.log("PROB FAIL", p.id, p.answer); }
  }
}
const g = (id: string, i: number, s: string) => gradeRecall(FORMULA_BY_ID[id].recall[i], s);
const cases: [string, number, string, boolean][] = [
  ["sum-of-cubes", 0, "a^3+b^3", false], ["sum-of-cubes", 0, "(a+b)\\left(a^2-ab+b^2\\right)", true],
  ["sfft", 0, "xy+ax+by+ab", false], ["telescoping", 0, "\\frac{1}{n(n+1)}", false], ["telescoping", 0, "\\frac1n-\\frac{1}{n+1}", true],
  ["change-of-base", 0, "\\frac{\\log a}{\\log b}", true], ["change-of-base", 0, "\\log_{b}a", false],
  ["double-angle", 0, "\\sin2x", false], ["double-angle", 1, "1-2\\sin^2x", true], ["double-angle", 1, "2\\cos^2x-1", true],
  ["wilson", 0, "p-1", true], ["wilson", 0, "-1", true],
  ["legendre", 0, "\\left\\lfloor\\frac{n}{p}\\right\\rfloor+\\left\\lfloor\\frac{n}{p^2}\\right\\rfloor+\\left\\lfloor\\frac{n}{p^3}\\right\\rfloor", true],
 ["power-reduction", 0, "\\cos^2x", false], ["power-reduction", 0, "\\frac{1}{2}+\\frac{\\cos2x}{2}", true],
  ["common-derivatives", 0, "\\cos x", true], ["key-limits", 1, "e", true], ["exp-series", 0, "e^{x}", true],
  ["product-rule", 0, "uq+vp", true],
];
for (const [id, i, s, exp] of cases) if (g(id, i, s) !== exp) { fail++; console.log("CASE", id, s, "expected", exp); }
// One-letter slips get a typo hint; real mistakes and right answers don't.
const typoCases: [string, number, string, boolean][] = [
  ["sum-of-cubes", 0, "(a+b)(a^2-ab+c^2)", true], ["sum-of-cubes", 0, "(a+b)(a^2-abb+b^2)", true],
  ["sum-of-cubes", 0, "(a-b)(a^2+ab+b^2)", false], ["sum-of-cubes", 0, "(a+b)(a^2-ab+b^2)", false],
  ["double-angle", 1, "1-2\\sin^2y", true], ["double-angle", 1, "1-2\\cos^2x", false],
];
for (const [id, i, s, exp] of typoCases)
  if ((findTypo(FORMULA_BY_ID[id].recall[i], s) !== null) !== exp) { fail++; console.log("TYPO CASE", id, s, "expected", exp); }
// Every formula needs an explanation and a proof, with balanced, renderable math.
for (const f of FORMULAS) {
  const n = NOTES[f.id];
  if (!n) { fail++; console.log("NO NOTES", f.id); continue; }
  for (const [k, text] of Object.entries(n) as [string, string][]) {
    const spans = text.split("$");
    if (spans.length % 2 === 0) { fail++; console.log("UNBALANCED $", f.id, k); continue; }
    spans.forEach((m, i) => {
      if (i % 2 === 0) return;
      try { katex.renderToString(m, { throwOnError: true }); } catch (e) { fail++; console.log("BAD TEX", f.id, k, m, (e as Error).message.slice(0, 60)); }
    });
  }
}
// Diagrams: every point is a real number, every named segment exists, and attached ids are real.
const badFigure = (f: Figure) =>
  ![f.w, f.h, ...Object.values(f.pts).flat()].every(Number.isFinite) ||
  [...f.lines.map((l) => l.split(":")[0]), ...f.shapes, ...f.rights].some((s) => s.split("-").some((n) => !f.pts[n]));
for (const f of FORMULAS) {
  if (f.figure && badFigure(f.figure)) { fail++; console.log("BAD FIGURE", f.id); }
  for (const p of f.problems) if (p.figure && badFigure(p.figure)) { fail++; console.log("BAD FIGURE", p.id); }
}
for (const id of Object.keys(FORMULA_FIGURES)) if (!FORMULA_BY_ID[id]) { fail++; console.log("ORPHAN FIGURE", id); }
for (const id of Object.keys(PROBLEM_FIGURES)) if (!pids.has(id)) { fail++; console.log("ORPHAN FIGURE", id); }
for (const id of Object.keys(NOTES)) if (!FORMULA_BY_ID[id]) { fail++; console.log("ORPHAN NOTE", id); }
console.log(FORMULAS.length, "formulas,", pids.size, "problems;", fail ? `${fail} failures` : "all checks pass");
