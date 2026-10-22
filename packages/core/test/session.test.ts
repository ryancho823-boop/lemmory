import { test } from "node:test";
import assert from "node:assert/strict";
import { NEW_PER_DAY, type StudentRecord } from "../src/records";
import { applyDays, buildQueue, emptySession, isDoneToday, nothingDue, recordAttempt, settleDays } from "../src/session";
import { type Card, newCard } from "../src/srs";

const DAY = 20_000;
const reviewed = (id: string, due: number, source: Card["source"] = "teacher"): Card => {
  const c = newCard(id, source, DAY - 10);
  return { ...c, memory: { ...c.memory, last: DAY - 5, due } };
};
const deck = (...cards: Card[]) => Object.fromEntries(cards.map((c) => [c.formulaId, c]));
const record = (cards: Record<string, Card>, extra: Partial<StudentRecord> = {}): StudentRecord => ({ cards, log: [], scored: {}, doneDays: [], missed: {}, ...extra });

test("due reviews come oldest first; cards not yet due wait", () => {
  const q = buildQueue(deck(reviewed("a", DAY), reviewed("b", DAY - 3), reviewed("c", DAY + 1)), emptySession(DAY), DAY);
  assert.deepEqual(q, ["b", "a"]);
});

test("a missed card stays at the front until it's right", () => {
  const session = { ...emptySession(DAY), attempts: { a: false } };
  const q = buildQueue(deck(reviewed("a", DAY), reviewed("b", DAY - 1)), session, DAY);
  assert.equal(q[0], "a");
  const done = { ...session, attempts: { a: false }, completed: ["a"] };
  assert.ok(!buildQueue(deck(reviewed("a", DAY + 1), reviewed("b", DAY - 1)), done, DAY).includes("a"));
});

test("new cards are capped per day, mixed in among reviews, homework first", () => {
  const fresh = Array.from({ length: NEW_PER_DAY + 3 }, (_, i) => newCard(`n${i}`, i < 3 ? "self" : "teacher", DAY - 1));
  const q = buildQueue(deck(reviewed("r1", DAY), reviewed("r2", DAY), ...fresh), emptySession(DAY), DAY);
  const news = q.filter((id) => id.startsWith("n"));
  assert.equal(news.length, NEW_PER_DAY);
  // The self-added cards (n0..n2) come after every assigned one.
  assert.deepEqual(news.slice(0, NEW_PER_DAY - 3), ["n3", "n4", "n5"]);
  assert.notEqual(q[0].startsWith("n") && q[1].startsWith("n"), true, "new cards are interleaved, not blocked");
});

test("new cards started today count against the daily cap", () => {
  const fresh = Array.from({ length: NEW_PER_DAY }, (_, i) => newCard(`n${i}`, "teacher", DAY - 1));
  const session = { ...emptySession(DAY), newStarted: ["x", "y"] };
  assert.equal(buildQueue(deck(...fresh), session, DAY).length, NEW_PER_DAY - 2);
});

test("settling: a day with nothing due is done; otherwise it counts missed homework only", () => {
  const rec = record(deck(reviewed("t", DAY - 2), reviewed("s", DAY - 2, "self")));
  const rows = settleDays(rec, DAY - 3, DAY - 1);
  assert.deepEqual(rows, [
    { day: DAY - 3, done: true, missed: 0 },
    { day: DAY - 2, done: false, missed: 1 },
    { day: DAY - 1, done: false, missed: 1 },
  ]);
  applyDays(rec, rows);
  assert.deepEqual(rec.doneDays, [DAY - 3]);
  assert.deepEqual(settleDays(rec, DAY - 3, DAY - 1), [], "settled days aren't settled twice");
});

test("a card added after a day doesn't count against it", () => {
  const c = { ...reviewed("late", DAY - 5), addedDay: DAY - 1 };
  assert.deepEqual(settleDays(record(deck(c)), DAY - 2, DAY - 2), [{ day: DAY - 2, done: true, missed: 0 }]);
});

test("a day with nothing scheduled counts as done", () => {
  const rec = record(deck(reviewed("a", DAY + 3)));
  assert.ok(nothingDue(rec, DAY));
  assert.ok(isDoneToday(rec, DAY));
  assert.ok(!isDoneToday(record(deck(reviewed("a", DAY))), DAY));
});

test("a miss keeps the card in today's queue, and only the first try is logged once it's right", () => {
  const card = newCard("heron", "teacher", DAY);
  const missed = recordAttempt(emptySession(DAY), card, false, DAY, ["stewart"]);
  assert.equal(missed.done, null);
  assert.deepEqual(buildQueue(deck(card), missed.session, DAY), ["heron"]);
  const right = recordAttempt(missed.session, card, true, DAY, ["ptolemy"]);
  assert.deepEqual(right.done!.entry, { day: DAY, formulaId: "heron", stage: "recall", firstTry: false, confusedWith: ["stewart"] });
  assert.deepEqual(buildQueue(deck(right.done!.card), right.session, DAY), []);
});

test("a card the student added themselves is logged as extra", () => {
  const { done } = recordAttempt(emptySession(DAY), newCard("heron", "self", DAY), true, DAY);
  assert.equal(done!.entry.extra, true);
});
