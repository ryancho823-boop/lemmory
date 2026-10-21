"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { refresh, revalidatePath } from "next/cache";
import { checkLogin, createStudent, deleteAccount, setTimezone } from "@lemmory/db/accounts";
import { isTimeZone } from "@lemmory/core/days";
import { currentUser, endSession, requester, startSession, trialSource } from "@lemmory/db/auth";
import { LIMIT_MESSAGE, isLimited, noteAttempt } from "@lemmory/db/limits";
import { PASSWORD_MIN } from "@lemmory/db/password";
import { checkoutStudent, startStudentTrial } from "@lemmory/db/billing";
import {
  type Mode,
  ReviewError,
  addToDeck,
  answerPick,
  canStudentReview,
  answerRecall,
  answerSolve,
  findClassByCode,
  finishIfEmpty,
  joinClass,
  studentClasses,
  promptFor,
  removeFromDeck,
} from "@lemmory/db/student";

// Server actions are public endpoints: every one checks the session and its arguments.

export type FormState = { error?: string; values?: Record<string, string> } | undefined;

async function me() {
  const user = await currentUser("student");
  if (!user) throw new ReviewError("Signed out. Log in again.");
  return user.id;
}

/** The student, if a trial, payment or class covers them. Cards and the deck are locked otherwise. */
async function unlocked() {
  const id = await me();
  if (!(await canStudentReview(id))) throw new ReviewError("Your free trial has ended. Go to Plan & classes to keep going.");
  return id;
}

const str = (v: unknown, max = 200): string => {
  if (typeof v !== "string" || v.length > max) throw new ReviewError("Bad request");
  return v;
};
const strs = (v: unknown, maxItems = 8): string[] => {
  if (!Array.isArray(v) || v.length > maxItems) throw new ReviewError("Bad request");
  return v.map((x) => str(x, 500));
};
const mode = (v: unknown): Mode => {
  if (v !== "review" && v !== "practice") throw new ReviewError("Bad request");
  return v;
};
const field = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
/** The browser's time zone from the sign-up or login form, if it's a real one. */
const zoneField = (fd: FormData) => {
  const tz = field(fd, "timezone");
  return tz && tz.length < 64 && isTimeZone(tz) ? tz : undefined;
};

// ── accounts ──

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const username = field(fd, "username");
  const { ip } = await requester();
  if (await isLimited("loginAccount", `student:${username}`)) return { error: LIMIT_MESSAGE.loginAccount, values: { username } };
  if (await isLimited("loginNetwork", ip)) return { error: LIMIT_MESSAGE.loginNetwork, values: { username } };
  const id = await checkLogin("student", username, String(fd.get("password") ?? ""));
  if (!id) {
    await noteAttempt("loginAccount", `student:${username}`);
    await noteAttempt("loginNetwork", ip);
    // The same answer whether or not the username exists, so logging in can't be used to find out.
    return { error: "That username and password don't match an account.", values: { username } };
  }
  const tz = zoneField(fd);
  if (tz) await setTimezone(id, tz);
  await startSession(id, "student");
  redirect("/");
}

/**
 * Student sign-up. With a class code the student joins that class. "On your own" (own=1)
 * skips the code; they land on My classes to get the individual plan.
 */
export async function signup(_: FormState, fd: FormData): Promise<FormState> {
  const onOwn = fd.get("own") === "1";
  const values = {
    code: field(fd, "code").toUpperCase(),
    firstName: field(fd, "firstName"),
    lastName: field(fd, "lastName"),
    username: field(fd, "username").toLowerCase(),
  };
  const name = `${values.firstName} ${values.lastName}`.trim();
  const password = String(fd.get("password") ?? "");
  const fail = (error: string) => ({ error, values });
  const { ip, device } = await requester();
  if (await isLimited("signup", ip, device)) return fail(LIMIT_MESSAGE.signup);
  if (!onOwn && (await isLimited("classCode", ip, device))) return fail(LIMIT_MESSAGE.classCode);
  const klass = onOwn ? null : await findClassByCode(values.code);
  if (!onOwn && !klass) {
    await noteAttempt("classCode", ip, device);
    return fail("No class has that code. Check with your teacher.");
  }
  if (!values.firstName || !values.lastName || name.length > 60) return fail("Enter your first and last name.");
  if (!/^[a-z0-9_.-]{3,30}$/.test(values.username)) return fail("Usernames are 3–30 letters, numbers, dots, dashes or underscores.");
  if (password.length < PASSWORD_MIN || password.length > 200) return fail(`Passwords need at least ${PASSWORD_MIN} characters.`);
  const id = await createStudent(name, values.username, password, zoneField(fd));
  if (!id) return fail("That username is taken. Try another.");
  await noteAttempt("signup", ip, device);
  if (klass) await joinClass(id, klass.id);
  await startSession(id, "student");
  redirect(klass ? "/" : "/class");
}

