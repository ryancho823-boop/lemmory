import "server-only";
import { randomBytes } from "node:crypto";
import { and, eq, gt, inArray, isNotNull, ne, or } from "drizzle-orm";
import { STUDENT_URL, TEACHER_URL } from "@lemmory/core/urls";
import { db } from "./client";
import { escapeHtml, mailHtml, mailStyle, sendMail } from "./mail";
import { hashPassword, needsRehash, newId, sha256, verifyPassword } from "./password";
import { assignments, cards, classes, dailyScores, days, emailTokens, enrollments, plans, reviewSessions, reviews, sessions, studentPlans, teacherSettings, users } from "./schema";

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
    await db.insert(users).values({ id, role: "teacher", name, email: normalized, emailAddedAt: new Date(), passwordHash: await hashPassword(password) });
  } catch (e) {
    // Two sign-ups for the same email at the same moment: the second one is "taken", not an error.
    if (isTaken(e)) return null;
    throw e;
  }
  return id;
}

export async function createStudent(name: string, username: string, password: string, timezone?: string, email?: string) {
  const normalized = username.trim().toLowerCase();
  if (await db.select({ id: users.id }).from(users).where(eq(users.username, normalized)).get()) return null;
  const id = newId();
  try {
    await db.insert(users).values({
      id,
      role: "student",
      name,
      username: normalized,
      recoveryEmail: email?.trim().toLowerCase(),
      emailAddedAt: email ? new Date() : null,
      passwordHash: await hashPassword(password),
      timezone,
    });
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
  // Sign-up caps passwords at 200, so a longer one can't match and isn't worth hashing.
  const ok = await verifyPassword(password.slice(0, 201), user?.hash ?? (await DUMMY));
  if (!(ok && password.length <= 200 && user && user.role === role)) return null;
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
    await q.delete(teacherSettings).where(eq(teacherSettings.teacherId, userId));
    await q.delete(emailTokens).where(eq(emailTokens.userId, userId));
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

// ── email: confirming an address, and resetting a password ──

type Role = "teacher" | "student";

const CONFIRM_HOURS = 7 * 24;
const RESET_MINUTES = 60;
/** Siblings can share an address; this many accounts is plenty, and caps what one request can send. */
const MAX_RESETS_PER_EMAIL = 6;

const siteOf = (role: Role) => (role === "teacher" ? TEACHER_URL : STUDENT_URL);

/** A new one-time link. Only its hash is stored, and it replaces any earlier link of this kind. */
async function issueToken(userId: string, kind: "confirm" | "reset", minutes: number, email?: string) {
  const token = randomBytes(32).toString("base64url");
  await db.delete(emailTokens).where(and(eq(emailTokens.userId, userId), eq(emailTokens.kind, kind)));
  await db.insert(emailTokens).values({ id: sha256(token), userId, kind, email, expiresAt: new Date(Date.now() + minutes * 60_000) });
  return token;
}

const liveToken = (token: string, kind: "confirm" | "reset") =>
  db
    .select({ id: emailTokens.id, userId: emailTokens.userId, email: emailTokens.email, role: users.role })
    .from(emailTokens)
    .innerJoin(users, eq(users.id, emailTokens.userId))
    .where(and(eq(emailTokens.id, sha256(token)), eq(emailTokens.kind, kind), gt(emailTokens.expiresAt, new Date())))
    .get();

/** Email a link confirming `email`. Returns whether it went out. */
export async function sendConfirmation(userId: string, role: Role, email: string) {
  const token = await issueToken(userId, "confirm", CONFIRM_HOURS * 60, email);
  const href = `${siteOf(role)}/confirm?token=${token}`;
  const intro = "Click the button to confirm this email for your Lemmory account. We use it to help you get back in if you forget your password.";
  return sendMail({
    to: email,
    subject: "Confirm your email for Lemmory",
    text: `${intro}\n\n${href}\n\nThis link works for 7 days. If you didn't sign up for Lemmory, you can ignore this email.`,
    html: mailHtml({
      title: "Confirm your email",
      body: `<p style="${mailStyle.p}">${intro}</p>`,
      button: { href, label: "Confirm my email" },
      note: "This link works for 7 days. If you didn't sign up for Lemmory, you can ignore this email.",
    }),
  });
}

/** Mark the address in this link confirmed. Null if the link is expired, used, or the address got taken. */
export async function confirmEmail(token: string) {
  const row = await liveToken(token, "confirm");
  if (!row?.email) return null;
  const contact = row.role === "teacher" ? { email: row.email } : { recoveryEmail: row.email };
  try {
    await db.update(users).set({ ...contact, emailConfirmedAt: new Date() }).where(eq(users.id, row.userId));
  } catch {
    // A teacher's address is their login, so someone else may have claimed it meanwhile.
    return null;
  }
  await db.delete(emailTokens).where(eq(emailTokens.id, row.id));
  return { role: row.role };
}

/** The address waiting on a confirmation link, if it isn't the current one. */
export async function pendingEmail(userId: string, current: string | null) {
  const row = await db
    .select({ email: emailTokens.email })
    .from(emailTokens)
    .where(and(eq(emailTokens.userId, userId), eq(emailTokens.kind, "confirm"), gt(emailTokens.expiresAt, new Date())))
    .get();
  return row?.email && row.email !== current ? row.email : null;
}

/**
 * Change the contact email, or add a first one. A confirmed address stays in place until the new
 * one is confirmed, so a typo can't lose the account. Changing one needs the password, so a borrowed
 * laptop can't redirect the reset emails. Returns a problem to show, or null.
 */
export async function changeEmail(userId: string, role: Role, email: string, password: string) {
  const next = email.trim().toLowerCase();
  const user = await db.select().from(users).where(eq(users.id, userId)).get();
  if (!user) return "Log in again.";
  const current = role === "teacher" ? user.email : user.recoveryEmail;
  if (current && !(await verifyPassword(password, user.passwordHash))) return "That password isn't right.";
  if (next === current && user.emailConfirmedAt) return "That's already your email.";
  if (role === "teacher" && (await db.select({ id: users.id }).from(users).where(and(eq(users.email, next), ne(users.id, userId))).get()))
    return "Another account already uses that email.";
  if (!user.emailConfirmedAt) {
    const contact = role === "teacher" ? { email: next } : { recoveryEmail: next };
    await db.update(users).set({ ...contact, emailAddedAt: new Date() }).where(eq(users.id, userId));
  }
  await sendConfirmation(userId, role, next);
  return null;
}

/** Email reset links. Says nothing about whether the account exists, and only uses confirmed addresses. */
export async function requestPasswordReset(role: Role, login: string) {
  const key = login.trim().toLowerCase();
  if (!key) return;
  const match =
    role === "teacher" ? eq(users.email, key) : or(eq(users.username, key), eq(users.recoveryEmail, key));
  const found = await db
    .select({ id: users.id, name: users.name, username: users.username, email: users.email, recoveryEmail: users.recoveryEmail })
    .from(users)
    .where(and(eq(users.role, role), match, isNotNull(users.emailConfirmedAt)))
    .limit(MAX_RESETS_PER_EMAIL);
  const byAddress = new Map<string, typeof found>();
  for (const u of found) {
    const to = role === "teacher" ? u.email : u.recoveryEmail;
    if (to) byAddress.set(to, [...(byAddress.get(to) ?? []), u]);
  }
  for (const [to, accounts] of byAddress) {
    const links = await Promise.all(
      accounts.map(async (u) => ({ who: u.username ?? u.name, href: `${siteOf(role)}/reset?token=${await issueToken(u.id, "reset", RESET_MINUTES)}` })),
    );
    const note = `These links work once, for ${RESET_MINUTES} minutes. If you didn't ask for this, you can ignore this email and nothing changes.`;
    const one = links.length === 1;
    await sendMail({
      to,
      subject: "Reset your Lemmory password",
      text: [one ? `Set a new password for ${links[0].who}:` : "Pick the account to set a new password for:", ...links.map((l) => `${one ? "" : `${l.who}: `}${l.href}`), "", note].join("\n"),
      html: mailHtml({
        title: "Reset your password",
        body: one
          ? `<p style="${mailStyle.p}">Click the button to set a new password for <b>${escapeHtml(links[0].who)}</b>.</p>`
          : `<p style="${mailStyle.p}">This email is on more than one account. Pick the one to reset:</p><ul style="${mailStyle.list}">${links
              .map((l) => `<li><a href="${escapeHtml(l.href)}">${escapeHtml(l.who)}</a></li>`)
              .join("")}</ul>`,
        button: one ? { href: links[0].href, label: "Set a new password" } : undefined,
        note,
      }),
    });
  }
}

/** Which app this reset link belongs to, or null if it no longer works. */
export async function resetLinkRole(token: string) {
  return (await liveToken(token, "reset"))?.role ?? null;
}

/** Set the new password, use up the link, and sign the account out everywhere. Null if the link doesn't work. */
export async function resetPasswordWithToken(token: string, role: Role, password: string) {
  const row = await liveToken(token, "reset");
  if (!row || row.role !== role) return null;
  const passwordHash = await hashPassword(password);
  await db.transaction(async (q) => {
    await q.update(users).set({ passwordHash }).where(eq(users.id, row.userId));
    await q.delete(emailTokens).where(and(eq(emailTokens.userId, row.userId), eq(emailTokens.kind, "reset")));
    await q.delete(sessions).where(eq(sessions.userId, row.userId));
  });
  return row.userId;
}
