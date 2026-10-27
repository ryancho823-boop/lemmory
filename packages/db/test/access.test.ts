// Who can use Lemmory (plans and trials), formulas assigned by more than one class, and filling in
// missed days outside a review, against a real (temporary) SQLite file with every migration applied.
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "lemmory-access-"));
process.env.DATABASE_URL = `file:${join(dir, "access.db")}`;

// Imported after DATABASE_URL is set, so the database client opens the temporary file.
const { migrate } = await import("drizzle-orm/libsql/migrator");
const { and, eq } = await import("drizzle-orm");
const { db } = await import("../src/client");
const schema = await import("../src/schema");
const { createStudent, createTeacher } = await import("../src/accounts");
const { checkoutStudent, startStudentTrial, startTrial } = await import("../src/billing");
const { assign, createClass, unassign } = await import("../src/teacher");
const student = await import("../src/student");
const { dayInZone } = await import("@lemmory/core/days");
const { FORMULA_BY_ID } = await import("@lemmory/core/formulas");

const settings = (name: string) => ({ name, contestName: null, contestDay: null, timezone: "UTC" });
const card = (studentId: string, formulaId: string) =>
  db.select().from(schema.cards).where(and(eq(schema.cards.studentId, studentId), eq(schema.cards.formulaId, formulaId))).get();
const expire = (table: typeof schema.plans | typeof schema.studentPlans, column: "pilotEndsAt" | "trialEndsAt", where: ReturnType<typeof eq>) =>
  db.update(table).set({ [column]: new Date(Date.now() - 86_400_000) }).where(where);

let teacherA: string, teacherB: string, classA: string, classB: string, pat: string;

before(async () => {
  await migrate(db, { migrationsFolder: new URL("../drizzle", import.meta.url).pathname });
  teacherA = (await createTeacher("Teacher A", "a@test.test", "correct-horse"))!;
  teacherB = (await createTeacher("Teacher B", "b@test.test", "correct-horse"))!;
  await startTrial(teacherA, "academy", { email: "a@test.test", device: "da" });
  await startTrial(teacherB, "academy", { email: "b@test.test", device: "db" });
  classA = await createClass(teacherA, settings("Class A"));
  classB = await createClass(teacherB, settings("Class B"));
  pat = (await createStudent("Pat Test", "pat", "correct-horse", "UTC"))!;
  for (const c of [classA, classB]) await student.joinClass(pat, c);
});
after(() => rmSync(dir, { recursive: true, force: true }));

test("a student on their own is locked until a trial, locked again when it ends, and open once paid", async () => {
  const solo = (await createStudent("Solo Test", "solo", "correct-horse", "UTC"))!;
  assert.equal(await student.canStudentReview(solo), false);
  assert.equal(await startStudentTrial(solo, { device: "solo-device" }), null);
  assert.equal(await student.canStudentReview(solo), true);
  assert.match((await startStudentTrial(solo, { device: "solo-device" }))!, /already started/);
  await expire(schema.studentPlans, "trialEndsAt", eq(schema.studentPlans.studentId, solo));
  assert.equal(await student.canStudentReview(solo), false);
  await checkoutStudent(solo, "Parent Test", "parent@test.test");
  assert.equal(await student.canStudentReview(solo), true);
});

test("a second free trial from the same browser is refused", async () => {
  const again = (await createStudent("Again Test", "again", "correct-horse", "UTC"))!;
  assert.match((await startStudentTrial(again, { device: "solo-device" }))!, /this browser/);
  assert.equal(await student.canStudentReview(again), false);
});

test("one class whose teacher's plan is still open is enough", async () => {
  assert.equal(await student.canStudentReview(pat), true);
  await expire(schema.plans, "pilotEndsAt", eq(schema.plans.teacherId, teacherA));
  assert.equal(await student.classCovers(pat), true, "class B still covers Pat");
  await expire(schema.plans, "pilotEndsAt", eq(schema.plans.teacherId, teacherB));
  assert.equal(await student.canStudentReview(pat), false);
  await db.update(schema.plans).set({ pilotEndsAt: new Date(Date.now() + 86_400_000) });
  assert.equal(await student.canStudentReview(pat), true);
});

test("a formula two classes assign stays until both unassign it", async () => {
  await assign(teacherA, classA, "heron");
  await assign(teacherB, classB, "heron");
  assert.equal((await db.select().from(schema.cards).where(eq(schema.cards.studentId, pat))).length, 1, "one card, not two");
  await unassign(teacherA, classA, "heron");
  assert.ok(await card(pat, "heron"), "class B still assigns it");
  await unassign(teacherB, classB, "heron");
  assert.equal(await card(pat, "heron"), undefined);
});

test("a card the student added themselves becomes the teacher's when assigned", async () => {
  await student.addToDeck(pat, "stewart");
  assert.equal((await card(pat, "stewart"))!.source, "self");
  await assign(teacherA, classA, "stewart");
  assert.equal((await card(pat, "stewart"))!.source, "teacher");
  await student.removeFromDeck(pat, "stewart");
  assert.ok(await card(pat, "stewart"), "an assigned card can't be removed by the student");
});

test("unassigning keeps a card the student has already reviewed", async () => {
  await assign(teacherA, classA, "heron");
  await student.promptFor(pat, "heron", "review");
  await student.answerRecall(pat, "heron", FORMULA_BY_ID["heron"].recall.map((b) => b.answer), "review");
  await unassign(teacherA, classA, "heron");
  assert.ok(await card(pat, "heron"));
});

test("missed days are filled in by a practice check too, and loading again adds nothing", async () => {
  const today = dayInZone("UTC");
  await db.update(schema.enrollments).set({ settledThrough: today - 3 }).where(eq(schema.enrollments.studentId, pat));
  await assert.rejects(student.answerRecall(pat, "stewart", ["x"], "practice"), /review first|already reviewed/);
  const filled = await db.select().from(schema.days).where(eq(schema.days.studentId, pat));
  assert.deepEqual(filled.map((r) => r.day).sort(), [today - 2, today - 1]);
  for (const e of await db.select().from(schema.enrollments).where(eq(schema.enrollments.studentId, pat))) assert.equal(e.settledThrough, today - 1);
  await student.loadStudentView({ id: pat, name: "Pat", username: "pat" });
  assert.equal((await db.select().from(schema.days).where(eq(schema.days.studentId, pat))).length, filled.length);
});

test("a student on their own can start with a starter deck, and today's queue has new cards", async () => {
  const solo = (await createStudent("Starter Test", "starter", "correct-horse", "UTC"))!;
  await student.addStarterDeck(solo, "AMC 10");
  const deck = await db.select().from(schema.cards).where(eq(schema.cards.studentId, solo));
  assert.ok(deck.length > 20 && deck.every((c) => c.source === "self" && FORMULA_BY_ID[c.formulaId].level === "AMC 10"));
  const v = await student.loadStudentView({ id: solo, name: "Starter", username: "starter" });
  assert.equal(v.queue.length, 6, "six new cards a day");
  await student.addStarterDeck(solo, "AMC 10");
  assert.equal((await db.select().from(schema.cards).where(eq(schema.cards.studentId, solo))).length, deck.length, "picking again adds nothing");
});
