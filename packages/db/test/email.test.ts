// Confirming emails, password resets and the weekly report, against a real (temporary) SQLite file.
// With no RESEND_API_KEY, emails land in `outbox`, so the tests can follow their links.
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "lemmory-email-"));
process.env.DATABASE_URL = `file:${join(dir, "email.db")}`;

const { migrate } = await import("drizzle-orm/libsql/migrator");
const { eq } = await import("drizzle-orm");
const { db } = await import("../src/client");
const schema = await import("../src/schema");
const accounts = await import("../src/accounts");
const { outbox } = await import("../src/mail");
const report = await import("../src/report");
const { startTrial } = await import("../src/billing");
const { assign, createClass } = await import("../src/teacher");
const { joinClass } = await import("../src/student");

const tokenIn = (mail = outbox.at(-1)!) => /token=([\w-]+)/.exec(mail.text)![1];
const userRow = (id: string) => db.select().from(schema.users).where(eq(schema.users.id, id)).get();
const student = async (username: string, email?: string) => (await accounts.createStudent(username, username, "correct-horse", "UTC", email))!;
const confirmed = async (username: string, email: string) => {
  const id = await student(username, email);
  await accounts.sendConfirmation(id, "student", email);
  await accounts.confirmEmail(tokenIn());
  return id;
};

before(() => migrate(db, { migrationsFolder: new URL("../drizzle", import.meta.url).pathname }));
after(() => rmSync(dir, { recursive: true, force: true }));

test("a confirmation link works once, and only hashes are stored", async () => {
  const id = await student("confirmer", "Parent@Test.test");
  assert.equal((await userRow(id))!.recoveryEmail, "parent@test.test");
  await accounts.sendConfirmation(id, "student", "parent@test.test");
  const token = tokenIn();
  assert.equal((await db.select().from(schema.emailTokens).where(eq(schema.emailTokens.id, token)).all()).length, 0, "the raw token isn't in the database");
  assert.deepEqual(await accounts.confirmEmail(token), { role: "student" });
  assert.ok((await userRow(id))!.emailConfirmedAt);
  assert.equal(await accounts.confirmEmail(token), null);
});

test("a password reset only goes to a confirmed address, and says nothing either way", async () => {
  await student("unconfirmed", "unconfirmed@test.test");
  const before = outbox.length;
  await accounts.requestPasswordReset("student", "unconfirmed");
  await accounts.requestPasswordReset("student", "nobody-here");
  assert.equal(outbox.length, before);
});

test("a reset link works once, signs out everywhere, and only on its own site", async () => {
  const id = await confirmed("resetter", "resetter@test.test");
  await db.insert(schema.sessions).values({ id: "old-session", userId: id, expiresAt: new Date(Date.now() + 86_400_000) });
  await accounts.requestPasswordReset("student", "RESETTER");
  const token = tokenIn();
  assert.equal(await accounts.resetLinkRole(token), "student");
  assert.equal(await accounts.resetPasswordWithToken(token, "teacher", "new-password-1"), null, "the teacher site refuses a student's link");
  assert.equal(await accounts.resetPasswordWithToken(token, "student", "new-password-1"), id);
  assert.equal(await accounts.checkLogin("student", "resetter", "correct-horse"), null);
  assert.equal(await accounts.checkLogin("student", "resetter", "new-password-1"), id);
  assert.equal((await db.select().from(schema.sessions).where(eq(schema.sessions.userId, id))).length, 0);
  assert.equal(await accounts.resetPasswordWithToken(token, "student", "new-password-2"), null, "used up");
});

test("an expired reset link doesn't work", async () => {
  const id = await confirmed("expired", "expired@test.test");
  await accounts.requestPasswordReset("student", "expired");
  const token = tokenIn();
  await db.update(schema.emailTokens).set({ expiresAt: new Date(Date.now() - 1000) }).where(eq(schema.emailTokens.userId, id));
  assert.equal(await accounts.resetLinkRole(token), null);
  assert.equal(await accounts.resetPasswordWithToken(token, "student", "new-password-1"), null);
});

