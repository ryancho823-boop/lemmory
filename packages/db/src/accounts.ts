import "server-only";
import { randomBytes } from "node:crypto";
import { and, desc, eq, gt, lt } from "drizzle-orm";
import { db } from "./client";
import { hashPassword, newId, sha256, verifyPassword } from "./password";
import { passwordResets, sessions, users } from "./schema";

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

export async function createStudent(name: string, username: string, password: string) {
  const normalized = username.trim().toLowerCase();
  if (await db.select({ id: users.id }).from(users).where(eq(users.username, normalized)).get()) return null;
  const id = newId();
  await db.insert(users).values({ id, role: "student", name, username: normalized, passwordHash: await hashPassword(password) });
  return id;
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

/** Is there an account with this login (email for teachers, username for students)? */
export async function accountExists(role: "teacher" | "student", login: string) {
  const key = login.trim().toLowerCase();
  const user = await db
    .select({ role: users.role })
    .from(users)
    .where(role === "teacher" ? eq(users.email, key) : eq(users.username, key))
    .get();
  return user?.role === role;
}

// ── teacher password reset ──

/** How long an emailed reset link works. */
export const RESET_MINUTES = 60;
/** At most one reset email per account in this window, so the form can't be used to flood an inbox. */
const RESET_GAP_MS = 2 * 60_000;

/**
 * A new reset link token for the teacher with this email, or null when there's no such
 * teacher or one was sent in the last two minutes. The caller shows the same message
 * either way, so the form doesn't reveal which emails have accounts.
 */
export async function createPasswordReset(email: string) {
  const teacher = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role })
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .get();
  if (!teacher || teacher.role !== "teacher" || !teacher.email) return null;
  const latest = await db
    .select({ createdAt: passwordResets.createdAt })
    .from(passwordResets)
    .where(eq(passwordResets.userId, teacher.id))
    .orderBy(desc(passwordResets.createdAt))
    .get();
  if (latest && Date.now() - latest.createdAt.getTime() < RESET_GAP_MS) return null;
  await db.delete(passwordResets).where(and(eq(passwordResets.userId, teacher.id), lt(passwordResets.expiresAt, new Date())));
  const token = randomBytes(32).toString("base64url");
  await db.insert(passwordResets).values({
    id: sha256(token),
    userId: teacher.id,
    expiresAt: new Date(Date.now() + RESET_MINUTES * 60_000),
  });
  return { token, name: teacher.name, email: teacher.email };
}

/** Does this reset link still work? */
export async function resetLinkWorks(token: string) {
  const row = await db
    .select({ id: passwordResets.id })
    .from(passwordResets)
    .where(and(eq(passwordResets.id, sha256(token)), gt(passwordResets.expiresAt, new Date())))
    .get();
  return !!row;
}

/**
 * Set a new password from a reset link. Every reset link for the account stops working and
 * every session is signed out. Returns the user id, or null if the link is used up or expired.
 */
export async function resetPasswordWithToken(token: string, password: string) {
  const hash = await hashPassword(password);
  return db.transaction(async (q) => {
    const row = await q
      .select({ userId: passwordResets.userId })
      .from(passwordResets)
      .where(and(eq(passwordResets.id, sha256(token)), gt(passwordResets.expiresAt, new Date())))
      .get();
    if (!row) return null;
    await q.update(users).set({ passwordHash: hash }).where(eq(users.id, row.userId));
    await q.delete(passwordResets).where(eq(passwordResets.userId, row.userId));
    await q.delete(sessions).where(eq(sessions.userId, row.userId));
    return row.userId;
  });
}
