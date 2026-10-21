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
  assert.equal(card.memory.reps, 0);
});
