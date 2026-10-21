import { test } from "node:test";
import assert from "node:assert/strict";
import { FORMULA_BY_ID } from "../src/formulas";
import { MAX_ANSWER_LENGTH, MAX_TYPO_LENGTH, findTypo, gradeNumber, gradeRecall } from "../src/grade";

test("a numeric answer is accepted in any equivalent form", () => {
  assert.ok(gradeNumber("\\frac{37}{4}", "9.25"));
  assert.ok(gradeNumber("\\frac{37}{4}", "\\frac{74}{8}"));
  assert.ok(gradeNumber("2\\sqrt{3}", "\\sqrt{12}"));
  assert.ok(gradeNumber("\\frac{\\sqrt{154}}{3}", "\\sqrt{\\frac{154}{9}}"));
});

test("wrong or empty answers are rejected", () => {
  assert.ok(!gradeNumber("\\frac{37}{4}", "9.2"));
  assert.ok(!gradeNumber("6", ""));
  assert.ok(!gradeNumber("6", "x"));
});

test("long answers are refused at once instead of being worked on", () => {
  const blank = FORMULA_BY_ID["heron"].recall[0];
  const long = "a+".repeat(MAX_ANSWER_LENGTH);
  const start = performance.now();
  assert.equal(gradeRecall(blank, long), false);
  assert.equal(gradeNumber("6", "1+".repeat(MAX_ANSWER_LENGTH)), false);
  assert.equal(findTypo(blank, "x".repeat(MAX_TYPO_LENGTH + 1)), null);
  assert.ok(performance.now() - start < 50, "no grading or typo search happened");
});

test("every real formula fits within the answer limit", () => {
  for (const f of Object.values(FORMULA_BY_ID)) for (const b of f.recall) assert.ok(b.answer.length <= MAX_TYPO_LENGTH, f.id);
});
