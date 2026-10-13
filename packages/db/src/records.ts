// Loading students' review history and keeping their day-by-day record up to date.

import { and, eq, inArray } from "drizzle-orm";
import { FORMULA_BY_ID } from "@lemmory/core/formulas";
import type { Student } from "@lemmory/core/analytics";
import type { LogEntry, StudentRecord } from "@lemmory/core/records";
import { applyDays, settleDays } from "@lemmory/core/session";
import { type Card, newCard } from "@lemmory/core/srs";
import { contestLabel, dayInZone } from "@lemmory/core/days";
import { db, type Tx } from "./client";
import { assignments, cards, classes, days, enrollments, reviews, users } from "./schema";

export type ClassRow = typeof classes.$inferSelect;
type CardRow = typeof cards.$inferSelect;

export const classToday = (c: Pick<ClassRow, "timezone">) => dayInZone(c.timezone);

export function toCard(r: CardRow): Card {
  return { formulaId: r.formulaId, source: r.source, stage: r.stage, memory: r.memory, addedDay: r.addedDay };
}

/** Cards, review log and day history for each student. Formulas no longer in the bank are skipped. */
export async function loadRecords(studentIds: string[], q: Tx | typeof db = db): Promise<Map<string, StudentRecord>> {
  const out = new Map<string, StudentRecord>(studentIds.map((id) => [id, { cards: {}, log: [], doneDays: [], missed: {} }]));
  if (!studentIds.length) return out;
  const [cardRows, reviewRows, dayRows] = await Promise.all([
    q.select().from(cards).where(inArray(cards.studentId, studentIds)),
    q.select().from(reviews).where(inArray(reviews.studentId, studentIds)).orderBy(reviews.id),
    q.select().from(days).where(inArray(days.studentId, studentIds)),
  ]);
  for (const r of cardRows) if (FORMULA_BY_ID[r.formulaId]) out.get(r.studentId)!.cards[r.formulaId] = toCard(r);
  for (const r of reviewRows) {
    if (!FORMULA_BY_ID[r.formulaId]) continue;
    const e: LogEntry = { day: r.day, formulaId: r.formulaId, stage: r.stage, firstTry: r.firstTry };
    if (r.confusedWith?.length) e.confusedWith = r.confusedWith.filter((id) => FORMULA_BY_ID[id]);
    if (r.extra) e.extra = true;
    out.get(r.studentId)!.log.push(e);
  }
  for (const r of dayRows) {
    const rec = out.get(r.studentId)!;
    if (r.done) rec.doneDays.push(r.day);
    rec.missed[r.day] = r.missed;
  }
  for (const rec of out.values()) rec.doneDays.sort((a, b) => a - b);
  return out;
}

/** Record every finished past day for these students (before anything changes their cards). */
export async function settle(
  rows: { studentId: string; classId: string; settledThrough: number }[],
  records: Map<string, StudentRecord>,
  today: number,
  q: Tx | typeof db = db,
) {
  for (const e of rows) {
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

/** Everything about one class, with every student's record settled through yesterday. */
export async function loadClass(classId: string): Promise<ClassView | null> {
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
  const records = await loadRecords(roster.map((r) => r.studentId));
  await settle(roster, records, today);
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
