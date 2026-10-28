import { test } from "node:test";
import assert from "node:assert/strict";
import { NEW_PER_DAY, type StudentRecord } from "../src/records";
import { applyDays, buildQueue, emptySession, isDoneToday, newCards, nothingDue, recordAttempt, settleDays } from "../src/session";
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

test("new cards come in NEW_PER_DAY a day, mixed in among reviews, homework first", () => {
  const homework = newCards([], Array.from({ length: NEW_PER_DAY + 3 }, (_, i) => `t${i}`), "teacher", DAY);
  const own = newCards(homework, ["s0", "s1"], "self", DAY);
  const q = buildQueue(deck(reviewed("r1", DAY), reviewed("r2", DAY), ...homework, ...own), emptySession(DAY), DAY);
  const news = q.filter((id) => !id.startsWith("r"));
  // Six assigned cards today (the rest tomorrow), then the student's own, spread separately.
  assert.deepEqual(news, ["t0", "t1", "t2", "t3", "t4", "t5", "s0", "s1"]);
  assert.notEqual(q[0] !== "r1" && q[1] !== "r2", true, "new cards are interleaved, not blocked");
  assert.deepEqual(homework.slice(NEW_PER_DAY).map((c) => c.memory.due), [DAY + 1, DAY + 1, DAY + 1]);
});

test("cards missed today come back tomorrow on top of tomorrow's own", () => {
  const cards = deck(...newCards([], Array.from({ length: 2 * NEW_PER_DAY }, (_, i) => `n${i}`), "teacher", DAY));
  // Today: three done, three left. Tomorrow: those three plus tomorrow's six.
  const done = Object.fromEntries(["n0", "n1", "n2"].map((id) => [id, { ...cards[id], memory: { ...cards[id].memory, last: DAY, due: DAY + 3 } }]));
  assert.equal(buildQueue({ ...cards, ...done }, emptySession(DAY + 1), DAY + 1).length, 3 + NEW_PER_DAY);
});

test("a card that just graduated waits for its due day instead of coming back today", () => {
  const c = { ...newCard("g", "teacher", DAY - 5), stage: "apply" as const, memory: { ...newCard("g", "teacher", DAY).memory, due: DAY + 1 } };
  assert.deepEqual(buildQueue(deck(c), emptySession(DAY), DAY), []);
  assert.deepEqual(buildQueue(deck(c), emptySession(DAY + 1), DAY + 1), ["g"]);
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

test("the first try is logged right away; a miss stays in today's queue and is scheduled once it's right", () => {
  const card = newCard("heron", "teacher", DAY);
  const missed = recordAttempt(emptySession(DAY), card, false, DAY, ["stewart"]);
  assert.deepEqual(missed.entry, { day: DAY, formulaId: "heron", stage: "recall", firstTry: false, confusedWith: ["stewart"] });
  assert.equal(missed.done, null);
  assert.deepEqual(buildQueue(deck(card), missed.session, DAY), ["heron"]);
  const right = recordAttempt(missed.session, card, true, DAY, ["ptolemy"]);
  assert.equal(right.entry, null, "only the first try is logged");
  assert.ok(right.done);
  assert.deepEqual(buildQueue(deck(right.done!.card), right.session, DAY), []);
});

test("a card the student added themselves is logged as extra", () => {
  const { entry } = recordAttempt(emptySession(DAY), newCard("heron", "self", DAY), true, DAY);
  assert.equal(entry!.extra, true);
});
