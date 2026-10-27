import "server-only";
import { and, eq, sql } from "drizzle-orm";
import { FORMULA_BY_ID } from "@lemmory/core/formulas";
import { type LeaderRow, leaderRows } from "@lemmory/core/analytics";
import {
  type Outcome,
  type PickResult,
  type Prompt,
  type RecallResult,
  type SolveResult,
  applyPrompt,
  checkPick,
  checkRecall,
  checkSolve,
  problemOf,
  recallPrompt,
  wrongPicks,
} from "@lemmory/core/grading";
import { LOG_DAYS, type StudentRecord } from "@lemmory/core/records";
import { type DaySession, buildQueue, emptySession, isDoneToday, newCards, nothingDue, recordAttempt } from "@lemmory/core/session";
import { isNew } from "@lemmory/core/srs";
import { type StarterLevel, starterDeck } from "@lemmory/core/starter";
import { getStudentPlan, isOpen, planState, studentPlanState } from "./billing";
import { db, type Tx } from "./client";
import { addAssignedCards, classToday, loadClass, loadRecords, pickZone, settle, settleIfBehind, studentToday, studentZones } from "./records";
import { dayInZone } from "@lemmory/core/days";
import { assignments, cards, classes, dailyScores, days, enrollments, plans, reviewSessions, reviews, users } from "./schema";

export type Mode = "review" | "practice";

export class ReviewError extends Error {}

export interface StudentView {
  me: { id: string; name: string; username: string | null };
  /** The class being shown (the leaderboard and contest are per class). */
  klass: { id: string; name: string; contest: string | null; teacher: string } | null;
  /** Every class the student is in, for the class switcher. */
  classes: { id: string; name: string }[];
  today: number;
  /** The time zone "today" follows, so an open page can tell when the day changes. */
  zone: string;
  record: StudentRecord;
  assigned: string[];
  leaderboard: LeaderRow[];
  gameAge: number;
  /** Today's remaining cards, in order. */
  queue: string[];
  /** How many of today's cards are done (for the progress bar). */
  completedToday: number;
  doneToday: boolean;
  nothingDue: boolean;
  /** False when nothing covers the student (no trial or payment of their own, no active class): the app is locked. */
  canReview: boolean;
}

/**
 * Can this student use Lemmory? Yes if their own individual plan is on its free trial or
 * paid, or if any of their classes' teachers is. Otherwise everything but the plan page is locked.
 */
export async function canStudentReview(studentId: string) {
  const [plan, covered] = await Promise.all([getStudentPlan(studentId), classCovers(studentId)]);
  return isOpen(studentPlanState(plan)) || covered;
}

/** Is any of the student's classes on a teacher's trial or paid plan? (One query: this runs on every answer.) */
export async function classCovers(studentId: string) {
  const teacherPlans = await db
    .select({ pilotEndsAt: plans.pilotEndsAt, paidAt: plans.paidAt })
    .from(enrollments)
    .innerJoin(classes, eq(classes.id, enrollments.classId))
    .innerJoin(plans, eq(plans.teacherId, classes.teacherId))
    .where(eq(enrollments.studentId, studentId));
  return teacherPlans.some((p) => isOpen(planState(p)));
}

/** The student's classes, oldest first. */
export async function studentClasses(studentId: string, q: Tx | typeof db = db) {
  return q
    .select({ id: classes.id, name: classes.name, timezone: classes.timezone, teacherId: classes.teacherId, settledThrough: enrollments.settledThrough })
    .from(enrollments)
    .innerJoin(classes, eq(classes.id, enrollments.classId))
    .where(eq(enrollments.studentId, studentId))
    .orderBy(enrollments.joinedDay, classes.createdAt);
}

/**
 * Everything the student app shows, with their classes settled through yesterday.
 * `selected` picks which class's leaderboard and contest to show (default: the first).
 * The queue and "today" follow the student's own clock; the class's game and contest follow the class's.
 */
