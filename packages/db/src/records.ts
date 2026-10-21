// Loading students' review history and keeping their day-by-day record up to date.

import { and, count, eq, gte, inArray } from "drizzle-orm";
import { FORMULA_BY_ID } from "@lemmory/core/formulas";
import type { Student } from "@lemmory/core/analytics";
import { LOG_DAYS, type LogEntry, type StudentRecord } from "@lemmory/core/records";
import { applyDays, settleDays } from "@lemmory/core/session";
import { type Card, newCard } from "@lemmory/core/srs";
import { contestLabel, dayInZone } from "@lemmory/core/days";
import { db, type Tx } from "./client";
import { assignments, cards, classes, days, enrollments, reviews, users } from "./schema";

export type ClassRow = typeof classes.$inferSelect;
type CardRow = typeof cards.$inferSelect;

export const classToday = (c: Pick<ClassRow, "timezone">) => dayInZone(c.timezone);

/**
 * Each student's own clock: the time zone their browser reported (saved at sign-up and login),
 * else their first class's, else UTC. A student has one deck across all their classes, so every
 * page and every answer counts "today" by this one clock.
 */
export async function studentZones(studentIds: string[], q: Tx | typeof db = db): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  if (!studentIds.length) return out;
  const [own, joined] = await Promise.all([
    q.select({ id: users.id, timezone: users.timezone }).from(users).where(inArray(users.id, studentIds)),
    q
      .select({ id: enrollments.studentId, timezone: classes.timezone })
      .from(enrollments)
      .innerJoin(classes, eq(classes.id, enrollments.classId))
      .where(inArray(enrollments.studentId, studentIds))
      .orderBy(enrollments.joinedDay, classes.createdAt),
  ]);
  for (const r of joined) if (!out.has(r.id)) out.set(r.id, r.timezone);
  for (const r of own) if (r.timezone) out.set(r.id, r.timezone);
  for (const id of studentIds) if (!out.has(id)) out.set(id, "UTC");
  return out;
}

export async function studentToday(studentId: string, q: Tx | typeof db = db) {
  return dayInZone((await studentZones([studentId], q)).get(studentId)!);
}

export function toCard(r: CardRow): Card {
  return { formulaId: r.formulaId, source: r.source, stage: r.stage, memory: r.memory, addedDay: r.addedDay };
}

type ReviewRow = typeof reviews.$inferSelect;

function toEntry(r: ReviewRow): LogEntry {
  const e: LogEntry = { day: r.day, formulaId: r.formulaId, stage: r.stage, firstTry: r.firstTry };
  if (r.confusedWith?.length) e.confusedWith = r.confusedWith.filter((id) => FORMULA_BY_ID[id]);
  if (r.extra) e.extra = true;
  return e;
}

/**
 * Cards, day history and points for each student, plus the review log from `logSince` on
 * (null: no log, for pages that only need points and streaks). Cards and days grow slowly (one
 * per formula, one per day); the log grows with every answer, so it's only read as far back as
 * a page shows. Formulas no longer in the bank are skipped.
 */
export async function loadRecords(studentIds: string[], logSince: number | null, q: Tx | typeof db = db): Promise<Map<string, StudentRecord>> {
  const out = new Map<string, StudentRecord>(studentIds.map((id) => [id, { cards: {}, log: [], scored: {}, doneDays: [], missed: {} }]));
  if (!studentIds.length) return out;
  const [cardRows, reviewRows, scoredRows, dayRows] = await Promise.all([
    q.select().from(cards).where(inArray(cards.studentId, studentIds)),
    logSince === null
      ? Promise.resolve([] as ReviewRow[])
      : q.select().from(reviews).where(and(inArray(reviews.studentId, studentIds), gte(reviews.day, logSince))).orderBy(reviews.id),
    // Points for all time, counted by the database: one row per student per day. Reviews of a
    // formula since removed from the bank still count, so points a student earned never disappear.
    q
      .select({ studentId: reviews.studentId, day: reviews.day, n: count() })
      .from(reviews)
      .where(and(inArray(reviews.studentId, studentIds), eq(reviews.extra, false)))
      .groupBy(reviews.studentId, reviews.day),
    q.select().from(days).where(inArray(days.studentId, studentIds)),
  ]);
  for (const r of cardRows) if (FORMULA_BY_ID[r.formulaId]) out.get(r.studentId)!.cards[r.formulaId] = toCard(r);
  for (const r of reviewRows) if (FORMULA_BY_ID[r.formulaId]) out.get(r.studentId)!.log.push(toEntry(r));
  for (const r of scoredRows) out.get(r.studentId)!.scored[r.day] = r.n;
  for (const r of dayRows) {
    const rec = out.get(r.studentId)!;
    if (r.done) rec.doneDays.push(r.day);
    rec.missed[r.day] = r.missed;
  }
  for (const rec of out.values()) rec.doneDays.sort((a, b) => a - b);
  return out;
}

