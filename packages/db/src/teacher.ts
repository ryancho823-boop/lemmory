import "server-only";
import { and, desc, eq, inArray } from "drizzle-orm";
import { FORMULA_BY_ID } from "@lemmory/core/formulas";
import { pointsBetween } from "@lemmory/core/analytics";
import { dayInZone } from "@lemmory/core/days";
import { isNew } from "@lemmory/core/srs";
import { db } from "./client";
import { createStudentResetCode } from "./accounts";
import { newId, newJoinCode } from "./password";
import { addAssignedCards, classToday, loadClass, loadRecords, toCard } from "./records";
import { assignments, cards, classBans, classes, enrollments, sessions, users } from "./schema";

export class NotFound extends Error {}

/** The class, if this teacher owns it. Every teacher action goes through here. */
async function owned(teacherId: string, classId: string) {
  const klass = await db
    .select()
    .from(classes)
    .where(and(eq(classes.id, classId), eq(classes.teacherId, teacherId)))
    .get();
  if (!klass) throw new NotFound();
  return klass;
}

export async function listClasses(teacherId: string) {
  const rows = await db.select().from(classes).where(eq(classes.teacherId, teacherId)).orderBy(classes.createdAt);
  const counts = rows.length
    ? await db
        .select({ classId: enrollments.classId })
        .from(enrollments)
        .where(
          inArray(
            enrollments.classId,
            rows.map((r) => r.id),
          ),
        )
    : [];
  return rows.map((r) => ({ ...r, students: counts.filter((c) => c.classId === r.id).length }));
}

/** Students across all of a teacher's classes, each counted once. */
export async function uniqueStudents(teacherId: string) {
  const rows = await db
    .selectDistinct({ id: enrollments.studentId })
    .from(enrollments)
    .innerJoin(classes, eq(classes.id, enrollments.classId))
    .where(eq(classes.teacherId, teacherId));
  return rows.length;
}

export async function loadTeacherClass(teacherId: string, classId: string) {
  await owned(teacherId, classId);
  return (await loadClass(classId))!;
}

export interface ClassSettings {
  name: string;
  contestName: string | null;
  contestDay: number | null;
  timezone: string;
}

/** A join code nobody else is using. */
async function uniqueCode() {
  for (;;) {
    const code = newJoinCode();
    if (!(await db.select({ id: classes.id }).from(classes).where(eq(classes.joinCode, code)).get())) return code;
  }
}

export async function createClass(teacherId: string, s: ClassSettings) {
  const id = newId();
  await db.insert(classes).values({ id, teacherId, ...s, joinCode: await uniqueCode(), gameDay: dayInZone(s.timezone) });
  return id;
}

export async function updateClass(teacherId: string, classId: string, s: ClassSettings) {
  await owned(teacherId, classId);
  await db.update(classes).set(s).where(eq(classes.id, classId));
}

export async function newClassCode(teacherId: string, classId: string) {
  await owned(teacherId, classId);
  await db.update(classes).set({ joinCode: await uniqueCode() }).where(eq(classes.id, classId));
}

async function roster(classId: string) {
  return (await db.select({ id: enrollments.studentId }).from(enrollments).where(eq(enrollments.classId, classId))).map((r) => r.id);
}

/** Assign to the current week. Every student gets the card; scheduling takes it from there. */
export async function assign(teacherId: string, classId: string, formulaId: string) {
  if (!FORMULA_BY_ID[formulaId]) throw new NotFound();
  const klass = await owned(teacherId, classId);
  const today = classToday(klass);
  const students = await roster(classId);
  await db.transaction(async (q) => {
    const added = await q
      .insert(assignments)
      .values({ classId, formulaId, week: klass.currentWeek, day: today })
      .onConflictDoNothing()
      .returning();
    if (added.length) await addAssignedCards(q, students, [formulaId], today);
  });
}