export async function loadStudentView(user: { id: string; name: string; username: string | null }, selected?: string): Promise<StudentView> {
  const mine = await studentClasses(user.id);
  const current = mine.find((c) => c.id === selected) ?? mine[0];
  if (!current) await settleSolo(user.id);
  const [view, zones, canReview] = await Promise.all([
    // Classmates appear only on the leaderboard, so their review logs aren't loaded.
    current ? loadClass(current.id, false) : null,
    studentZones([user.id]),
    canStudentReview(user.id),
  ]);
  const zone = zones.get(user.id)!;
  const today = dayInZone(zone);
  const classList = mine.map((c) => ({ id: c.id, name: c.name }));
  // Loaded after the class, which settled this student's past days.
  const [records, saved, teacher] = await Promise.all([
    loadRecords([user.id], today - LOG_DAYS),
    savedSession(db, user.id),
    view ? db.select({ name: users.name }).from(users).where(eq(users.id, view.klass.teacherId)).get() : null,
  ]);
  const record = records.get(user.id)!;
  const session = sessionOn(saved, today);
  const done = isDoneToday(record, today);
  const base = {
    me: user,
    classes: classList,
    today,
    zone,
    record,
    queue: done ? [] : buildQueue(record.cards, session, today),
    completedToday: session.completed.length,
    doneToday: done,
    canReview,
    nothingDue: nothingDue(record, today),
  };
  // Not in a class: the individual plan (trial or paid) covers them.
  if (!view) return { ...base, klass: null, assigned: [], leaderboard: [], gameAge: 0 };

  const { klass, students } = view;
  return {
    ...base,
    klass: { id: klass.id, name: klass.name, contest: view.contest, teacher: teacher?.name ?? "" },
    assigned: view.assignments.map((a) => a.formulaId),
    leaderboard: leaderRows(students, { day: klass.gameDay, baseline: klass.gameBaseline }, view.today, user.id),
    gameAge: view.today - klass.gameDay,
  };
}

/** A student in no class: record their past days too (a class's page load does it for its students). */
async function settleSolo(studentId: string) {
  const [row, today] = await Promise.all([
    db.select({ settledThrough: users.settledThrough }).from(users).where(eq(users.id, studentId)).get(),
    studentToday(studentId),
  ]);
  // First visit since this was tracked: start from yesterday.
  if (row?.settledThrough == null) return db.update(users).set({ settledThrough: today - 1 }).where(eq(users.id, studentId));
  if (row.settledThrough >= today - 1) return;
  await settleIfBehind([{ studentId, classId: null, settledThrough: row.settledThrough, today }], await loadRecords([studentId], null, db, false));
}

const savedSession = (q: Tx | typeof db, studentId: string) => q.select().from(reviewSessions).where(eq(reviewSessions.studentId, studentId)).get();

/** Today's session from the saved row (a session saved on an earlier day is over). */
const sessionOn = (row: { data: DaySession } | undefined, today: number): DaySession => (row && row.data.day === today ? row.data : emptySession(today));

async function saveSession(q: Tx, studentId: string, data: DaySession) {
  await q.insert(reviewSessions).values({ studentId, data }).onConflictDoUpdate({ target: reviewSessions.studentId, set: { data } });
}

/**
 * One student's state, settled through yesterday by their own clock. The reads are sent
 * together, so they take one trip to the database. Inside a transaction (`q`), it settles
 * there; without one, it opens a transaction only if there are past days to fill in.
 */
async function context(studentId: string, q?: Tx) {
  const [mine, own, records, saved] = await Promise.all([
    studentClasses(studentId, q),
    (q ?? db).select({ timezone: users.timezone, settledThrough: users.settledThrough }).from(users).where(eq(users.id, studentId)).get(),
    loadRecords([studentId], null, q, false),
    savedSession(q ?? db, studentId),
  ]);
  const today = dayInZone(pickZone(own?.timezone, mine[0]?.timezone));
  const rows: Parameters<typeof settle>[0] = mine.map((c) => ({ studentId, classId: c.id, settledThrough: c.settledThrough, today }));
  // In no class: settled on the user row (it starts on their first page load, see settleSolo).
  if (!mine.length && own?.settledThrough != null) rows.push({ studentId, classId: null, settledThrough: own.settledThrough, today });
  await (q ? settle(rows, records, q) : settleIfBehind(rows, records));
  return { today, record: records.get(studentId)!, session: sessionOn(saved, today) };
}

