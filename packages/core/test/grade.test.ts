import { test } from "node:test";
import assert from "node:assert/strict";
import { gradeNumber } from "../src/grade";

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
