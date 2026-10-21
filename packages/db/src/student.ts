import "server-only";
import { and, eq } from "drizzle-orm";
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
import { type DaySession, buildQueue, emptySession, isDoneToday, nothingDue } from "@lemmory/core/session";
import { isNew, newCard, review } from "@lemmory/core/srs";
import { getStudentPlan, studentPlanState, teacherActive } from "./billing";
import { db, type Tx } from "./client";
import { addAssignedCards, classToday, loadClass, loadRecords, settle, studentToday } from "./records";
import { assignments, cards, classes, days, enrollments, reviewSessions, reviews, users } from "./schema";

export type Mode = "review" | "practice";

export class ReviewError extends Error {}

export interface StudentView {
  me: { id: string; name: string; username: string | null };
  /** The class being shown (the leaderboard and contest are per class). */
  klass: { id: string; name: string; contest: string | null; teacher: string } | null;
  /** Every class the student is in, for the class switcher. */
  classes: { id: string; name: string }[];
  today: number;
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
  const { state } = studentPlanState(await getStudentPlan(studentId));
  return state === "trial" || state === "active" || (await classCovers(studentId));
}

/** Is any of the student's classes on a teacher's trial or paid plan? */
export async function classCovers(studentId: string) {
  const mine = await studentClasses(studentId);
  for (const teacherId of new Set(mine.map((c) => c.teacherId))) if (await teacherActive(teacherId)) return true;
  return false;
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
  // Classmates appear only on the leaderboard, so their review logs aren't loaded.
  const view = current ? await loadClass(current.id, false) : null;
  const classList = mine.map((c) => ({ id: c.id, name: c.name }));
  const today = await studentToday(user.id);
  // Loaded after the class, which settled this student's past days.
  const record = (await loadRecords([user.id], today - LOG_DAYS)).get(user.id)!;
  const session = await loadSession(user.id, today);
  const done = isDoneToday(record, today);
  const base = {
    me: user,
    classes: classList,
    today,
    record,
    queue: done ? [] : buildQueue(record.cards, session, today),
    completedToday: session.completed.length,
    doneToday: done,
    canReview: await canStudentReview(user.id),
    nothingDue: nothingDue(record, today),
  };
  // Not in a class: the individual plan (trial or paid) covers them.
  if (!view) return { ...base, klass: null, assigned: [], leaderboard: [], gameAge: 0 };

  const { klass, students } = view;
  const teacher = await db.select({ name: users.name }).from(users).where(eq(users.id, klass.teacherId)).get();
  return {
    ...base,
    klass: { id: klass.id, name: klass.name, contest: view.contest, teacher: teacher?.name ?? "" },
    assigned: view.assignments.map((a) => a.formulaId),
    leaderboard: leaderRows(students, { day: klass.gameDay, baseline: klass.gameBaseline }, view.today, user.id),
    gameAge: view.today - klass.gameDay,
  };
}

async function loadSession(studentId: string, today: number, q: Tx | typeof db = db): Promise<DaySession> {
  const row = await q.select().from(reviewSessions).where(eq(reviewSessions.studentId, studentId)).get();
  return row && row.data.day === today ? row.data : emptySession(today);
}

async function saveSession(q: Tx, studentId: string, data: DaySession) {
  await q.insert(reviewSessions).values({ studentId, data }).onConflictDoUpdate({ target: reviewSessions.studentId, set: { data } });
}

/** One student's state inside a transaction, settled through yesterday by their own clock. */
async function context(q: Tx, studentId: string) {
  const mine = await studentClasses(studentId, q);
  const today = await studentToday(studentId, q);
  const records = await loadRecords([studentId], null, q);
  await settle(
    mine.map((c) => ({ studentId, classId: c.id, settledThrough: c.settledThrough, today })),
    records,
    q,
  );
  const record = records.get(studentId)!;
  const session = await loadSession(studentId, today, q);
  return { today, record, session };
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
    const { today, record, session } = await context(q, studentId);
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
    await q.update(cards).set({ lastProblemId: prompt.problemId }).where(and(eq(cards.studentId, studentId), eq(cards.formulaId, formulaId)));
    await saveSession(q, studentId, {
      ...session,
      problems: { ...session.problems, [formulaId]: prompt.problemId },
      shown: { ...session.shown, [formulaId]: [...shownToday, prompt.problemId] },
    });
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
  const isFirst = !(formulaId in ses.attempts);
  const firstTry = isFirst ? correct : ses.attempts[formulaId];
  const next: DaySession = {
    ...ses,
    attempts: { ...ses.attempts, [formulaId]: firstTry },
    confusions: isFirst && confusedWith?.length ? { ...ses.confusions, [formulaId]: confusedWith } : ses.confusions,
    newStarted: isNew(card) && !ses.newStarted.includes(formulaId) ? [...ses.newStarted, formulaId] : ses.newStarted,
  };
  if (!correct) {
    await saveSession(q, studentId, next);
    return { formulaName: FORMULA_BY_ID[formulaId].name, promoted: false, finished: false };
  }
  const { card: updated, promoted } = review(card, firstTry, today);
  await q.insert(reviews).values({
    studentId,
    day: today,
    formulaId,
    stage: card.stage,
    firstTry,
    confusedWith: next.confusions[formulaId] ?? null,
    extra: card.source === "self",
  });
  await q
    .update(cards)
    .set({ stage: updated.stage, memory: updated.memory })
    .where(and(eq(cards.studentId, studentId), eq(cards.formulaId, formulaId)));
  const done: DaySession = { ...next, completed: [...next.completed, formulaId] };
  await saveSession(q, studentId, done);
  const finished = buildQueue({ ...rec.cards, [formulaId]: updated }, done, today).length === 0;
  if (finished)
    await q
      .insert(days)
      .values({ studentId, day: today, done: true, missed: 0 })
      .onConflictDoUpdate({ target: [days.studentId, days.day], set: { done: true, missed: 0 } });
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
  await db.transaction(async (q) => {
    const ctx = await context(q, studentId);
    const card = ctx.record.cards[formulaId];
    if (!card || isNew(card)) throw new ReviewError("Practice cards you've already reviewed.");
    if (buildQueue(ctx.record.cards, ctx.session, ctx.today).includes(formulaId)) throw new ReviewError("Do this card in today's review first.");
  });
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
    const ctx = await context(q, studentId);
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
    const session = await loadSession(studentId, await studentToday(studentId));
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
    const ctx = await context(q, studentId);
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
    const ctx = await context(q, studentId);
    assertDue(ctx, formulaId);
    const wrong = wrongPicks(problem, picked);
    return { result, outcome: await record(q, studentId, ctx, formulaId, pick.right && result.right, wrong.length ? wrong : undefined) };
  });
}

/** Mark today done when there's nothing left in the queue. */
export async function finishIfEmpty(studentId: string) {
  await db.transaction(async (q) => {
    const ctx = await context(q, studentId);
    if (buildQueue(ctx.record.cards, ctx.session, ctx.today).length) return;
    await q.insert(days).values({ studentId, day: ctx.today, done: true, missed: 0 }).onConflictDoNothing();
  });
}

export async function addToDeck(studentId: string, formulaId: string) {
  formula(formulaId);
  const today = await studentToday(studentId);
  const c = newCard(formulaId, "self", today);
  await db
    .insert(cards)
    .values({ studentId, formulaId, source: "self", stage: c.stage, memory: c.memory, addedDay: today })
    .onConflictDoNothing();
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
