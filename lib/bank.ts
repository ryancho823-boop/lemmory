// The formula bank as the demo app sees it: only the demo slice, built by
// scripts/build-demo-bank.ts. The full bank (lib/formulas.ts) is never imported by the app.

import data from "./generated/demo-bank.json";
import type { DemoBank } from "./demo";
import type { Formula } from "./content/types";

const bank = data as DemoBank;

export * from "./content/types";
export type { LockedFormula } from "./demo";

export const FORMULAS: Formula[] = bank.formulas;
export const FORMULA_BY_ID: Record<string, Formula> = Object.fromEntries(FORMULAS.map((f) => [f.id, f]));
export const NOTES = bank.notes;
export const LOCKED = bank.locked;
/** Formulas in the full version. */
export const TOTAL_FORMULAS = bank.total;

const tierOf = (id: string) => bank.difficulty[id]?.tier ?? 1;
const scoreOf = (id: string) => bank.difficulty[id]?.score ?? 0;
/** 1 (easiest) to 5 (hardest), ranked across the full bank. */
export const difficultyTier = (f: { id: string }) => tierOf(f.id);
export const byDifficulty = (a: { id: string }, b: { id: string }) => scoreOf(a.id) - scoreOf(b.id);