function formula(id: string) {
  const f = FORMULA_BY_ID[id];
  if (!f) throw new ReviewError("Unknown formula");
  return f;
}

/** The card to show next. In review mode it must be one of today's cards. */
export async function promptFor(studentId: string, formulaId: string, mode: Mode): Promise<Prompt> {
  const f = formula(formulaId);
  if (!(await canStudentReview(studentId))) throw new ReviewError("Your free trial has ended. Go to Plan & classes to keep going.");
  return db.transaction(async (q) => {
    const { today, record, session } = await context(studentId, q);
    const card = record.cards[formulaId];
    if (!card) throw new ReviewError("That formula isn't in your deck.");
    if (mode === "review" && !buildQueue(record.cards, session, today).includes(formulaId)) throw new ReviewError("That card isn't due today.");
    if (mode === "practice" && (isNew(card) || buildQueue(record.cards, session, today).includes(formulaId)))
      throw new ReviewError("Do this card in today's review first.");
    if (card.stage === "recall") return recallPrompt(f);
    const deck = Object.keys(record.cards);
    if (mode === "practice") return applyPrompt(f, [], deck);
    const row = await q.select({ last: cards.lastProblemId }).from(cards).where(and(eq(cards.studentId, studentId), eq(cards.formulaId, formulaId))).get();
    // A card that comes back today (after a miss) gets a problem it hasn't shown yet, at random.
    const shownToday = session.shown?.[formulaId] ?? [];
    const prompt = applyPrompt(f, [...(row?.last ? [row.last] : []), ...shownToday], deck);
    await Promise.all([
      q.update(cards).set({ lastProblemId: prompt.problemId }).where(and(eq(cards.studentId, studentId), eq(cards.formulaId, formulaId))),
      saveSession(q, studentId, {
        ...session,
        problems: { ...session.problems, [formulaId]: prompt.problemId },
        shown: { ...session.shown, [formulaId]: [...shownToday, prompt.problemId] },
      }),
    ]);
    return prompt;
  });
}

/**
 * Record an attempt. Only the first attempt each day goes to the scheduler; a miss
 * stays in today's queue until it's right. Finishing the last card marks the day done.
 */
async function record(q: Tx, studentId: string, ctx: Awaited<ReturnType<typeof context>>, formulaId: string, correct: boolean, confusedWith?: string[]): Promise<Outcome> {
  const { today, record: rec, session: ses } = ctx;
  const card = rec.cards[formulaId];
  const { session: done, done: result } = recordAttempt(ses, card, correct, today, confusedWith);
  if (!result) {
    await saveSession(q, studentId, done);
    return { formulaName: FORMULA_BY_ID[formulaId].name, promoted: false, finished: false };
  }
  const { card: updated, promoted, entry } = result;
  const inserted = await q
    .insert(reviews)
    .values({
      studentId,
      day: today,
      formulaId,
      stage: entry.stage,
      firstTry: entry.firstTry,
      confusedWith: entry.confusedWith ?? null,
      extra: !!entry.extra,
    })
    .onConflictDoNothing()
    .returning({ id: reviews.id });
  // Already finished today by another request sent at the same moment (a double click, a second
  // tab): that one counts, this one changes nothing, so the card isn't scheduled or scored twice.
  if (!inserted.length) return { formulaName: FORMULA_BY_ID[formulaId].name, promoted: false, finished: false };
  const finished = buildQueue({ ...rec.cards, [formulaId]: updated }, done, today).length === 0;
  // Sent together: one trip to the database.
  await Promise.all([
    // Points come from these daily totals, so keep them in step with the log (self-added cards earn none).
    card.source !== "self" &&
      q
        .insert(dailyScores)
        .values({ studentId, day: today, n: 1 })
        .onConflictDoUpdate({ target: [dailyScores.studentId, dailyScores.day], set: { n: sql`${dailyScores.n} + 1` } }),
    q
      .update(cards)
      .set({ stage: updated.stage, memory: updated.memory })
      .where(and(eq(cards.studentId, studentId), eq(cards.formulaId, formulaId))),
    saveSession(q, studentId, done),
    finished &&
      q
        .insert(days)
        .values({ studentId, day: today, done: true, missed: 0 })
        .onConflictDoUpdate({ target: [days.studentId, days.day], set: { done: true, missed: 0 } }),
  ]);
  return { formulaName: FORMULA_BY_ID[formulaId].name, promoted, finished };
}

