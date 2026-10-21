import "server-only";
import { eq, inArray } from "drizzle-orm";
import { db } from "./client";
import { hashPassword, needsRehash, newId, verifyPassword } from "./password";
import { assignments, cards, classes, dailyScores, days, enrollments, plans, reviewSessions, reviews, sessions, studentPlans, users } from "./schema";

// A real hash to compare against when the account doesn't exist, so a wrong username
// takes as long as a wrong password.
const DUMMY = hashPassword("not-a-real-password");

/** Did this insert fail because the email or username is already taken (the database's unique rule)? */
function isTaken(e: unknown) {
  return /UNIQUE constraint failed/i.test(`${(e as Error)?.message} ${((e as Error)?.cause as Error | undefined)?.message}`);
}

export async function createTeacher(name: string, email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  if (await db.select({ id: users.id }).from(users).where(eq(users.email, normalized)).get()) return null;
  const id = newId();
  try {
    await db.insert(users).values({ id, role: "teacher", name, email: normalized, passwordHash: await hashPassword(password) });
  } catch (e) {
    // Two sign-ups for the same email at the same moment: the second one is "taken", not an error.
    if (isTaken(e)) return null;
    throw e;
  }
  return id;
}

export async function createStudent(name: string, username: string, password: string, timezone?: string) {
  const normalized = username.trim().toLowerCase();
  if (await db.select({ id: users.id }).from(users).where(eq(users.username, normalized)).get()) return null;
  const id = newId();
  try {
    await db.insert(users).values({ id, role: "student", name, username: normalized, passwordHash: await hashPassword(password), timezone });
  } catch (e) {
    if (isTaken(e)) return null;
    throw e;
  }
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
  if (!(ok && user && user.role === role)) return null;
  // An account made with weaker hashing settings is upgraded now that we have the password.
  if (needsRehash(user.hash)) await db.update(users).set({ passwordHash: await hashPassword(password) }).where(eq(users.id, user.id));
  return user.id;
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
    for (const t of [cards, reviews, dailyScores, days, reviewSessions, enrollments, studentPlans]) await q.delete(t).where(eq(t.studentId, userId));
    await q.delete(sessions).where(eq(sessions.userId, userId));
    await q.delete(users).where(eq(users.id, userId));
  });
  return true;
}

/**
 * Change a password: needs the current one, and signs the account out everywhere (the caller
 * starts a fresh session for the device that asked). A lost or shared password stops working.
 */
export async function changePassword(userId: string, current: string, next: string) {
  const user = await db.select({ hash: users.passwordHash }).from(users).where(eq(users.id, userId)).get();
  if (!user || !(await verifyPassword(current, user.hash))) return false;
  const passwordHash = await hashPassword(next);
  await db.transaction(async (q) => {
    await q.update(users).set({ passwordHash }).where(eq(users.id, userId));
    await q.delete(sessions).where(eq(sessions.userId, userId));
  });
  return true;
}