/** Record every finished past day for these students (before anything changes their cards). `today` is each student's own. */
export async function settle(
  rows: { studentId: string; classId: string; settledThrough: number; today: number }[],
  records: Map<string, StudentRecord>,
  q: Tx | typeof db = db,
) {
  for (const e of rows) {
    const { today } = e;
    if (e.settledThrough >= today - 1) continue;
    const rec = records.get(e.studentId);
    if (!rec) continue;
    const newRows = settleDays(rec, e.settledThrough + 1, today - 1);
    if (newRows.length)
      await q
        .insert(days)
        .values(newRows.map((r) => ({ studentId: e.studentId, ...r })))
        .onConflictDoNothing();
    await q
      .update(enrollments)
      .set({ settledThrough: today - 1 })
      .where(and(eq(enrollments.studentId, e.studentId), eq(enrollments.classId, e.classId)));
    applyDays(rec, newRows);
  }
}

export interface ClassView {
  klass: ClassRow;
  today: number;
  contest: string | null;
  assignments: { formulaId: string; week: number; day: number }[];
  students: Student[];
}

/** Every review a student has done of one formula (for that formula's page). */
export async function formulaLog(studentId: string, formulaId: string) {
  const rows = await db.select().from(reviews).where(and(eq(reviews.studentId, studentId), eq(reviews.formulaId, formulaId))).orderBy(reviews.id);
  return rows.map(toEntry);
}

/**
 * Everything about one class, with every student's record settled through yesterday.
 * Logs cover the last LOG_DAYS days; `withLogs: false` skips them (a student's page shows
 * classmates only on the leaderboard, which needs points and streaks, not their reviews).
 */
export async function loadClass(classId: string, withLogs = true): Promise<ClassView | null> {
  const klass = await db.select().from(classes).where(eq(classes.id, classId)).get();
  if (!klass) return null;
  const today = classToday(klass);
  const [roster, assigned] = await Promise.all([
    db
      .select({ studentId: enrollments.studentId, classId: enrollments.classId, settledThrough: enrollments.settledThrough, name: users.name })
      .from(enrollments)
      .innerJoin(users, eq(users.id, enrollments.studentId))
      .where(eq(enrollments.classId, classId))
      .orderBy(users.name),
    db
      .select({ formulaId: assignments.formulaId, week: assignments.week, day: assignments.day })
      .from(assignments)
      .where(eq(assignments.classId, classId)),
  ]);
  const ids = roster.map((r) => r.studentId);
  const [records, zones] = await Promise.all([loadRecords(ids, withLogs ? today - LOG_DAYS : null), studentZones(ids)]);
  // One transaction, so two pages loading at once can't interleave their writes.
  await db.transaction((q) => settle(roster.map((r) => ({ ...r, today: dayInZone(zones.get(r.studentId)!) })), records, q));
  return {
    klass,
    today,
    contest: contestLabel(klass.contestName, klass.contestDay, today),
    assignments: assigned.filter((a) => FORMULA_BY_ID[a.formulaId]).sort((a, b) => a.week - b.week || a.day - b.day),
    students: roster.map((r) => ({ id: r.studentId, name: r.name, isYou: false, ...records.get(r.studentId)! })),
  };
}

/** Give every enrolled student a card for a newly assigned formula. */
export async function addAssignedCards(q: Tx, studentIds: string[], formulaIds: string[], today: number) {
  if (!studentIds.length || !formulaIds.length) return;
  const existing = await q
    .select({ studentId: cards.studentId, formulaId: cards.formulaId, source: cards.source })
    .from(cards)
    .where(and(inArray(cards.studentId, studentIds), inArray(cards.formulaId, formulaIds)));
  const has = new Map(existing.map((c) => [`${c.studentId}:${c.formulaId}`, c.source]));
  const fresh = [];
  for (const studentId of studentIds)
    for (const formulaId of formulaIds) {
      const source = has.get(`${studentId}:${formulaId}`);
      if (source === "self")
        await q
          .update(cards)
          .set({ source: "teacher" })
          .where(and(eq(cards.studentId, studentId), eq(cards.formulaId, formulaId)));
      else if (!source) {
        const c = newCard(formulaId, "teacher", today);
        fresh.push({ studentId, formulaId, source: c.source, stage: c.stage, memory: c.memory, addedDay: c.addedDay });
      }
    }
  if (fresh.length) await q.insert(cards).values(fresh);
}