const CLASS_COOKIE = "lemmory_class";
const showClass = async (classId: string) =>
  (await cookies()).set(CLASS_COOKIE, classId, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 365 * 86_400 });

/** A signed-in student joins another class, and the app switches to it. */
export async function joinWithCode(_: FormState, fd: FormData): Promise<FormState> {
  const studentId = await me();
  const code = field(fd, "code").toUpperCase();
  const { ip, device } = await requester();
  if (await isLimited("classCode", studentId, ip, device)) return { error: LIMIT_MESSAGE.classCode, values: { code } };
  const klass = await findClassByCode(code);
  if (!klass) {
    await noteAttempt("classCode", studentId, ip, device);
    return { error: "No class has that code. Check with your teacher.", values: { code } };
  }
  await joinClass(studentId, klass.id);
  await showClass(klass.id);
  redirect("/");
}

/** Show a different one of the student's classes (leaderboard, contest). Their deck is shared. */
export async function switchClass(classId: unknown) {
  const studentId = await me();
  const id = str(classId);
  if (!(await studentClasses(studentId)).some((c) => c.id === id)) throw new ReviewError("Not in that class");
  await showClass(id);
  refresh();
}

/** Start the free trial of the individual plan. One per person: see trialProblem in billing. */
export async function startTrialAction(): Promise<FormState> {
  const error = await startStudentTrial(await me(), await trialSource());
  if (error) return { error };
  // The sidebar unlocks too, so re-render the layout, not just the page.
  revalidatePath("/", "layout");
  redirect("/bank");
}

/** Simulated checkout for the individual plan, with a parent or guardian for the receipt. Nothing is charged. */
export async function buyStudentPlan(_: FormState, fd: FormData): Promise<FormState> {
  const values = { billingName: field(fd, "billingName"), billingEmail: field(fd, "billingEmail") };
  if (values.billingName.length < 2 || values.billingName.length > 80) return { error: "Enter a parent or guardian's name.", values };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.billingEmail) || values.billingEmail.length > 200) return { error: "Enter a valid email for the receipt.", values };
  await checkoutStudent(await me(), values.billingName, values.billingEmail);
  revalidatePath("/", "layout");
  redirect("/");
}

/** Delete the student's account and everything in it, after checking their password. */
export async function deleteMyAccount(_: FormState, fd: FormData): Promise<FormState> {
  const user = await currentUser("student");
  if (!user) redirect("/login");
  // Wrong passwords here count toward the same lock as logins.
  const key = `student:${user.username}`;
  if (await isLimited("loginAccount", key)) return { error: LIMIT_MESSAGE.loginAccount };
  if (!(await deleteAccount(user.id, String(fd.get("confirm") ?? "")))) {
    await noteAttempt("loginAccount", key);
    return { error: "That password isn't right." };
  }
  await endSession("student");
  redirect("/login?deleted=1");
}

export async function logout() {
  await endSession("student");
  redirect("/login");
}

// ── review ──

export async function getPrompt(formulaId: unknown, m: unknown) {
  return promptFor(await me(), str(formulaId), mode(m));
}

export async function checkRecall(formulaId: unknown, inputs: unknown, m: unknown, typoUsed: unknown) {
  const r = await answerRecall(await unlocked(), str(formulaId), strs(inputs), mode(m), typoUsed === true);
  if (r.outcome?.finished) refresh();
  return r;
}

export async function checkPick(formulaId: unknown, problemId: unknown, picked: unknown, m: unknown) {
  const r = await answerPick(await unlocked(), str(formulaId), str(problemId), strs(picked), mode(m));
  if (r.outcome?.finished) refresh();
  return r;
}

export async function checkSolve(formulaId: unknown, problemId: unknown, picked: unknown, input: unknown, m: unknown) {
  const r = await answerSolve(await unlocked(), str(formulaId), str(problemId), strs(picked), str(input, 500), mode(m));
  if (r.outcome?.finished) refresh();
  return r;
}

export async function markDone() {
  await finishIfEmpty(await unlocked());
  refresh();
}

// ── deck ──

export async function addCard(formulaId: unknown) {
  await addToDeck(await unlocked(), str(formulaId));
  refresh();
}

export async function removeCard(formulaId: unknown) {
  await removeFromDeck(await unlocked(), str(formulaId));
  refresh();
}
