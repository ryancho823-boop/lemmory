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

test("a big answer doesn't accept a near miss", () => {
  assert.ok(gradeNumber("10077696", "10077696"));
  assert.ok(!gradeNumber("10077696", "10077690"));
  assert.ok(gradeNumber("\\frac{\\sqrt{154}}{3}", "\\sqrt{\\frac{154}{9}}"));
});

test("cards take the formula as it's normally written", () => {
  const f = FORMULA_BY_ID;
  const [cond] = f["conditional-probability"].recall;
  assert.ok(gradeRecall(cond, "\\frac{P\\left(A\\cap B\\right)}{P\\left(B\\right)}"));
  assert.ok(gradeRecall(cond, "\\frac{P(AB)}{P(B)}"));
  assert.ok(!gradeRecall(cond, "\\frac{P(B)}{P(A\\cap B)}"));
  assert.ok(!gradeRecall(cond, "\\frac{P(A)}{P(B)}"));
  const [bayes] = f["bayes"].recall;
  assert.ok(gradeRecall(bayes, "\\frac{P(B\\mid A)P(A)}{P(B)}"));
  const [prod] = f["product-rule"].recall;
  assert.ok(gradeRecall(prod, "u'v+uv'"));
  assert.ok(gradeRecall(prod, "u^{\\prime}v+uv^{\\prime}"));
  const [der] = f["derangements"].recall;
  assert.ok(gradeRecall(der, "(n-1)(D_{n-1}+D_{n-2})"));
  const [varc] = f["variance"].recall;
  assert.ok(gradeRecall(varc, "E\\left\\lbrack X^2\\right\\rbrack-E\\left\\lbrack X\\right\\rbrack^2"));
});

test("either secant counts for a tangent", () => {
  const [, tangent] = FORMULA_BY_ID["power-of-a-point"].recall;
  assert.ok(gradeRecall(tangent, "PA\\cdot PB"));
  assert.ok(gradeRecall(tangent, "PC\\cdot PD"));
  assert.ok(!gradeRecall(tangent, "PA\\cdot PD"));
});

test("x1 counts as x with a subscript where the card has one", () => {
  const blank = FORMULA_BY_ID["shoelace"].recall[0];
  assert.ok(gradeRecall(blank, blank.answer.replace(/_\{?(\d)\}?/g, "$1")));
});
