import "server-only";
import { and, eq, gt } from "drizzle-orm";
import { db } from "./client";
import { newId, sha256 } from "./password";
import { plans, studentPlans, trialClaims } from "./schema";
import { PRICES as SHARED_PRICES, TRIAL_DAYS, TRIALS_PER_NETWORK } from "@lemmory/core/plans";

// The numbers live in packages/core/src/plans.ts, shared with the main site's pricing page.
// Checkout is simulated: nothing is charged until a payment provider is connected.

export type PlanKind = "academy" | "club";

const { academy, club, student } = SHARED_PRICES;

export const PRICES = {
  academy: { label: "Academy", ...academy, body: `For programs that run paid classes. $${academy.perStudent} per student in your classes, each month.` },
  club: { label: "School math club", ...club, body: `For free clubs run at a school. $${club.perStudent} per student, never over $${club.classCap} a month per class.` },
  student: { label: "Individual", ...student, body: "Your own deck and daily review, with the full formula bank." },
} as const;

export { TRIAL_DAYS };

/**
 * Where a plan stands right now:
 * - "none": hasn't started a trial or paid yet
 * - "trial": on the free trial, until `endsAt`
 * - "active": paid
 * - "expired": the trial ran out and nothing's paid. Everything is locked until they pay.
 */
export type PlanState = { state: "none" | "trial" | "active" | "expired"; endsAt: Date | null };

function stateOf(trialEndsAt: Date | null, paidAt: Date | null, now: Date): PlanState {
  if (paidAt) return { state: "active", endsAt: null };
  if (!trialEndsAt) return { state: "none", endsAt: null };
  return { state: trialEndsAt > now ? "trial" : "expired", endsAt: trialEndsAt };
}

const trialEnd = () => new Date(Date.now() + TRIAL_DAYS * 86_400_000);

/** Whole days left on a trial (at least 1 while it's running), or null if it isn't on a trial. */
export function trialDaysLeft({ state, endsAt }: PlanState, now = new Date()) {
  return state === "trial" && endsAt ? Math.max(1, Math.ceil((endsAt.getTime() - now.getTime()) / 86_400_000)) : null;
}

// ── Monthly cost ──

/**
 * Monthly cost. Academies pay per student, counting a student in two of their classes once.
 * Verified clubs pay per student with a cap on each class. A club pays academy prices until
 * the school confirms it.
 */
export function monthlyCost(kind: PlanKind, clubVerified: boolean, classSizes: number[], uniqueStudents: number) {
  if (kind === "club" && clubVerified)
    return classSizes.reduce((sum, n) => sum + Math.min(n * PRICES.club.perStudent, PRICES.club.classCap), 0);
  return uniqueStudents * PRICES.academy.perStudent;
}