function assertDue(ctx: Awaited<ReturnType<typeof context>>, formulaId: string) {
  if (!buildQueue(ctx.record.cards, ctx.session, ctx.today).includes(formulaId)) throw new ReviewError("That card isn't due today.");
}

/**
 * Practice shows the right answer after each try and isn't recorded, so it only works on cards
 * already in the deck and reviewed, and never on one still waiting in today's review. Otherwise a
 * student could look up today's answers in practice first.
 */
async function assertPractice(studentId: string, formulaId: string) {
  // Only reads (unless past days need filling in), so no transaction to hold the write lock.
  const ctx = await context(studentId);
  const card = ctx.record.cards[formulaId];
  if (!card || isNew(card)) throw new ReviewError("Practice cards you've already reviewed.");
  if (buildQueue(ctx.record.cards, ctx.session, ctx.today).includes(formulaId)) throw new ReviewError("Do this card in today's review first.");
}

export async function answerRecall(
  studentId: string,
  formulaId: string,
  inputs: string[],
  mode: Mode,
  /** Practice only: the free typo retry was already used (practice isn't recorded, so the browser keeps track). */
  typoUsed = false,
): Promise<{ result: RecallResult; outcome: Outcome | null }> {
  const f = formula(formulaId);
  if (mode === "practice") {
    await assertPractice(studentId, formulaId);
    return { result: checkRecall(f, inputs, !typoUsed), outcome: null };
  }
  return db.transaction(async (q) => {
    const ctx = await context(studentId, q);
    assertDue(ctx, formulaId);
    if (ctx.record.cards[formulaId].stage !== "recall") throw new ReviewError("That card is in application mode.");
    const result = checkRecall(f, inputs, !ctx.session.typoOffered.includes(formulaId));
    if (result.status === "typo") {
      await saveSession(q, studentId, { ...ctx.session, typoOffered: [...ctx.session.typoOffered, formulaId] });
      return { result, outcome: null };
    }
    return { result, outcome: await record(q, studentId, ctx, formulaId, result.results.every(Boolean)) };
  });
}

async function issuedProblem(studentId: string, formulaId: string, problemId: string, mode: Mode) {
  const f = formula(formulaId);
  const problem = problemOf(f, problemId);
  if (!problem) throw new ReviewError("Unknown problem");
  if (mode === "review") {
    const [today, saved] = await Promise.all([studentToday(studentId), savedSession(db, studentId)]);
    const session = sessionOn(saved, today);
    if (session.problems[formulaId] !== problemId) throw new ReviewError("That problem wasn't handed out today.");
  } else await assertPractice(studentId, formulaId);
  return problem;
}

/** Step 1 of an application card. A wrong pick ends the card: it's recorded as a miss and comes back later. */
export async function answerPick(
  studentId: string,
  formulaId: string,
  problemId: string,
  picked: string[],
  mode: Mode,
): Promise<{ result: PickResult; outcome: Outcome | null }> {
  const problem = await issuedProblem(studentId, formulaId, problemId, mode);
  const result = checkPick(problem, picked, FORMULA_BY_ID);
  if (result.right || mode === "practice") return { result, outcome: null };
  return db.transaction(async (q) => {
    const ctx = await context(studentId, q);
    assertDue(ctx, formulaId);
    return { result, outcome: await record(q, studentId, ctx, formulaId, false, wrongPicks(problem, picked)) };
  });
}

