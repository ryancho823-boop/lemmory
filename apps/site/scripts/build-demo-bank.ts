// Builds lib/generated/demo-bank.json: the slice of the formula bank the public demo ships.
// The app imports only this file, so the rest of the bank never reaches the browser.
// Runs automatically before `npm run dev` and `npm run build`.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { FORMULAS } from "@lemmory/core/formulas";
import { NOTES } from "@lemmory/core/content/notes";
import { rankDifficulty } from "@lemmory/core/difficulty";
import { DEMO_IDS, DEMO_PROBLEMS_PER_FORMULA, type DemoBank } from "../lib/demo";

const inDemo = new Set(DEMO_IDS);
for (const id of DEMO_IDS) if (!FORMULAS.some((f) => f.id === id)) throw new Error(`Unknown demo formula: ${id}`);

const formulas = FORMULAS.filter((f) => inDemo.has(f.id)).map((f) => {
  // Links and problems may only point at formulas that are in the demo too.
  const problems = f.problems.filter((p) => p.uses.every((u) => inDemo.has(u))).slice(0, DEMO_PROBLEMS_PER_FORMULA);
  if (!problems.length) throw new Error(`${f.id} has no problem that only uses demo formulas`);
  return { ...f, related: f.related.filter((r) => inDemo.has(r)), problems };
});

const bank: DemoBank = {
  total: FORMULAS.length,
  formulas,
  notes: Object.fromEntries(DEMO_IDS.map((id) => [id, NOTES[id]])),
  locked: FORMULAS.filter((f) => !inDemo.has(f.id)).map(({ id, name, topic, level }) => ({ id, name, topic, level })),
  // Ranked against the whole bank, so tiers match the full version.
  difficulty: rankDifficulty(FORMULAS),
};

const out = join(dirname(new URL(import.meta.url).pathname), "../lib/generated/demo-bank.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(bank));
console.log(`demo bank: ${formulas.length} of ${FORMULAS.length} formulas`);
