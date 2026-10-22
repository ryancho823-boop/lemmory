import { test } from "node:test";
import assert from "node:assert/strict";
import { FORMULAS, FORMULA_BY_ID } from "../src/formulas";
import { quizProblems, setupApply } from "../src/practice";

const BANK = { formulas: FORMULAS, byId: FORMULA_BY_ID };

const f = FORMULA_BY_ID["heron"];

test("the worked example on the formula page is never quizzed", () => {
  for (const formula of FORMULAS) {
    assert.ok(quizProblems(formula).length >= 4, formula.id);
    assert.ok(!quizProblems(formula).includes(formula.problems[0]), formula.id);
  }
});

test("a card that comes back the same day gets a problem it hasn't shown", () => {
  const all = quizProblems(f).map((p) => p.id);
  for (let shown = 1; shown < all.length; shown++) {
    const avoid = all.slice(0, shown);
    for (let i = 0; i < 20; i++) assert.ok(!avoid.includes(setupApply(BANK, f, avoid, []).problem.id));
  }
});

test("once every problem has been shown, any but the last one will do", () => {
  const all = quizProblems(f).map((p) => p.id);
  for (let i = 0; i < 30; i++) assert.notEqual(setupApply(BANK, f, all, []).problem.id, all[all.length - 1]);
});

test("the choices include every formula the problem uses, and at most four", () => {
  for (let i = 0; i < 20; i++) {
    const { problem, options } = setupApply(BANK, f, [], []);
    for (const u of problem.uses) assert.ok(options.includes(u));
    assert.ok(options.length <= 4 && new Set(options).size === options.length);
  }
});
