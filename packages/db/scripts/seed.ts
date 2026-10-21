// Fills the local database with a sample class: one teacher and 13 students with three
// weeks of simulated history, so both apps have something to show on first run.
//
//   npm run db:seed
//
// Sample accounts (local development only):
//   Teacher app: teacher@lemmory.test / lemmory-sample
//   Student app: alex (or priya, aiden, sofia, ...) / lemmory-sample
//   Class join codes: AMCTEN (AMC 10 course), LINCLN (math club)

import { dayInZone } from "@lemmory/core/days";
import { CLASSMATES, YOU, seedAssignments, simulate } from "@lemmory/core/sim";
import { newCard } from "@lemmory/core/srs";
import { DATABASE_URL, db } from "../src/client";
import { hashPassword } from "../src/password";
import * as t from "../src/schema";

const PASSWORD = "lemmory-sample";
const JOIN_CODE = "AMCTEN";

if (!DATABASE_URL.startsWith("file:") && !process.argv.includes("--force")) {
  console.error(`Refusing to seed ${DATABASE_URL}: it isn't a local file. Pass --force if you really mean it.`);
  process.exit(1);
}

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const today = dayInZone(timezone);

/** The next Nov 6 (AMC 10A is usually early November). */
function nextContest() {
  const year = new Date(today * 86_400_000).getUTCFullYear();
  const day = (y: number) => Date.UTC(y, 10, 6) / 86_400_000;
  return day(year) >= today ? day(year) : day(year + 1);
}

async function main() {
  // Start clean.
  for (const table of [t.trialClaims, t.studentPlans, t.plans, t.reviewSessions, t.days, t.reviews, t.cards, t.assignments, t.enrollments, t.classes, t.sessions, t.users])
    await db.delete(table);

  const hash = await hashPassword(PASSWORD);
  const teacherId = "teacher-chen";
  await db.insert(t.users).values({ id: teacherId, role: "teacher", name: "Ms. Chen", email: "teacher@lemmory.test", passwordHash: hash });

  await db.insert(t.plans).values({ teacherId, kind: "academy", orgName: "Lemmory Sample Academy", paidAt: new Date() });

  const classId = "class-amc10";
  const assigned = seedAssignments(today);
  await db.insert(t.classes).values({
    id: classId,
    teacherId,
    name: "Long-Term AMC 10 Course",
    contestName: "AMC 10A",
    contestDay: nextContest(),
    timezone,
    joinCode: JOIN_CODE,
    currentWeek: Math.max(...assigned.map((a) => a.week)),
    gameDay: today - 4,
  });
  await db.insert(t.assignments).values(assigned.map((a) => ({ classId, ...a })));

  const first = Math.min(...assigned.map((a) => a.day));
  for (const p of [YOU, ...CLASSMATES]) {
    const studentId = `student-${p.id}`;
    const username = p.name.split(" ")[0].toLowerCase();
    await db.insert(t.users).values({ id: studentId, role: "student", name: p.name, username, passwordHash: hash });
    await db.insert(t.enrollments).values({ studentId, classId, joinedDay: first, settledThrough: today - 1 });

    // Alex gets a 9-day streak going into today, like the demo.
    const forceDays = p === YOU ? new Set(Array.from({ length: 9 }, (_, i) => today - 1 - i)) : undefined;
    const rec = simulate(p, assigned, today - 1, { forceDays });
    await db.insert(t.cards).values(
      Object.values(rec.cards).map((c) => ({ studentId, formulaId: c.formulaId, source: c.source, stage: c.stage, memory: c.memory, addedDay: c.addedDay })),
    );
    if (rec.log.length)
      await db.insert(t.reviews).values(
        rec.log.map((l) => ({ studentId, day: l.day, formulaId: l.formulaId, stage: l.stage, firstTry: l.firstTry, confusedWith: l.confusedWith ?? null, extra: !!l.extra })),
      );
    const dayRows = Object.entries(rec.missed).map(([d, missed]) => ({ studentId, day: Number(d), done: rec.doneDays.includes(Number(d)), missed }));
    if (dayRows.length) await db.insert(t.days).values(dayRows);
  }

  // A second, smaller class, so the class switchers have something to switch to.
  // Alex, Priya and Kevin are in both.
  const clubId = "class-club";
  await db.insert(t.classes).values({
    id: clubId,
    teacherId,
    name: "Lincoln Middle School Math Club",
    contestName: "AMC 8",
    timezone,
    joinCode: "LINCLN",
    gameDay: today,
  });
  const clubFormulas = ["stars-and-bars", "inscribed-angle", "expected-value"];
  await db.insert(t.assignments).values(clubFormulas.map((formulaId) => ({ classId: clubId, formulaId, week: 1, day: today })));
  for (const id of ["you", "priya", "kevin"]) {
    const studentId = `student-${id}`;
    await db.insert(t.enrollments).values({ studentId, classId: clubId, joinedDay: today, settledThrough: today - 1 });
    // A formula already in their deck from the first class keeps its card (one deck per student).
    await db
      .insert(t.cards)
      .values(
        clubFormulas.map((formulaId) => {
          const c = newCard(formulaId, "teacher", today);
          return { studentId, formulaId, source: c.source, stage: c.stage, memory: c.memory, addedDay: today };
        }),
      )
      .onConflictDoNothing();
  }

  console.log(`Seeded "Long-Term AMC 10 Course" (${timezone}) with ${CLASSMATES.length + 1} students.`);
  console.log(`  Teacher: teacher@lemmory.test / ${PASSWORD}`);
  console.log(`  Students: alex, priya, aiden, ... / ${PASSWORD}`);
  console.log(`  Join codes: ${JOIN_CODE} (AMC 10 course), LINCLN (math club; Alex, Priya and Kevin are in both)`);
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(1);
  },
);
