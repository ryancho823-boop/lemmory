import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { randomBytes } from "node:crypto";
import { and, eq, lt } from "drizzle-orm";
import { db } from "./client";
import { sessions, users } from "./schema";
import { sha256 } from "./password";
import type { TrialSource } from "./billing";

export type Role = "teacher" | "student";

/** Separate cookies per app, so both can be signed in on the same browser (and on localhost). */
const COOKIE: Record<Role, string> = { teacher: "lemmory_teacher", student: "lemmory_student" };
const SESSION_DAYS = 30;

export async function startSession(userId: string, role: Role) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await db.insert(sessions).values({ id: sha256(token), userId, expiresAt });
  // Clear out this user's expired sessions while we're here.
  await db.delete(sessions).where(and(eq(sessions.userId, userId), lt(sessions.expiresAt, new Date())));
  (await cookies()).set(COOKIE[role], token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function endSession(role: Role) {
  const jar = await cookies();
  const token = jar.get(COOKIE[role])?.value;
  if (token) await db.delete(sessions).where(eq(sessions.id, sha256(token)));
  jar.delete(COOKIE[role]);
}

/** The signed-in user for this app, or null. Cached per request. */
export const currentUser = cache(async (role: Role) => {
  const token = (await cookies()).get(COOKIE[role])?.value;
  if (!token) return null;
  const row = await db
    .select({ id: users.id, name: users.name, role: users.role, email: users.email, username: users.username, expiresAt: sessions.expiresAt })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(eq(sessions.id, sha256(token)))
    .get();
  if (!row || row.role !== role || row.expiresAt < new Date()) return null;
  return { id: row.id, name: row.name, email: row.email, username: row.username };
});

export type SessionUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

/** A random id for this browser, kept for two years: one free trial per browser, and limits on guessing. */
const DEVICE_COOKIE = "lemmory_device";

/**
 * Who is making this request: this browser's id (set now if it has none) and the IP address,
 * when the host provides one. Call it from a server action, which is allowed to set cookies.
 */
export async function requester(): Promise<{ device: string; ip?: string }> {
  const jar = await cookies();
  let device = jar.get(DEVICE_COOKIE)?.value;
  if (!device) {
    device = randomBytes(18).toString("base64url");
    jar.set(DEVICE_COOKIE, device, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 2 * 365 * 86_400 });
  }
  const h = await headers();
  // The host (Vercel) sets these; locally there is none, and a loopback address isn't a real network.
  const ip = (h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0])?.trim();
  const local = !ip || ip === "::1" || ip.startsWith("127.") || ip === "::ffff:127.0.0.1";
  return { device, ip: local ? undefined : ip };
}

/** Who is starting a free trial: the requester, plus the email if there is one. */
export async function trialSource(email?: string): Promise<TrialSource> {
  return { email, ...(await requester()) };
}