/** Unassign. Students who already started the card keep it; it's only pulled if never reviewed. */
export async function unassign(teacherId: string, classId: string, formulaId: string) {
  await owned(teacherId, classId);
  const students = await roster(classId);
  await db.transaction(async (q) => {
    await q.delete(assignments).where(and(eq(assignments.classId, classId), eq(assignments.formulaId, formulaId)));
    if (!students.length) return;
    const rows = await q
      .select()
      .from(cards)
      .where(and(inArray(cards.studentId, students), eq(cards.formulaId, formulaId), eq(cards.source, "teacher")));
    // Keep the card if another of the student's classes still assigns this formula.
    const elsewhere = new Set(
      (
        await q
          .select({ studentId: enrollments.studentId })
          .from(enrollments)
          .innerJoin(assignments, eq(assignments.classId, enrollments.classId))
          .where(and(inArray(enrollments.studentId, students), eq(assignments.formulaId, formulaId)))
      ).map((r) => r.studentId),
    );
    const untouched = rows.filter((r) => isNew(toCard(r)) && !elsewhere.has(r.studentId)).map((r) => r.studentId);
    if (untouched.length)
      await q.delete(cards).where(and(inArray(cards.studentId, untouched), eq(cards.formulaId, formulaId), eq(cards.source, "teacher")));
  });
}

export async function startNextWeek(teacherId: string, classId: string) {
  const klass = await owned(teacherId, classId);
  await db
    .update(classes)
    .set({ currentWeek: klass.currentWeek + 1 })
    .where(eq(classes.id, classId));
}

/** New leaderboard game: everyone's game points go back to 0. Streaks and all-time points stay. */
export async function newGame(teacherId: string, classId: string) {
  const klass = await owned(teacherId, classId);
  const today = classToday(klass);
  const ids = await roster(classId);
  const records = await loadRecords(ids);
  // Points already earned today don't count toward the new game.
  const baseline = Object.fromEntries(ids.map((id) => [id, pointsBetween(records.get(id)!, today, today)]));
  await db.update(classes).set({ gameDay: today, gameBaseline: baseline }).where(eq(classes.id, classId));
}

async function enrolled(teacherId: string, classId: string, studentId: string) {
  await owned(teacherId, classId);
  const row = await db
    .select({ name: users.name, username: users.username })
    .from(enrollments)
    .innerJoin(users, eq(users.id, enrollments.studentId))
    .where(and(eq(enrollments.classId, classId), eq(enrollments.studentId, studentId)))
    .get();
  if (!row) throw new NotFound();
  return row;
}

export const studentInfo = enrolled;

/** Remove a student from the class. Their account and history stay, and they can rejoin with the code. */
export async function removeStudent(teacherId: string, classId: string, studentId: string) {
  await enrolled(teacherId, classId, studentId);
  await db.delete(enrollments).where(and(eq(enrollments.studentId, studentId), eq(enrollments.classId, classId)));
}

/** Kick a student out: they leave the class and the class code stops working for them. */
export async function kickStudent(teacherId: string, classId: string, studentId: string) {
  await enrolled(teacherId, classId, studentId);
  await db.transaction(async (q) => {
    await q.delete(enrollments).where(and(eq(enrollments.studentId, studentId), eq(enrollments.classId, classId)));
    await q.insert(classBans).values({ classId, studentId }).onConflictDoNothing();
  });
}

/** Students kicked out of this class, most recent first. */
export async function kickedStudents(teacherId: string, classId: string) {
  await owned(teacherId, classId);
  return db
    .select({ id: users.id, name: users.name, username: users.username, kickedAt: classBans.createdAt })
    .from(classBans)
    .innerJoin(users, eq(users.id, classBans.studentId))
    .where(eq(classBans.classId, classId))
    .orderBy(desc(classBans.createdAt));
}

/** Undo a kick: the student can join with the class code again (they aren't re-added). */
export async function letBackIn(teacherId: string, classId: string, studentId: string) {
  await owned(teacherId, classId);
  await db.delete(classBans).where(and(eq(classBans.classId, classId), eq(classBans.studentId, studentId)));
}

/**
 * Students forget passwords. The teacher gets a one-time code to give the student, who uses
 * it to choose a new password themselves, so the teacher never knows it.
 */
export async function makeStudentResetCode(teacherId: string, classId: string, studentId: string) {
  await enrolled(teacherId, classId, studentId);
  return createStudentResetCode(studentId, teacherId);
}
