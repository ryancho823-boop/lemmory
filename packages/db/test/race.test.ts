// Two answers to the same card sent at the same moment (a double click, a second tab) must
// record one review and one card's points. Its own file, so the temporary database is its own:
// when two transactions overlap on a SQLite file, the loser can hold it locked for a moment.
import { after, test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "lemmory-race-"));
process.env.DATABASE_URL = `file:${join(dir, "race.db")}`;

const { migrate } = await import("drizzle-orm/libsql/migrator");
const { eq } = await import("drizzle-orm");
const { db } = await import("../src/client");
const { reviews } = await import("../src/schema");
const { createStudent, createTeacher } = await import("../src/accounts");
const { startTrial } = await import("../src/billing");
const { assign, createClass } = await import("../src/teacher");
const student = await import("../src/student");
const { FORMULA_BY_ID } = await import("@lemmory/core/formulas");

after(() => rmSync(dir, { recursive: true, force: true }));

test("two simultaneous answers record one review", async () => {
  await migrate(db, { migrationsFolder: new URL("../drizzle", import.meta.url).pathname });
  const teacher = (await createTeacher("Ms. Race", "race@test.test", "correct-horse"))!;
  await startTrial(teacher, "academy", { email: "race@test.test", device: "d" });
  const classId = await createClass(teacher, { name: "Race", contestName: null, contestDay: null, timezone: "UTC" });
  const id = (await createStudent("Riley Race", "riley", "correct-horse", "UTC"))!;
  await student.joinClass(id, classId);
  await assign(teacher, classId, "heron");
  await student.promptFor(id, "heron", "review");
  const answers = FORMULA_BY_ID["heron"].recall.map((b) => b.answer);
  const results = await Promise.allSettled([
    student.answerRecall(id, "heron", answers, "review"),
    student.answerRecall(id, "heron", answers, "review"),
  ]);
  assert.ok(results.some((r) => r.status === "fulfilled"), "one of them goes through");
  assert.equal((await db.select().from(reviews).where(eq(reviews.studentId, id))).length, 1, "one review, so one card's points");
});
