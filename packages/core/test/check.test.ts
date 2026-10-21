import { test } from "node:test";
import assert from "node:assert/strict";
import { checkPick, checkRecall, checkSolve, wrongPicks } from "../src/check";
import { FORMULA_BY_ID } from "../src/formulas";

const f = FORMULA_BY_ID["power-of-a-point"];
const problem = f.problems[1];

test("picking: right only with exactly the formulas the problem uses", () => {
  assert.ok(checkPick(problem, problem.uses, FORMULA_BY_ID).right);
  assert.ok(!checkPick(problem, [...problem.uses, "heron"], FORMULA_BY_ID).right);
  assert.deepEqual(wrongPicks(problem, [...problem.uses, "heron"]), ["heron"]);
});

test("picking works with a smaller bank (the demo's slice)", () => {
  const slice = { [f.id]: f };
  const r = checkPick(problem, [f.id, "not-in-the-slice"], slice);
  assert.deepEqual(Object.keys(r.statements), [f.id]);
});

test("solving and recall are graded against the formula's answers", () => {
  assert.ok(checkSolve(problem, problem.answer).right);
  const recall = checkRecall(f, f.recall.map((b) => b.answer), true);
  assert.equal(recall.status, "graded");
  assert.ok(recall.status === "graded" && recall.results.every(Boolean));
});
