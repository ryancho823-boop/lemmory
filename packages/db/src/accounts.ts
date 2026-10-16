import "server-only";
import { randomBytes } from "node:crypto";
import { and, desc, eq, gt, lt } from "drizzle-orm";
import { db } from "./client";
import { hashPassword, newId, sha256, verifyPassword } from "./password";
import { emailConfirmations, passwordResets, sessions, studentResetCodes, users } from "./schema";

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

/** Whose reset link this is ("teacher" or "student"), or null if it doesn't work anymore. Each site only accepts its own. */
export async function resetLinkRole(token: string) {
  const row = await db
    .select({ role: users.role })
    .from(passwordResets)
    .innerJoin(users, eq(users.id, passwordResets.userId))
    .where(and(eq(passwordResets.id, sha256(token)), gt(passwordResets.expiresAt, new Date())))
    .get();
  return row?.role ?? null;
}

// ── email confirmation ──

/** How long a confirmation link works. */
export const CONFIRM_HOURS = 24;
/** At most one confirmation email per account in this window. */
const CONFIRM_GAP_MS = 60_000;

/**
 * A link token confirming that `userId` owns `email`: a teacher's sign-up email, or a
 * student's recovery email. Null if one was sent in the last minute.
 */
export async function createEmailConfirmation(userId: string, email: string) {
  const latest = await db
    .select({ createdAt: emailConfirmations.createdAt })
    .from(emailConfirmations)
    .where(eq(emailConfirmations.userId, userId))
    .orderBy(desc(emailConfirmations.createdAt))
    .get();
  if (latest && Date.now() - latest.createdAt.getTime() < CONFIRM_GAP_MS) return null;
  // Only the newest link works.
  await db.delete(emailConfirmations).where(eq(emailConfirmations.userId, userId));
  const token = randomBytes(32).toString("base64url");
  await db.insert(emailConfirmations).values({
    id: sha256(token),
    userId,
    email: email.trim().toLowerCase(),
    expiresAt: new Date(Date.now() + CONFIRM_HOURS * 3_600_000),
  });
  return token;
}

/**
 * Use a confirmation link. A teacher's account becomes confirmed; a student's email becomes
 * their recovery email. Returns the account's id and role, or null if the link is used up.
 */
export async function confirmEmail(token: string) {
  return db.transaction(async (q) => {
    const row = await q
      .select({ userId: emailConfirmations.userId, email: emailConfirmations.email, role: users.role, current: users.email })
      .from(emailConfirmations)
      .innerJoin(users, eq(users.id, emailConfirmations.userId))
      .where(and(eq(emailConfirmations.id, sha256(token)), gt(emailConfirmations.expiresAt, new Date())))
      .get();
    if (!row) return null;
    // A teacher's link only confirms the email they signed up with.
    if (row.role === "teacher" && row.email !== row.current) return null;
    await q
      .update(users)
      .set(row.role === "teacher" ? { emailVerifiedAt: new Date() } : { recoveryEmail: row.email })
      .where(eq(users.id, row.userId));
    await q.delete(emailConfirmations).where(eq(emailConfirmations.userId, row.userId));
    return { userId: row.userId, role: row.role };
  });
}

/** The address a student has a confirmation link out for, if any. */
export async function pendingEmail(userId: string) {
  const row = await db
    .select({ email: emailConfirmations.email })
    .from(emailConfirmations)
    .where(and(eq(emailConfirmations.userId, userId), gt(emailConfirmations.expiresAt, new Date())))
    .get();
  return row?.email ?? null;
}

export async function isEmailVerified(userId: string) {
  const row = await db.select({ at: users.emailVerifiedAt }).from(users).where(eq(users.id, userId)).get();
  return !!row?.at;
}

/** A student's confirmed recovery email, or null. */
export async function recoveryEmail(userId: string) {
  return (await db.select({ email: users.recoveryEmail }).from(users).where(eq(users.id, userId)).get())?.email ?? null;
}

export async function removeRecoveryEmail(userId: string) {
  await db.update(users).set({ recoveryEmail: null }).where(eq(users.id, userId));
  await db.delete(emailConfirmations).where(eq(emailConfirmations.userId, userId));
}

// ── student password reset ──

/** How long a teacher-issued reset code works, and how many wrong tries it allows. */
export const RESET_CODE_HOURS = 24;
const RESET_CODE_TRIES = 5;
// No 0/O or 1/I/L, so codes read cleanly off a screen.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const normalizeCode = (code: string) => code.toUpperCase().replace(/[^A-Z0-9]/g, "");

/**
 * A new one-time reset code for a student (replacing any earlier one), shown once to the
 * teacher who asked for it. Only its SHA-256 is stored.
 */
export async function createStudentResetCode(studentId: string, teacherId: string) {
  const bytes = randomBytes(8);
  const raw = Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
  const expiresAt = new Date(Date.now() + RESET_CODE_HOURS * 3_600_000);
  const row = { codeHash: sha256(raw), createdBy: teacherId, expiresAt, attempts: 0, createdAt: new Date() };
  await db
    .insert(studentResetCodes)
    .values({ studentId, ...row })
    .onConflictDoUpdate({ target: studentResetCodes.studentId, set: row });
  return { code: `${raw.slice(0, 4)}-${raw.slice(4)}`, expiresAt };
}

/**
 * A student sets their own new password with a code from their teacher. Wrong codes count
 * against the code, which stops working after a few. Every session is signed out.
 * Returns the student's id, or null (the same answer for a wrong username or a wrong code).
 */
export async function resetWithStudentCode(username: string, code: string, password: string) {
  const hash = await hashPassword(password);
  return db.transaction(async (q) => {
    const student = await q
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.username, username.trim().toLowerCase()), eq(users.role, "student")))
      .get();
    if (!student) return null;
    const row = await q.select().from(studentResetCodes).where(eq(studentResetCodes.studentId, student.id)).get();
    if (!row || row.expiresAt < new Date() || row.attempts >= RESET_CODE_TRIES) return null;
    if (sha256(normalizeCode(code)) !== row.codeHash) {
      await q
        .update(studentResetCodes)
        .set({ attempts: row.attempts + 1 })
        .where(eq(studentResetCodes.studentId, student.id));
      return null;
    }
    await q.update(users).set({ passwordHash: hash }).where(eq(users.id, student.id));
    await q.delete(studentResetCodes).where(eq(studentResetCodes.studentId, student.id));
    await q.delete(sessions).where(eq(sessions.userId, student.id));
    return student.id;
  });
}

/**
 * A reset link for a student who added a confirmed recovery email, looked up by username or
 * by that email. Null when there's no such student, no confirmed email, or one was sent in
 * the last two minutes. The caller shows the same message either way.
 */
export async function createStudentEmailReset(login: string) {
  const key = login.trim().toLowerCase();
  const student = await db
    .select({ id: users.id, name: users.name, email: users.recoveryEmail })
    .from(users)
    .where(and(eq(users.role, "student"), key.includes("@") ? eq(users.recoveryEmail, key) : eq(users.username, key)))
    .get();
  if (!student?.email) return null;
  const latest = await db
    .select({ createdAt: passwordResets.createdAt })
    .from(passwordResets)
    .where(eq(passwordResets.userId, student.id))
    .orderBy(desc(passwordResets.createdAt))
    .get();
  if (latest && Date.now() - latest.createdAt.getTime() < RESET_GAP_MS) return null;
  const token = randomBytes(32).toString("base64url");
  await db.insert(passwordResets).values({ id: sha256(token), userId: student.id, expiresAt: new Date(Date.now() + RESET_MINUTES * 60_000) });
  return { token, name: student.name, email: student.email };
}
