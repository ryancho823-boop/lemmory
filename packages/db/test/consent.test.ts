// Permission for students under 13, against a real (temporary) SQLite file.
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "lemmory-consent-"));
process.env.DATABASE_URL = `file:${join(dir, "consent.db")}`;

const { migrate } = await import("drizzle-orm/libsql/migrator");
const { eq } = await import("drizzle-orm");
const { isUnder13, DAY_MS } = await import("@lemmory/core/days");
const { db } = await import("../src/client");
const schema = await import("../src/schema");
const accounts = await import("../src/accounts");
const { outbox } = await import("../src/mail");
const { loadClass } = await import("../src/records");
const { createClass } = await import("../src/teacher");
const { classPermissionProblem, joinClass } = await import("../src/student");

const tokenIn = () => /token=([\w-]+)/.exec(outbox.at(-1)!.text)![1];
const userRow = (id: string) => db.select().from(schema.users).where(eq(schema.users.id, id)).get();
const requests = () => db.select().from(schema.parentRequests);

before(() => migrate(db, { migrationsFolder: new URL("../drizzle", import.meta.url).pathname }));
after(() => rmSync(dir, { recursive: true, force: true }));

test("13 only counts once the birthday month has passed", () => {
  const now = new Date(2026, 10, 7);
  assert.equal(isUnder13(2014, 1, now), true);
  assert.equal(isUnder13(2013, 12, now), true);
  assert.equal(isUnder13(2013, 11, now), true);
  assert.equal(isUnder13(2013, 10, now), false);
  assert.equal(isUnder13(1990, 6, now), false);
});

