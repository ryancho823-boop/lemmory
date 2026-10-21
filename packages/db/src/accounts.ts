import "server-only";
import { eq, inArray } from "drizzle-orm";
import { db } from "./client";
import { hashPassword, newId, verifyPassword } from "./password";
import { assignments, cards, classes, days, enrollments, plans, reviewSessions, reviews, sessions, studentPlans, users } from "./schema";

// A real hash to compare against when the account doesn't exist, so a wrong username
// takes as long as a wrong password.
const DUMMY = hashPassword("not-a-real-password");

export async function createTeacher(name: string, email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  if (await db.select({ id: users.id }).from(users).where(eq(users.email, normalized)).get()) return null;
  const id = newId();
  await db.insert(users).values({ id, role: "teacher", name, email: normalized, passwordHash: await hashPassword(password) });
  return id;
}

export async function createStudent(name: string, username: string, password: string, timezone?: string) {
  const normalized = username.trim().toLowerCase();
  if (await db.select({ id: users.id }).from(users).where(eq(users.username, normalized)).get()) return null;
  const id = newId();
  await db.insert(users).values({ id, role: "student", name, username: normalized, passwordHash: await hashPassword(password), timezone });
  return id;
}

/** Remember the student's time zone, for "today" when they aren't in a class. */
export async function setTimezone(userId: string, timezone: string) {
  await db.update(users).set({ timezone }).where(eq(users.id, userId));
}

/** The user id if the login (email for teachers, username for students) and password match. */
export async function checkLogin(role: "teacher" | "student", login: string, password: string) {
  const key = login.trim().toLowerCase();
  const user = await db
    .select({ id: users.id, role: users.role, hash: users.passwordHash })
    .from(users)
    .where(role === "teacher" ? eq(users.email, key) : eq(users.username, key))
    .get();
  const ok = await verifyPassword(password, user?.hash ?? (await DUMMY));
  return ok && user && user.role === role ? user.id : null;
}

/**
 * Delete an account and everything in it: a student's cards, reviews and progress; a teacher's
 * classes (students in them keep their own accounts and decks). Asks for the password, so a
 * borrowed laptop can't do it. Families and schools can ask for this under COPPA and FERPA.
 */
export async function deleteAccount(userId: string, password: string) {
  const user = await db.select({ hash: users.passwordHash }).from(users).where(eq(users.id, userId)).get();
  if (!user || !(await verifyPassword(password, user.hash))) return false;
  await db.transaction(async (q) => {
    // Foreign keys would cascade from the user row, but each table is named here so nothing is
    // left even on a database that doesn't enforce them.
    const owned = (await q.select({ id: classes.id }).from(classes).where(eq(classes.teacherId, userId))).map((c) => c.id);
    if (owned.length) {
      await q.delete(enrollments).where(inArray(enrollments.classId, owned));
      await q.delete(assignments).where(inArray(assignments.classId, owned));
      await q.delete(classes).where(inArray(classes.id, owned));
    }
    await q.delete(plans).where(eq(plans.teacherId, userId));
    for (const t of [cards, reviews, days, reviewSessions, enrollments, studentPlans]) await q.delete(t).where(eq(t.studentId, userId));
    await q.delete(sessions).where(eq(sessions.userId, userId));
    await q.delete(users).where(eq(users.id, userId));
  });
  return true;
}