test("siblings can share a parent's email, and one request covers both accounts", async () => {
  await confirmed("sister", "family@test.test");
  await confirmed("brother", "family@test.test");
  const before = outbox.length;
  await accounts.requestPasswordReset("student", "family@test.test");
  assert.equal(outbox.length, before + 1, "one email");
  const { text } = outbox.at(-1)!;
  assert.match(text, /sister/);
  assert.match(text, /brother/);
  assert.equal(text.match(/token=/g)!.length, 2);
});

test("changing a confirmed email needs the password, and the old one stays until the new one is confirmed", async () => {
  const id = await confirmed("mover", "old@test.test");
  assert.match((await accounts.changeEmail(id, "student", "new@test.test", "wrong-password"))!, /password/);
  assert.equal(await accounts.changeEmail(id, "student", "new@test.test", "correct-horse"), null);
  assert.equal((await userRow(id))!.recoveryEmail, "old@test.test");
  assert.equal(await accounts.pendingEmail(id, "old@test.test"), "new@test.test");
  await accounts.confirmEmail(tokenIn());
  assert.equal((await userRow(id))!.recoveryEmail, "new@test.test");
});

test("a student with no email can add one without a password", async () => {
  const id = await student("noemail");
  assert.equal(await accounts.changeEmail(id, "student", "added@test.test", ""), null);
  assert.equal((await userRow(id))!.recoveryEmail, "added@test.test");
});

test("a teacher can't take an email another teacher uses", async () => {
  await accounts.createTeacher("First", "first@test.test", "correct-horse");
  const second = (await accounts.createTeacher("Second", "second@test.test", "correct-horse"))!;
  assert.match((await accounts.changeEmail(second, "teacher", "first@test.test", "correct-horse"))!, /already uses/);
});

test("the weekly report goes out on Monday morning, once, and stops when unsubscribed", async () => {
  const id = (await accounts.createTeacher("Ms. Report", "report@test.test", "correct-horse"))!;
  await startTrial(id, "academy", { email: "report@test.test", device: "report-device" });
  const klass = await createClass(id, { name: "Report <Class>", contestName: null, contestDay: null, timezone: "America/New_York" });
  await assign(id, klass, "heron");
  await joinClass(await student("reported"), klass);
  const monday = new Date("2026-11-09T14:00:00Z"); // 9am in New York
  const due = async (at: Date) => (await report.teachersDueWeeklyReport(at)).some((t) => t.id === id);

  assert.equal(await due(monday), false, "not until the email is confirmed");
  await accounts.sendConfirmation(id, "teacher", "report@test.test");
  await accounts.confirmEmail(tokenIn());
  assert.equal(await due(monday), true);
  assert.equal(await due(new Date("2026-11-09T09:00:00Z")), false, "4am in New York");
  assert.equal(await due(new Date("2026-11-10T14:00:00Z")), false, "Tuesday");

  const mail = (await report.buildWeeklyReport({ id, name: "Ms. Report" }, "https://teach.test"))!;
  assert.ok(mail.html.includes("Report &lt;Class&gt;"), "class names are escaped");
  assert.match(mail.headers["List-Unsubscribe"], /\/api\/unsubscribe\?token=/);

  await report.markWeeklyReportSent(id, monday);
  assert.equal(await due(new Date("2026-11-09T17:00:00Z")), false, "not twice");
  assert.equal(await due(new Date("2026-11-16T14:00:00Z")), true, "next week");

  const token = /unsubscribe\?token=([\w-]+)/.exec(mail.text)![1];
  assert.equal(await report.unsubscribe("wrong"), false);
  assert.equal(await report.unsubscribe(token), true);
  assert.equal(await report.getWeeklyReport(id), false);
  assert.equal(await due(new Date("2026-11-16T14:00:00Z")), false);
  await report.setWeeklyReport(id, true);
  assert.equal(await report.getWeeklyReport(id), true);
});

test("deleting an account clears its links and settings", async () => {
  const id = (await accounts.createTeacher("Gone", "gone@test.test", "correct-horse"))!;
  await report.setWeeklyReport(id, false);
  await accounts.sendConfirmation(id, "teacher", "gone@test.test");
  assert.equal(await accounts.deleteAccount(id, "correct-horse"), true);
  assert.equal((await db.select().from(schema.emailTokens).where(eq(schema.emailTokens.userId, id))).length, 0);
  assert.equal((await db.select().from(schema.teacherSettings).where(eq(schema.teacherSettings.teacherId, id))).length, 0);
});
