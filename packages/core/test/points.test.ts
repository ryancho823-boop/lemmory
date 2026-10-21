import { test } from "node:test";
import assert from "node:assert/strict";
import { CARD_POINTS, STREAK_CAP, STREAK_POINTS, pointsBetween, streak, streakBonus } from "../src/points";
import type { StudentRecord } from "../src/records";

test("a streak counts back from today, or from yesterday if today isn't done yet", () => {
  assert.equal(streak([5, 6, 7], 7), 3);
  assert.equal(streak([5, 6, 7], 8), 3);
  assert.equal(streak([5, 6, 7], 9), 0);
  assert.equal(streak([3, 5, 6], 6), 2);
});

test("the streak bonus is capped", () => {
  assert.equal(streakBonus(STREAK_CAP + 10), STREAK_POINTS * STREAK_CAP);
});

test("points: every card is worth the same, self-added cards earn nothing, finished days add a streak bonus", () => {
  const s: StudentRecord = {
    cards: {},
    log: [
      { day: 1, formulaId: "a", stage: "recall", firstTry: true },
      { day: 2, formulaId: "b", stage: "recall", firstTry: false },
      { day: 2, formulaId: "c", stage: "recall", firstTry: true, extra: true },
    ],
    doneDays: [1, 2],
    missed: {},
  };
  assert.equal(pointsBetween(s, 1, 2), 2 * CARD_POINTS + streakBonus(1) + streakBonus(2));
  assert.equal(pointsBetween(s, 2, 2), CARD_POINTS + streakBonus(2));
});
