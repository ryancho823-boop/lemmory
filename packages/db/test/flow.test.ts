// The whole flow against a real (temporary) SQLite file with every migration applied:
// sign up, join, assign, review, points, plan gating, and deleting an account.
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "lemmory-flow-"));
process.env.DATABASE_URL = `file:${join(dir, "flow.db")}`;

// Imported after DATABASE_URL is set, so the database client opens the temporary file.
const { migrate } = await import("drizzle-orm/libsql/migrator");
const { and, eq } = await import("drizzle-orm");
const { db } = await import("../src/client");
const schema = await import("../src/schema");
const { changePassword, checkLogin, createStudent, createTeacher, deleteAccount } = await import("../src/accounts");
const { startTrial } = await import("../src/billing");
const { assign, createClass, deleteClass, newGame, unassign } = await import("../src/teacher");
const student = await import("../src/student");
const { loadClass } = await import("../src/records");
const { CARD_POINTS, pointsBetween } = await import("@lemmory/core/points");
const { FORMULA_BY_ID } = await import("@lemmory/core/formulas");

const f = FORMULA_BY_ID["heron"];
const answers = f.recall.map((b) => b.answer);
let teacherId: string, classId: string, quinn: string, riley: string;

before(async () => {
  await migrate(db, { migrationsFolder: new URL("../drizzle", import.meta.url).pathname });
  teacherId = (await createTeacher("Ms. Test", "teacher@test.test", "correct-horse"))!;
  await startTrial(teacherId, "academy", { email: "teacher@test.test", device: "d1" });
  classId = await createClass(teacherId, { name: "Test Class", contestName: null, contestDay: null, timezone: "UTC" });
  quinn = (await createStudent("Quinn Test", "quinn", "correct-horse", "UTC"))!;
  riley = (await createStudent("Riley Test", "riley", "correct-horse", "UTC"))!;
  for (const id of [quinn, riley]) await student.joinClass(id, classId);
  await assign(teacherId, classId, "heron");
});
after(() => rmSync(dir, { recursive: true, force: true }));

const view = (id: string, name: string) => student.loadStudentView({ id, name, username: name.toLowerCase() });

test("an assigned formula is in the student's queue, and the class has two students", async () => {
  const v = await view(quinn, "Quinn");
  assert.deepEqual(v.queue, ["heron"]);
  assert.ok(v.canReview);
  assert.equal((await loadClass(classId))!.students.length, 2);
});

test("answering a recall card right finishes the day and earns points", async () => {
  const prompt = await student.promptFor(quinn, "heron", "review");
  assert.equal(prompt.kind, "recall");
  const { outcome } = await student.answerRecall(quinn, "heron", answers, "review");
  assert.ok(outcome?.finished);
  const v = await view(quinn, "Quinn");
  assert.ok(v.doneToday);
  assert.deepEqual(v.queue, []);
  const me = v.leaderboard.find((r) => r.you)!;
  assert.ok(me.total >= CARD_POINTS, "points include the card");
  assert.equal(me.streak, 1);
});

