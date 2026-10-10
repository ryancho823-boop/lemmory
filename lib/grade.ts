import { ComputeEngine } from "@cortex-js/compute-engine";
import type { RecallBlank } from "./formulas";

let engine: ComputeEngine | null = null;
const ce = () => (engine ??= new ComputeEngine());

const TRIALS = 6;

function rand(min: number, max: number, int?: boolean) {
  return int ? Math.floor(min + Math.random() * (max - min + 1)) : min + Math.random() * (max - min);
}

/** Clean up MathLive output quirks that the engine reads differently. */
function normalize(latex: string) {
  return latex
    .replace(/\\left|\\right/g, "")
    .replace(/\\mathrm\{([^}]*)\}/g, "$1")
    .replace(/\\placeholder\{\}/g, "")
    .trim();
}

function evaluate(latex: string, values: Record<string, number>): number | null {
  try {
    const expr = ce().parse(normalize(latex));
    const subs = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, ce().number(v)]));
    const n = expr.subs(subs).N();
    const re = n.re;
    if (typeof re !== "number" || !Number.isFinite(re)) return null;
    if (Math.abs(n.im ?? 0) > 1e-9) return null;
    return re;
  } catch {
    return null;
  }
}

function close(a: number, b: number) {
  return Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(a), Math.abs(b));
}

/** Symbols in the student's answer that aren't allowed variables (catches typos like `ab\sin c`). */
function strayUnknowns(latex: string, allowed: string[]) {
  try {
    const unknowns = ce().parse(normalize(latex)).unknowns ?? [];
    return unknowns.filter((u) => !allowed.includes(u));
  } catch {
    return ["?"];
  }
}

function topHead(latex: string) {
  try {
    const json = ce().parse(normalize(latex)).json;
    return Array.isArray(json) ? json[0] : null;
  } catch {
    return null;
  }
}

function sameValue(blank: RecallBlank, answer: string, input: string) {
  let checked = 0;
  for (let i = 0; i < TRIALS * 3 && checked < TRIALS; i++) {
    const values = Object.fromEntries(Object.entries(blank.vars).map(([k, [lo, hi, int]]) => [k, rand(lo, hi, int)]));
    const want = evaluate(answer, values);
    const got = evaluate(input, values);
    if (want === null) continue; // sample fell outside the domain; try another
    if (got === null || !close(want, got)) return false;
    checked++;
  }
  return checked >= TRIALS;
}

/** Is the typed expression equivalent to the blank's answer? Checked numerically at random points. */
export function gradeRecall(blank: RecallBlank, input: string): boolean {
  return scoped(() => {
    // Declared variables read `a(b+c)` as multiplication instead of a function call.
    for (const v of Object.keys(blank.vars)) ce().declare(v, "real");
    return recall(blank, input);
  });
}

/**
 * The engine auto-declares symbols it sees (and infers their types), which would leak
 * between formulas. Each grade runs in its own scope.
 */
function scoped<T>(fn: () => T): T {
  ce().pushScope();
  try {
    return fn();
  } finally {
    ce().popScope();
  }
}

function recall(blank: RecallBlank, input: string): boolean {
  const clean = normalize(input);
  if (!clean) return false;
  if (blank.banned?.some((b) => clean.replace(/\s+/g, "").includes(b))) return false;
  if (strayUnknowns(clean, Object.keys(blank.vars)).length) return false;
  if (blank.form === "product" && !["Multiply", "Power"].includes(topHead(clean) ?? "")) return false;
  if (blank.form === "sum" && !["Add", "Subtract"].includes(topHead(clean) ?? "")) return false;
  return [blank.answer, ...(blank.accept ?? [])].some((a) => sameValue(blank, a, clean));
}

/** Is the typed number equal to the problem's answer? Accepts any form, e.g. 9.25 or 37/4. */
export function gradeNumber(answer: string, input: string): boolean {
  return scoped(() => number(answer, input));
}

function number(answer: string, input: string): boolean {
  if (!input.trim()) return false;
  if (strayUnknowns(input, []).length) return false;
  const want = evaluate(answer, {});
  const got = evaluate(input, {});
  return want !== null && got !== null && close(want, got);
}
