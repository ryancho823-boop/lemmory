import { test } from "node:test";
import assert from "node:assert/strict";
import { PROMOTE_STABILITY, isNew, newCard, review } from "../src/srs";

const DAY = 20_000;

test("a new card is due the day it's added", () => {
  const c = newCard("a", "teacher", DAY);
  assert.ok(isNew(c));
  assert.equal(c.memory.due, DAY);
  assert.equal(c.stage, "recall");
});

test("a review always schedules the card for a later day", () => {
  for (const right of [true, false]) {
    const { card } = review(newCard("a", "teacher", DAY), right, DAY);
    assert.ok(card.memory.due > DAY);
    assert.equal(card.memory.last, DAY);
  }
});

test("right answers space a card out further than wrong ones", () => {
  const right = review(newCard("a", "teacher", DAY), true, DAY).card;
  const wrong = review(newCard("a", "teacher", DAY), false, DAY).card;
  assert.ok(right.memory.due >= wrong.memory.due);
});

test("a recall card that's known cold moves to application mode with a fresh schedule", () => {
  let card = newCard("a", "teacher", DAY);
  let day = DAY;
  let promoted = false;
  for (let i = 0; i < 20 && !promoted; i++) {
    const r = review(card, true, day);
    promoted = r.promoted;
    card = r.card;
    day = card.memory.due;
  }
  assert.ok(promoted, `never promoted (stability needs ${PROMOTE_STABILITY})`);
  assert.equal(card.stage, "apply");
  assert.ok(!isNew(card), "a graduated card was reviewed, so it is not a new card");
  assert.equal(card.memory.reps, 0);
});

const applied = () => {
  let card = newCard("a", "teacher", DAY);
  let day = DAY;
  for (let i = 0; i < 20 && card.stage === "recall"; i++) {
    card = review(card, true, day).card;
    day = card.memory.due;
  }
  return { card, day };
};

test("two application misses in a row send a card back to recall", () => {
  const { card, day } = applied();
  const once = review(card, false, day);
  assert.equal(once.demoted, false);
  assert.equal(once.card.stage, "apply");
  const twice = review(once.card, false, once.card.memory.due);
  assert.equal(twice.demoted, true);
  assert.equal(twice.card.stage, "recall");
  assert.ok(!isNew(twice.card), "a card sent back was reviewed, so it is not a new card");
  assert.equal(twice.card.memory.due, once.card.memory.due + 1);
});

test("a right answer between misses keeps a card in application", () => {
  const { card, day } = applied();
  const a = review(card, false, day).card;
  const b = review(a, true, a.memory.due).card;
  const c = review(b, false, b.memory.due);
  assert.equal(c.demoted, false);
  assert.equal(c.card.stage, "apply");
});

test("a card sent back can earn its way to application again", () => {
  const { card, day } = applied();
  const a = review(card, false, day).card;
  let back = review(a, false, a.memory.due).card;
  let promoted = false;
  let n = 0;
  for (let d = back.memory.due; n < 10 && !promoted; n++) {
    const r = review(back, true, d);
    promoted = r.promoted;
    back = r.card;
    d = back.memory.due;
  }
  assert.ok(promoted);
  assert.ok(n <= 3, `took ${n} right answers`);
});
