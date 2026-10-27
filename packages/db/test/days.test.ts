// Several days of real use with a faked clock: what each day's review holds, what carries over,
// and what the heatmap records. Its own file, because it moves the clock for the whole process.
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "lemmory-days-"));
process.env.DATABASE_URL = `file:${join(dir, "days.db")}`;

// Every new Date() and Date.now() is `shift` days ahead.
let shift = 0;
const RealDate = Date;
class ShiftedDate extends RealDate {
  constructor(...args: unknown[]) {
    super(...((args.length ? args : [RealDate.now() + shift * 86_400_000]) as []));
  }
  static now() {
    return RealDate.now() + shift * 86_400_000;
  }
}
globalThis.Date = ShiftedDate as DateConstructor;

const { migrate } = await import("drizzle-orm/libsql/migrator");
const { eq } = await import("drizzle-orm");
const { db } = await import("../src/client");
const schema = await import("../src/schema");
const { createStudent, createTeacher } = await import("../src/accounts");
const { checkoutStudent, startTrial } = await import("../src/billing");
const { assign, createClass } = await import("../src/teacher");
const student = await import("../src/student");
const { FORMULA_BY_ID } = await import("@lemmory/core/formulas");

after(() => rmSync(dir, { recursive: true, force: true }));
before(async () => {
  await migrate(db, { migrationsFolder: new URL("../drizzle", import.meta.url).pathname });
});

const view = (id: string) => student.loadStudentView({ id, name: "S", username: id });
async function answer(studentId: string, formulaId: string) {
  const p = await student.promptFor(studentId, formulaId, "review");
  const f = FORMULA_BY_ID[formulaId];
  if (p.kind === "recall") return student.answerRecall(studentId, formulaId, f.recall.map((b) => b.answer), "review");
  const problem = f.problems.find((x) => x.id === p.problemId)!;
  return student.answerSolve(studentId, formulaId, p.problemId, problem.uses, problem.answer, "review");
}
/** Answer the first `n` of today's cards, right. */
async function doCards(studentId: string, n: number) {
  for (const id of (await view(studentId)).queue.slice(0, n)) await answer(studentId, id);
}
const dayRows = async (studentId: string) =>
  (await db.select().from(schema.days).where(eq(schema.days.studentId, studentId))).sort((a, b) => a.day - b.day).map((r) => (r.done ? "done" : r.missed));

test("in a class: missed cards come back the next day on top of that day's own, and the heatmap records each day", async () => {
  shift = 0;
  const t = (await createTeacher("T", "t@days.test", "correct-horse"))!;
  await startTrial(t, "academy", { email: "t@days.test", device: "days-device" });
  const c = await createClass(t, { name: "C", contestName: null, contestDay: null, timezone: "UTC" });
  const s = (await createStudent("S", "inclass", "correct-horse", "UTC"))!;
  await student.joinClass(s, c);
  for (const id of ["heron", "stewart", "power-of-a-point", "ptolemy", "law-of-cosines", "inscribed-angle", "vieta-quadratic", "amgm", "sfft", "geometric-series"])
    await assign(t, c, id);

  assert.equal((await view(s)).queue.length, 6, "day 0: six new cards");
  await doCards(s, 3);
  shift = 1;
  assert.equal((await view(s)).queue.length, 7, "day 1: the 3 left over, plus the last 4 new ones");
  shift = 2;
  assert.equal((await view(s)).queue.length, 7, "day 2: day 1 was skipped, so all 7 are still there");
  await doCards(s, 99);
  assert.ok((await view(s)).doneToday, "finishing empties the day, even when cards graduate");
  shift = 3;
  const day3 = await view(s);
  assert.ok(day3.queue.length > 0 && day3.queue.every((id) => day3.record.cards[id].memory.last !== null), "day 3: only reviews");
  await doCards(s, 99);
  assert.ok((await view(s)).doneToday);
  shift = 4;
  await view(s);
  assert.deepEqual(await dayRows(s), [3, 7, "done", "done"]);
});

test("on their own: the heatmap records missed days too", async () => {
  shift = 0;
  const s = (await createStudent("Solo", "solo-days", "correct-horse", "UTC"))!;
  await checkoutStudent(s, "Parent", "parent@days.test");
  await student.addStarterDeck(s, "AMC 10");
  await view(s);
  await doCards(s, 3);
  shift = 1;
  assert.equal((await view(s)).queue.length, 3 + 6, "day 1: 3 left over plus 6 new");
  shift = 2;
  await doCards(s, 999);
  shift = 3;
  await view(s);
  assert.deepEqual(await dayRows(s), [3, 9, "done"]);
});