export async function answerSolve(
  studentId: string,
  formulaId: string,
  problemId: string,
  picked: string[],
  input: string,
  mode: Mode,
): Promise<{ result: SolveResult; outcome: Outcome | null }> {
  const problem = await issuedProblem(studentId, formulaId, problemId, mode);
  const pick = checkPick(problem, picked, FORMULA_BY_ID);
  const result = checkSolve(problem, input);
  if (mode === "practice") return { result, outcome: null };
  return db.transaction(async (q) => {
    const ctx = await context(studentId, q);
    assertDue(ctx, formulaId);
    const wrong = wrongPicks(problem, picked);
    return { result, outcome: await record(q, studentId, ctx, formulaId, pick.right && result.right, wrong.length ? wrong : undefined) };
  });
}

/** Mark today done when there's nothing left in the queue. */
export async function finishIfEmpty(studentId: string) {
  await db.transaction(async (q) => {
    const ctx = await context(studentId, q);
    if (buildQueue(ctx.record.cards, ctx.session, ctx.today).length) return;
    await q.insert(days).values({ studentId, day: ctx.today, done: true, missed: 0 }).onConflictDoNothing();
  });
}

export async function addToDeck(studentId: string, formulaId: string) {
  formula(formulaId);
  await addOwnCards(studentId, [formulaId]);
}

/** Cards a student adds themselves, spread out after the new ones already waiting (see newCards). */
async function addOwnCards(studentId: string, formulaIds: string[]) {
  const [today, deck] = await Promise.all([studentToday(studentId), loadRecords([studentId], null, db, false)]);
  const have = deck.get(studentId)!.cards;
  const ids = formulaIds.filter((id) => !have[id]);
  if (!ids.length) return;
  const rows = newCards(Object.values(have), ids, "self", today).map((c) => ({
    studentId,
    formulaId: c.formulaId,
    source: "self" as const,
    stage: c.stage,
    memory: c.memory,
    addedDay: c.addedDay,
  }));
  await db.insert(cards).values(rows).onConflictDoNothing();
}

/** A first deck for a student on their own (see core/starter.ts). Formulas already in the deck are kept as they are. */
export async function addStarterDeck(studentId: string, level: StarterLevel) {
  await addOwnCards(studentId, starterDeck(level));
}

/** Only cards the student added themselves can be removed. */
export async function removeFromDeck(studentId: string, formulaId: string) {
  await db.delete(cards).where(and(eq(cards.studentId, studentId), eq(cards.formulaId, formulaId), eq(cards.source, "self")));
}

export async function findClassByCode(code: string) {
  return db
    .select({ id: classes.id, name: classes.name, timezone: classes.timezone, teacher: users.name })
    .from(classes)
    .innerJoin(users, eq(users.id, classes.teacherId))
    .where(eq(classes.joinCode, code.trim().toUpperCase()))
    .get();
}

/** Join another class (students can be in several). Its assigned formulas join the student's deck. */
export async function joinClass(studentId: string, classId: string) {
  await db.transaction(async (q) => {
    const klass = await q.select().from(classes).where(eq(classes.id, classId)).get();
    if (!klass) throw new ReviewError("Class not found");
    const today = classToday(klass);
    await q
      .insert(enrollments)
      .values({ studentId, classId, joinedDay: today, settledThrough: today - 1 })
      .onConflictDoNothing();
    const assigned = await q.select({ formulaId: assignments.formulaId }).from(assignments).where(eq(assignments.classId, classId));
    await addAssignedCards(
      q,
      [studentId],
      assigned.map((a) => a.formulaId).filter((id) => FORMULA_BY_ID[id]),
      today,
    );
  });
}
