import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./client";
import { plans, studentPlans } from "./schema";

// Prices match the "For users" page on the main site (Lemmory/lib/pricing.ts).
// Checkout is simulated: nothing is charged until a payment provider is connected.

export type PlanKind = "pilot" | "academy" | "club";

export const PRICES = {
  academy: { label: "Academy", perStudent: 3, body: "For programs that run paid classes. $3 per student in your classes, each month." },
  club: { label: "School math club", perStudent: 3, classCap: 40, body: "For free clubs run at a school. $3 per student, never more than $40 per class a month." },
  student: { label: "Individual", monthly: 2, body: "Your own deck and daily review, with the full formula bank." },
} as const;

export const PILOT_DAYS = 14;

/**
 * Monthly cost, or null during a pilot. Academies pay per student, counting a student in
 * two of their classes once. Verified clubs pay per student with a cap on each class.
 * A club pays academy prices until the school confirms it.
 */
export function monthlyCost(kind: PlanKind, clubVerified: boolean, classSizes: number[], uniqueStudents: number) {
  if (kind === "pilot") return null;
  if (kind === "club" && clubVerified)
    return classSizes.reduce((sum, n) => sum + Math.min(n * PRICES.club.perStudent, PRICES.club.classCap), 0);
  return uniqueStudents * PRICES.academy.perStudent;
}

// Personal email providers can't show a school affiliation.
const PERSONAL_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "aol.com", "proton.me", "protonmail.com", "live.com", "me.com"];

/** Null if the address could belong to a school; otherwise why not. */
export function schoolEmailProblem(email: string) {
  const m = /^[^\s@]+@([^\s@]+\.[^\s@]+)$/.exec(email.trim().toLowerCase());
  if (!m) return "Enter a valid email.";
  if (PERSONAL_DOMAINS.includes(m[1])) return "Use your school email address, not a personal one.";
  return null;
}

export async function getPlan(teacherId: string) {
  return (await db.select().from(plans).where(eq(plans.teacherId, teacherId)).get()) ?? null;
}

type PlanRow = typeof plans.$inferSelect;

/**
 * Where a teacher's plan stands right now:
 * - "none": hasn't picked a plan yet
 * - "pilot": on the free pilot (or a club waiting to be verified), until `endsAt`
 * - "active": paid academy, or a verified club
 * - "expired": the pilot ran out (or the club wasn't confirmed) and nothing's paid
 */
export function planState(plan: PlanRow | null, now = new Date()): { state: "none" | "pilot" | "active" | "expired"; endsAt: Date | null } {
  if (!plan) return { state: "none", endsAt: null };
  if (plan.kind === "academy" && plan.paidAt) return { state: "active", endsAt: null };
  if (plan.kind === "club" && plan.clubStatus === "verified") return { state: "active", endsAt: null };
  if (plan.kind === "club" && plan.clubStatus === "rejected") return { state: "expired", endsAt: plan.pilotEndsAt };
  const live = !!plan.pilotEndsAt && plan.pilotEndsAt > now;
  return { state: live ? "pilot" : "expired", endsAt: plan.pilotEndsAt };
}

/** A teacher gets one free pilot. Its end date is kept even after they switch plans. */
export const pilotUsed = (plan: PlanRow | null) => !!plan?.pilotEndsAt;

async function save(teacherId: string, values: Partial<typeof plans.$inferInsert> & { kind: PlanKind }) {
  // Keep the pilot's end date across plan changes, so the pilot can't be restarted.
  const existing = await getPlan(teacherId);
  const row = { paidAt: null, orgName: null, schoolEmail: null, clubStatus: null, pilotEndsAt: existing?.pilotEndsAt ?? null, ...values };
  await db
    .insert(plans)
    .values({ teacherId, ...row })
    .onConflictDoUpdate({ target: plans.teacherId, set: row });
}

const pilotEnd = () => new Date(Date.now() + PILOT_DAYS * 86_400_000);

/** Start the one free pilot. Returns false if this teacher already had it. */
export async function startPilot(teacherId: string) {
  if (pilotUsed(await getPlan(teacherId))) return false;
  await save(teacherId, { kind: "pilot", pilotEndsAt: pilotEnd() });
  return true;
}

/** Simulated checkout for an academy. */
export async function checkoutAcademy(teacherId: string, orgName: string) {
  await save(teacherId, { kind: "academy", orgName, paidAt: new Date() });
}

/**
 * A school club asks for club pricing. It stays pending, on a free pilot, until someone
 * confirms the club with the school (scripts/verify-club.ts).
 */
export async function requestClub(teacherId: string, orgName: string, schoolEmail: string) {
  // While the school is being checked, the club runs on its pilot (starting one if needed).
  const existing = await getPlan(teacherId);
  await save(teacherId, {
    kind: "club",
    orgName,
    schoolEmail: schoolEmail.trim().toLowerCase(),
    clubStatus: "pending",
    pilotEndsAt: existing?.pilotEndsAt ?? pilotEnd(),
  });
}

/** Can students in this teacher's classes do their reviews? */
export async function teacherActive(teacherId: string) {
  const { state } = planState(await getPlan(teacherId));
  return state === "active" || state === "pilot";
}

export async function getStudentPlan(studentId: string) {
  return (await db.select().from(studentPlans).where(eq(studentPlans.studentId, studentId)).get()) ?? null;
}

/** Simulated checkout for an individual student. */
export async function checkoutStudent(studentId: string) {
  await db.insert(studentPlans).values({ studentId, paidAt: new Date() }).onConflictDoNothing();
}