test("a parent agrees, the account appears, and the follow-up can delete it", async () => {
  assert.equal(await accounts.requestParentPermission("Mia", "Parent@Test.test"), null);
  const mail = outbox.at(-1)!;
  assert.equal(mail.to, "parent@test.test");
  assert.match(mail.text, /delete your email and their first name in 14 days/);
  const token = tokenIn();
  const [stored] = await requests();
  assert.notEqual(stored.id, token);

  await accounts.createStudent("Taken", "taken", "correct-horse");
  assert.equal(await accounts.approveParentRequest(token, "Lee", "taken", "correct-horse"), "taken");
  const done = await accounts.approveParentRequest(token, "Lee", "mia", "correct-horse");
  assert.ok(done && done !== "taken");
  assert.equal((await requests()).length, 0);
  assert.equal(await accounts.approveParentRequest(token, "Lee", "mia2", "correct-horse"), null);
  const row = (await userRow(done.id))!;
  assert.equal(row.name, "Mia Lee");
  assert.equal(row.consent, "parent");
  assert.doesNotMatch(outbox.at(-1)!.text, /leaderboard/);
  assert.ok(row.emailConfirmedAt);
  assert.match((await accounts.changeEmail(done.id, "student", "kid@test.test", "correct-horse"))!, /parent's email/);
  assert.equal((await userRow(done.id))!.recoveryEmail, "parent@test.test");

  assert.equal((await accounts.runPrivacyChores()).followUps, 0);
  const tomorrow = new Date(Date.now() + 2 * DAY_MS);
  assert.equal((await accounts.runPrivacyChores(tomorrow)).followUps, 1);
  assert.equal((await accounts.runPrivacyChores(tomorrow)).followUps, 0);
  const removal = tokenIn();
  assert.equal((await accounts.removalTarget(removal))?.username, "mia");
  assert.equal(await accounts.removeByParent(removal), true);
  assert.equal(await userRow(done.id), undefined);
  assert.equal(await accounts.removeByParent(removal), false);
});

test("a parent who never answers is forgotten", async () => {
  await accounts.requestParentPermission("Sam", "quiet@test.test");
  const token = tokenIn();
  await accounts.runPrivacyChores(new Date(Date.now() + 15 * DAY_MS));
  assert.equal((await requests()).length, 0);
  assert.equal(await accounts.parentRequest(token), undefined);
});

test("one address can't be flooded with requests", async () => {
  for (let i = 0; i < 5; i++) assert.equal(await accounts.requestParentPermission("Kid", "busy@test.test"), null);
  assert.match((await accounts.requestParentPermission("Kid", "busy@test.test"))!, /already emailed/);
});

test("a year of nothing deletes a student, but not a recent or paid one", async () => {
  const old = new Date(Date.now() - 400 * DAY_MS);
  const idle = (await accounts.createStudent("Idle", "idle", "correct-horse"))!;
  const practicing = (await accounts.createStudent("Busy", "busy", "correct-horse"))!;
  const paid = (await accounts.createStudent("Paid", "paid", "correct-horse"))!;
  const fresh = (await accounts.createStudent("New", "fresh", "correct-horse"))!;
  for (const id of [idle, practicing, paid]) await db.update(schema.users).set({ createdAt: old }).where(eq(schema.users.id, id));
  await db.insert(schema.reviews).values({ studentId: practicing, day: Math.floor(Date.now() / DAY_MS) - 3, formulaId: "x", stage: "recall", firstTry: true });
  await db.insert(schema.studentPlans).values({ studentId: paid, paidAt: new Date() });
  await accounts.runPrivacyChores();
  assert.equal(await userRow(idle), undefined);
  for (const id of [practicing, paid, fresh]) assert.ok(await userRow(id));
});

test("classmates see an under-13 as a first name and initial, and teachers see the full name", async () => {
  const teacher = (await accounts.createTeacher("T", "names@test.test", "correct-horse"))!;
  const classId = await createClass(teacher, { name: "Names", contestName: null, contestDay: null, timezone: "UTC" });
  const kid = (await accounts.createStudent("Ana Maria Ruiz", "anamaria", "correct-horse", "UTC", undefined, { consent: "parent" }))!;
  const teen = (await accounts.createStudent("Teo Park", "teo", "correct-horse", "UTC"))!;
  await joinClass(kid, classId);
  await joinClass(teen, classId);
  const names = async (forTeacher: boolean) => (await loadClass(classId, forTeacher))!.students.map((s) => s.name).sort();
  assert.deepEqual(await names(false), ["Ana R.", "Teo Park"]);
  assert.deepEqual(await names(true), ["Ana Maria Ruiz", "Teo Park"]);
});

test("a class needs a signed form, not an email, unless the school approved it", async () => {
  const teacher = (await accounts.createTeacher("T", "forms@test.test", "correct-horse"))!;
  const classId = await createClass(teacher, { name: "Forms", contestName: null, contestDay: null, timezone: "UTC" });
  const klass = (await db.select().from(schema.classes).where(eq(schema.classes.id, classId)).get())!;

  assert.equal(await accounts.requestParentPermission("Lia", "form@test.test", classId), null);
  const mail = outbox.at(-1)!;
  assert.match(mail.text, /signed form/);
  assert.ok(mail.text.includes(klass.joinCode));
  assert.doesNotMatch(mail.text, /token=/);

  assert.equal(await accounts.requestParentPermission("Lia", "form@test.test", classId, undefined, true), null);
  const done = await accounts.approveParentRequest(tokenIn(), "Fox", "lia", "correct-horse");
  assert.ok(done && done !== "taken");
  assert.equal(done.classId, classId);
  assert.equal((await userRow(done.id))!.consent, "signed");
  assert.equal(await classPermissionProblem(done.id, klass), null);

  const onEmail = (await accounts.createStudent("Em", "em", "correct-horse", "UTC", undefined, { consent: "parent" }))!;
  const viaSchool = (await accounts.createStudent("Sc", "sc", "correct-horse", "UTC", undefined, { consent: "school" }))!;
  const teen = (await accounts.createStudent("Te", "te", "correct-horse", "UTC"))!;
  assert.match((await classPermissionProblem(onEmail, klass))!, /sign the form/);
  assert.match((await classPermissionProblem(viaSchool, klass))!, /school's classes/);
  assert.equal(await classPermissionProblem(teen, klass), null);
  assert.equal(await classPermissionProblem(onEmail, { schoolApprovedAt: new Date() }), null);
});