// Personal email providers can't show a school affiliation.
const PERSONAL_DOMAINS = ["gmail.com", "googlemail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "aol.com", "proton.me", "protonmail.com", "live.com", "me.com"];

/** Null if the address could belong to a school; otherwise why not. */
export function schoolEmailProblem(email: string) {
  const m = /^[^\s@]+@([^\s@]+\.[^\s@]+)$/.exec(email.trim().toLowerCase());
  if (!m) return "Enter a valid email.";
  if (PERSONAL_DOMAINS.includes(m[1])) return "Use your school email address, not a personal one.";
  return null;
}

// ── One free trial per person ──

/** What identifies whoever is starting a trial. The app reads these from the request. */
export interface TrialSource {
  /** Teachers' sign-in email. Students have none. */
  email?: string;
  /** A long-lived random id kept in a cookie in this browser. */
  device?: string;
  /** The request's IP address, when the host provides one. */
  ip?: string;
}

/**
 * The same inbox under another spelling counts as the same email: "ryan+2@gmail.com" and
 * "r.yan@gmail.com" are both "ryan@gmail.com".
 */
export function normalizeEmail(email: string) {
  const [local = "", domain = ""] = email.trim().toLowerCase().split("@");
  const base = local.split("+")[0];
  const gmail = domain === "gmail.com" || domain === "googlemail.com";
  return `${gmail ? base.replace(/\./g, "") : base}@${gmail ? "gmail.com" : domain}`;
}

const hashes = (source: TrialSource) =>
  ([
    ["email", source.email && normalizeEmail(source.email)],
    ["device", source.device],
    ["ip", source.ip],
  ] as const)
    .filter((x): x is readonly ["email" | "device" | "ip", string] => !!x[1])
    .map(([kind, value]) => ({ kind, hash: sha256(`lemmory-trial:${kind}:${value}`) }));

/** Null if this person can start a free trial; otherwise why not. */
export async function trialProblem(role: "teacher" | "student", source: TrialSource) {
  for (const { kind, hash } of hashes(source)) {
    const since = kind === "ip" ? new Date(Date.now() - TRIALS_PER_NETWORK.days * 86_400_000) : new Date(0);
    const rows = await db
      .select({ id: trialClaims.id })
      .from(trialClaims)
      .where(and(eq(trialClaims.role, role), eq(trialClaims.kind, kind), eq(trialClaims.hash, hash), gt(trialClaims.createdAt, since)))
      .limit(TRIALS_PER_NETWORK.count);
    if (kind === "email" && rows.length) return "This email address has already had a free trial.";
    if (kind === "device" && rows.length) return "A free trial was already started from this browser.";
    if (kind === "ip" && rows.length >= TRIALS_PER_NETWORK.count) return "Too many free trials have been started from this network recently.";
  }
  return null;
}

async function claimTrial(role: "teacher" | "student", source: TrialSource) {
  const rows = hashes(source).map((h) => ({ id: newId(), role, ...h }));
  if (rows.length) await db.insert(trialClaims).values(rows);
}

// ── Teachers ──

type PlanRow = typeof plans.$inferSelect;

export async function getPlan(teacherId: string) {
  return (await db.select().from(plans).where(eq(plans.teacherId, teacherId)).get()) ?? null;
}

export const planState = (plan: PlanRow | null, now = new Date()): PlanState =>
  stateOf(plan?.pilotEndsAt ?? null, plan?.paidAt ?? null, now);

/** Start the free trial of the plan the teacher picked. Returns why not, if they can't have one. */
export async function startTrial(teacherId: string, kind: PlanKind, source: TrialSource) {
  if (await getPlan(teacherId)) return "You've already started a plan.";
  const problem = await trialProblem("teacher", source);
  if (problem) return problem;
  await db.insert(plans).values({ teacherId, kind, pilotEndsAt: trialEnd() });
  await claimTrial("teacher", source);
  return null;
}

export interface OrgInfo {
  orgName: string;
  orgLocation: string;
  /** Academies: who gets the bills. */
  billingName?: string;
  billingEmail?: string;
  /** Clubs: an address at the school, so we can confirm the club. */
  schoolEmail?: string;
}

/**
 * Simulated checkout. It records the academy's or school's details and marks the plan paid.
 * A club's price stays at the academy rate until someone confirms it with the school
 * (scripts/verify-club.ts). The trial's end date is kept, so it can't be restarted.
 */
export async function checkoutTeacher(teacherId: string, kind: PlanKind, info: OrgInfo) {
  const existing = await getPlan(teacherId);
  const row = {
    kind,
    orgName: info.orgName,
    orgLocation: info.orgLocation,
    billingName: info.billingName ?? null,
    billingEmail: info.billingEmail?.toLowerCase() ?? null,
    schoolEmail: kind === "club" ? (info.schoolEmail?.trim().toLowerCase() ?? null) : null,
    clubStatus: kind === "club" ? ("pending" as const) : null,
    pilotEndsAt: existing?.pilotEndsAt ?? null,
    paidAt: new Date(),
  };
  await db.insert(plans).values({ teacherId, ...row }).onConflictDoUpdate({ target: plans.teacherId, set: row });
}

/** Can this teacher (and the students in their classes) use Lemmory right now? */
export async function teacherActive(teacherId: string) {
  const { state } = planState(await getPlan(teacherId));
  return state === "active" || state === "trial";
}

// ── Students on their own ──

type StudentPlanRow = typeof studentPlans.$inferSelect;

export async function getStudentPlan(studentId: string) {
  return (await db.select().from(studentPlans).where(eq(studentPlans.studentId, studentId)).get()) ?? null;
}

export const studentPlanState = (plan: StudentPlanRow | null, now = new Date()): PlanState =>
  stateOf(plan?.trialEndsAt ?? null, plan?.paidAt ?? null, now);

/** Start a student's free trial of the individual plan. Returns why not, if they can't have one. */
export async function startStudentTrial(studentId: string, source: TrialSource) {
  if (await getStudentPlan(studentId)) return "You've already started the individual plan.";
  const problem = await trialProblem("student", source);
  if (problem) return problem;
  await db.insert(studentPlans).values({ studentId, trialEndsAt: trialEnd() });
  await claimTrial("student", source);
  return null;
}

/** Simulated checkout for the individual plan, with a parent or guardian for the receipt. */
export async function checkoutStudent(studentId: string, billingName: string, billingEmail: string) {
  const row = { paidAt: new Date(), billingName, billingEmail: billingEmail.toLowerCase() };
  await db.insert(studentPlans).values({ studentId, ...row }).onConflictDoUpdate({ target: studentPlans.studentId, set: row });
}
