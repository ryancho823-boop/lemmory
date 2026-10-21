import "server-only";
import { and, count, eq, gt, lt } from "drizzle-orm";
import { db } from "./client";
import { newId, sha256 } from "./password";
import { attempts } from "./schema";

/**
 * How often each thing may be tried before it's paused. Without these, a script could guess
 * passwords (student usernames are often first names), guess class codes to get into a paid
 * class for free, or make accounts endlessly.
 */
export const LIMITS = {
  /** Wrong passwords for one account. */
  loginAccount: { max: 10, minutes: 15 },
  /** Wrong passwords from one network, across accounts. */
  loginNetwork: { max: 50, minutes: 15 },
  /** Wrong class codes from one network, browser or student. */
  classCode: { max: 20, minutes: 60 },
  /** New accounts from one network or browser. */
  signup: { max: 10, minutes: 60 },
} as const;

export type LimitKind = keyof typeof LIMITS;

export const LIMIT_MESSAGE: Record<LimitKind, string> = {
  loginAccount: "Too many wrong passwords. Wait 15 minutes and try again.",
  loginNetwork: "Too many wrong passwords from this network. Wait 15 minutes and try again.",
  classCode: "Too many wrong class codes. Wait an hour and try again, or check the code with your teacher.",
  signup: "Too many new accounts from here. Wait an hour and try again.",
};

const keyOf = (kind: LimitKind, id: string) => sha256(`lemmory-limit:${kind}:${id.trim().toLowerCase()}`);

/** True if any of these (an account, an IP address, a browser id) has hit the limit for `kind`. */
export async function isLimited(kind: LimitKind, ...ids: (string | undefined)[]) {
  const { max, minutes } = LIMITS[kind];
  const since = new Date(Date.now() - minutes * 60_000);
  for (const id of ids) {
    if (!id) continue;
    const [row] = await db
      .select({ n: count() })
      .from(attempts)
      .where(and(eq(attempts.key, keyOf(kind, id)), gt(attempts.createdAt, since)));
    if ((row?.n ?? 0) >= max) return true;
  }
  return false;
}

/** Count one attempt against each of these. Old attempts are cleared out as we go. */
export async function noteAttempt(kind: LimitKind, ...ids: (string | undefined)[]) {
  const rows = ids.filter((id): id is string => !!id).map((id) => ({ id: newId(), key: keyOf(kind, id) }));
  if (rows.length) await db.insert(attempts).values(rows);
  // Nothing is limited for longer than a day, so older rows are never needed.
  await db.delete(attempts).where(lt(attempts.createdAt, new Date(Date.now() - 86_400_000)));
}