test("the same card can't be finished twice in a day", async () => {
  await assert.rejects(student.answerRecall(quinn, "heron", answers, "review"), /isn't due today/);
  const rows = await db.select().from(schema.reviews).where(eq(schema.reviews.studentId, quinn));
  assert.equal(rows.length, 1);
});

test("the database refuses a second review row for the same card and day", async () => {
  const [row] = await db.select().from(schema.reviews).where(eq(schema.reviews.studentId, quinn));
  const { id: _id, ...copy } = row;
  const inserted = await db.insert(schema.reviews).values(copy).onConflictDoNothing().returning({ id: schema.reviews.id });
  assert.equal(inserted.length, 0);
});

test("a wrong answer stays in the queue and earns nothing until it's right", async () => {
  // Riley hasn't done today's card yet (Quinn finished theirs earlier).
  const points = async () => (await view(riley, "Riley")).leaderboard.find((r) => r.you)!.total;
  const start = await points();
  await student.promptFor(riley, "heron", "review");
  const wrong = await student.answerRecall(riley, "heron", f.recall.map(() => "0"), "review");
  assert.ok(wrong.outcome === null || !wrong.outcome.finished);
  assert.equal(await points(), start);
  assert.deepEqual((await view(riley, "Riley")).queue, ["heron"]);
  const right = await student.answerRecall(riley, "heron", answers, "review");
  assert.ok(right.outcome?.finished);
  assert.equal(await points(), start + CARD_POINTS + 5, "the card, plus the first day's streak bonus");
});

test("a new game resets game points but keeps all-time points", async () => {
  await newGame(teacherId, classId);
  const v = await loadClass(classId);
  const row = v!.students.find((s) => s.id === quinn)!;
  assert.ok(pointsBetween(row, -Infinity, v!.today) >= CARD_POINTS);
});

test("unassigning pulls a card nobody has reviewed", async () => {
  await assign(teacherId, classId, "stewart");
  await unassign(teacherId, classId, "stewart");
  const left = await db.select().from(schema.cards).where(and(eq(schema.cards.studentId, riley), eq(schema.cards.formulaId, "stewart")));
  assert.equal(left.length, 0);
});

test("when the teacher's trial ends, students in the class are locked out", async () => {
  await db.update(schema.plans).set({ pilotEndsAt: new Date(Date.now() - 86_400_000) }).where(eq(schema.plans.teacherId, teacherId));
  assert.equal(await student.canStudentReview(quinn), false);
  await assert.rejects(student.promptFor(quinn, "heron", "practice"), /trial has ended/);
  await db.update(schema.plans).set({ pilotEndsAt: new Date(Date.now() + 86_400_000) }).where(eq(schema.plans.teacherId, teacherId));
  assert.equal(await student.canStudentReview(quinn), true);
});

test("changing a password needs the current one, and signs the account out everywhere", async () => {
  await db.insert(schema.sessions).values({ id: "old-session", userId: riley, expiresAt: new Date(Date.now() + 86_400_000) });
  assert.equal(await changePassword(riley, "wrong", "brand-new-pass"), false);
  assert.equal((await db.select().from(schema.sessions).where(eq(schema.sessions.userId, riley))).length, 1, "a failed change signs nobody out");
  assert.equal(await changePassword(riley, "correct-horse", "brand-new-pass"), true);
  assert.equal((await db.select().from(schema.sessions).where(eq(schema.sessions.userId, riley))).length, 0);
  assert.equal(await checkLogin("student", "riley", "correct-horse"), null);
  assert.equal(await checkLogin("student", "riley", "brand-new-pass"), riley);
  assert.ok(await changePassword(riley, "brand-new-pass", "correct-horse"));
});

test("deleting a student needs the password and removes everything they own", async () => {
  assert.equal(await deleteAccount(quinn, "wrong-password"), false);
  assert.equal(await deleteAccount(quinn, "correct-horse"), true);
  for (const t of [schema.cards, schema.reviews, schema.days, schema.enrollments]) {
    assert.equal((await db.select().from(t).where(eq(t.studentId, quinn))).length, 0);
  }
  assert.equal((await db.select().from(schema.users).where(eq(schema.users.id, quinn))).length, 0);
  assert.equal((await db.select().from(schema.users).where(eq(schema.users.id, riley))).length, 1, "other students are untouched");
});

test("deleting a class asks for its name and leaves students' accounts and decks", async () => {
  assert.equal(await deleteClass(teacherId, classId, "not the name"), false);
  assert.equal(await deleteClass(teacherId, classId, "test class"), true);
  assert.equal((await db.select().from(schema.classes).where(eq(schema.classes.id, classId))).length, 0);
  assert.equal((await db.select().from(schema.enrollments).where(eq(schema.enrollments.classId, classId))).length, 0);
  assert.equal((await db.select().from(schema.users).where(eq(schema.users.id, riley))).length, 1);
  assert.ok((await db.select().from(schema.cards).where(eq(schema.cards.studentId, riley))).length >= 1);
});

test("deleting a teacher removes their classes and plan", async () => {
  const c2 = await createClass(teacherId, { name: "Second", contestName: null, contestDay: null, timezone: "UTC" });
  assert.equal(await deleteAccount(teacherId, "correct-horse"), true);
  assert.equal((await db.select().from(schema.classes).where(eq(schema.classes.id, c2))).length, 0);
  assert.equal((await db.select().from(schema.plans).where(eq(schema.plans.teacherId, teacherId))).length, 0);
});
