"use server";

import { redirect } from "next/navigation";
import { refresh, revalidatePath } from "next/cache";
import { dayInZone, isTimeZone, parseDate } from "@lemmory/core/days";
import { changeEmail, changePassword, checkLogin, createTeacher, deleteAccount, requestPasswordReset, resetPasswordWithToken, sendConfirmation } from "@lemmory/db/accounts";
import { setWeeklyReport, unsubscribe } from "@lemmory/db/report";
import { currentUser, endSession, requester, startSession, trialSource } from "@lemmory/db/auth";
import { LIMIT_MESSAGE, isLimited, noteAttempt } from "@lemmory/db/limits";
import { PASSWORD_MIN } from "@lemmory/db/password";
import { type PlanKind, checkoutTeacher, getPlan, planState, schoolEmailProblem, startTrial } from "@lemmory/db/billing";
import {
  type ClassSettings,
  assign,
  createClass,
  deleteClass,
  newClassCode,
  newGame,
  removeStudent,
  startNextWeek,
  unassign,
  updateClass,
  renameTeacher,
} from "@lemmory/db/teacher";

// Server actions are public endpoints: every one checks the session, and the db layer
// checks that the class belongs to this teacher.

export type FormState = { error?: string; ok?: string; values?: Record<string, string> } | undefined;

async function me() {
  const user = await currentUser("teacher");
  if (!user) redirect("/login");
  return user.id;
}

/** The teacher, if their trial or paid plan is running. Classes are locked otherwise. */
async function active() {
  const id = await me();
  const { state } = planState(await getPlan(id));
  if (state !== "trial" && state !== "active") redirect("/plan");
  return id;
}

const str = (v: unknown, max = 200): string => {
  if (typeof v !== "string" || v.length > max) throw new Error("Bad request");
  return v;
};
const field = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── accounts ──

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const email = field(fd, "email");
  const { ip } = await requester();
  // Counted per account and network, so a stranger can't lock a teacher out of their own account.
  if ((await isLimited("loginAccount", `teacher:${email}:${ip}`)) || (await isLimited("loginAccountAny", `teacher:${email}`))) return { error: LIMIT_MESSAGE.loginAccount, values: { email } };
  if (await isLimited("loginNetwork", ip)) return { error: LIMIT_MESSAGE.loginNetwork, values: { email } };
  const id = await checkLogin("teacher", email, String(fd.get("password") ?? ""));
  if (!id) {
    await noteAttempt("loginAccount", `teacher:${email}:${ip}`);
    await noteAttempt("loginAccountAny", `teacher:${email}`);
    await noteAttempt("loginNetwork", ip);
    // The same answer whether or not the email has an account, so logging in can't be used to find out.
    return { error: "That email and password don't match an account.", values: { email } };
  }
  await startSession(id, "teacher");
  redirect("/");
}

export async function signup(_: FormState, fd: FormData): Promise<FormState> {
  const values = { name: field(fd, "name"), email: field(fd, "email").toLowerCase() };
  const password = String(fd.get("password") ?? "");
  const fail = (error: string) => ({ error, values });
  const { ip, device } = await requester();
  if ((await isLimited("signup", device)) || (await isLimited("signupNetwork", ip))) return fail(LIMIT_MESSAGE.signup);
  if (values.name.length < 2 || values.name.length > 60) return fail("Enter the name students know you by, like Ms. Chen.");
  if (!EMAIL.test(values.email) || values.email.length > 200) return fail("Enter a valid email.");
  if (password.length < PASSWORD_MIN || password.length > 200) return fail(`Passwords need at least ${PASSWORD_MIN} characters.`);
  const id = await createTeacher(values.name, values.email, password);
  if (!id) return fail("There's already an account with that email. Log in instead.");
  await noteAttempt("signup", device);
  await noteAttempt("signupNetwork", ip);
  await sendConfirmation(id, "teacher", values.email);
  await startSession(id, "teacher");
  redirect("/plan");
}

/** Fix the name students see. */
export async function renameMe(_: FormState, fd: FormData): Promise<FormState> {
  const id = await me();
  const name = field(fd, "name");
  if (name.length < 2 || name.length > 60) return { error: "Enter your name." };
  await renameTeacher(id, name);
  revalidatePath("/", "layout");
  return { ok: "Saved." };
}

/** Change the email, which is also the login. Nothing changes until the link sent to the new address is clicked. */
export async function changeMyEmail(_: FormState, fd: FormData): Promise<FormState> {
  const id = await me();
  if (await isLimited("emailSend", id)) return { error: LIMIT_MESSAGE.emailSend };
  const email = field(fd, "email");
  if (!EMAIL.test(email) || email.length > 200) return { error: "Enter a valid email." };
  await noteAttempt("emailSend", id);
  const error = await changeEmail(id, "teacher", email, String(fd.get("password") ?? ""));
  if (error) return { error };
  revalidatePath("/", "layout");
  return { ok: "Link sent. Check that inbox, and its spam folder." };
}

/** Send the confirmation link again. */
export async function resendConfirmation(): Promise<FormState> {
  const user = await currentUser("teacher");
  if (!user?.contactEmail) redirect("/login");
  if (await isLimited("emailSend", user.id)) return { error: LIMIT_MESSAGE.emailSend };
  await noteAttempt("emailSend", user.id);
  await sendConfirmation(user.id, "teacher", user.contactEmail);
  return { ok: "Sent." };
}

/** Email a reset link. The answer is the same whether or not the account exists. */
export async function forgotPassword(_: FormState, fd: FormData): Promise<FormState> {
  const login = field(fd, "login");
  const { ip } = await requester();
  if ((await isLimited("resetLogin", `teacher:${login}`)) || (await isLimited("resetNetwork", ip))) return { error: LIMIT_MESSAGE.resetLogin, values: { login } };
  await noteAttempt("resetLogin", `teacher:${login}`);
  await noteAttempt("resetNetwork", ip);
  await requestPasswordReset("teacher", login);
  return { ok: "If that matches an account with a confirmed email, a link is on its way. Check your spam folder too." };
}

/** Set a new password from an emailed link, then log in. */
export async function resetPassword(token: string, _: FormState, fd: FormData): Promise<FormState> {
  const password = String(fd.get("password") ?? "");
  if (password.length < PASSWORD_MIN || password.length > 200) return { error: `Passwords need at least ${PASSWORD_MIN} characters.` };
  if (password !== String(fd.get("confirm") ?? "")) return { error: "Those two passwords don't match." };
  const id = await resetPasswordWithToken(str(token), "teacher", password);
  if (!id) return { error: "This link doesn't work anymore. Ask for a new one." };
  await startSession(id, "teacher");
  redirect("/");
}

/** The weekly report switch on the Account page. */
export async function setWeeklyReportAction(on: unknown) {
  await setWeeklyReport(await me(), on === true);
  refresh();
}

/** The button on the unsubscribe page, reached from the report without logging in. */
export async function unsubscribeAction(token: string): Promise<FormState> {
  return (await unsubscribe(str(token))) ? { ok: "You're unsubscribed." } : { error: "This link doesn't work. Turn the email off on your Account page." };
}

/** Change the signed-in user's password (the current one is needed); other devices are signed out. */
export async function changeMyPassword(_: FormState, fd: FormData): Promise<FormState> {
  const user = await currentUser("teacher");
  if (!user) redirect("/login");
  const key = `teacher:${user.email}`;
  if (await isLimited("loginAccount", key)) return { error: LIMIT_MESSAGE.loginAccount };
  const next = String(fd.get("next") ?? "");
  if (next.length < PASSWORD_MIN || next.length > 200) return { error: `Passwords need at least ${PASSWORD_MIN} characters.` };
  if (!(await changePassword(user.id, String(fd.get("current") ?? ""), next))) {
    await noteAttempt("loginAccount", key);
    return { error: "Your current password isn't right." };
  }
  await startSession(user.id, "teacher");
  return { ok: "Password changed." };
}

/** Delete the teacher's account and their classes, after checking their password. */
export async function deleteMyAccount(_: FormState, fd: FormData): Promise<FormState> {
  const user = await currentUser("teacher");
  if (!user) redirect("/login");
  // Wrong passwords here count toward the same lock as logins.
  const key = `teacher:${user.email}`;
  if (await isLimited("loginAccount", key)) return { error: LIMIT_MESSAGE.loginAccount };
  if (!(await deleteAccount(user.id, String(fd.get("confirm") ?? "")))) {
    await noteAttempt("loginAccount", key);
    return { error: "That password isn't right." };
  }
  await endSession("teacher");
  redirect("/login?deleted=1");
}

/** Delete a class after the teacher types its name. */
export async function deleteClassAction(classId: string, _: FormState, fd: FormData): Promise<FormState> {
  const id = await me();
  if (!(await deleteClass(id, str(classId), String(fd.get("confirm") ?? "")))) return { error: "Type the class name exactly to delete it." };
  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  await endSession("teacher");
  redirect("/login");
}

// ── plan ──

const kindOf = (fd: FormData): PlanKind => (fd.get("kind") === "club" ? "club" : "academy");

/** Start the free trial of the plan the teacher picked. One per person: see trialProblem in billing. */
export async function startTrialAction(_: FormState, fd: FormData): Promise<FormState> {
  const user = await currentUser("teacher");
  if (!user) redirect("/login");
  const error = await startTrial(user.id, kindOf(fd), await trialSource(user.email ?? undefined));
  if (error) return { error, values: { kind: kindOf(fd) } };
  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * Simulated checkout: no payment provider is connected, so nothing is charged. It needs the
 * academy's or school's details. A club gives a school email so we can confirm it with the school.
 */
export async function checkoutAction(_: FormState, fd: FormData): Promise<FormState> {
  const teacherId = await me();
  const kind = kindOf(fd);
  const values = {
    kind,
    orgName: field(fd, "orgName"),
    orgLocation: field(fd, "orgLocation"),
    billingName: field(fd, "billingName"),
    billingEmail: field(fd, "billingEmail"),
    schoolEmail: field(fd, "schoolEmail"),
  };
  const fail = (error: string) => ({ error, values });
  const org = kind === "club" ? "school" : "academy";
  if (values.orgName.length < 2 || values.orgName.length > 80) return fail(`Enter your ${org}'s name.`);
  if (values.orgLocation.length < 2 || values.orgLocation.length > 80) return fail(`Enter the city and state your ${org} is in.`);
  if (kind === "academy") {
    if (values.billingName.length < 2 || values.billingName.length > 80) return fail("Enter who should get the bills.");
    if (!EMAIL.test(values.billingEmail) || values.billingEmail.length > 200) return fail("Enter a valid billing email.");
  } else {
    const problem = schoolEmailProblem(values.schoolEmail);
    if (problem) return fail(problem);
  }
  await checkoutTeacher(teacherId, kind, values);
  revalidatePath("/", "layout");
  redirect("/?paid=1");
}

// ── classes ──

function settings(fd: FormData): { settings: ClassSettings } | { error: string } {
  const name = field(fd, "name");
  const contestName = field(fd, "contestName");
  const contestDate = field(fd, "contestDate");
  const timezone = field(fd, "timezone");
  if (name.length < 2 || name.length > 80) return { error: "Give the class a name, like Long-Term AMC 10 Course." };
  if (contestName.length > 60) return { error: "Keep the contest name short." };
  const contestDay = contestDate ? parseDate(contestDate) : null;
  if (contestDate && contestDay === null) return { error: "Pick a valid contest date." };
  if (!isTimeZone(timezone)) return { error: "Pick a time zone." };
  // A past date is fine if it's the one already saved: the teacher may only be renaming the class.
  const unchanged = contestDate === field(fd, "savedContestDate");
  if (contestDay !== null && !unchanged && contestDay < dayInZone(timezone)) return { error: "That contest date has passed. Pick the next contest, or clear the date." };
  return { settings: { name, contestName: contestName || null, contestDay, timezone } };
}

const formValues = (fd: FormData) => Object.fromEntries(["name", "contestName", "contestDate", "timezone"].map((k) => [k, field(fd, k)]));

export async function createClassAction(_: FormState, fd: FormData): Promise<FormState> {
  const teacherId = await active();
  const s = settings(fd);
  if ("error" in s) return { error: s.error, values: formValues(fd) };
  const id = await createClass(teacherId, s.settings);
  redirect(`/c/${id}`);
}

export async function updateClassAction(classId: string, _: FormState, fd: FormData): Promise<FormState> {
  const teacherId = await active();
  const s = settings(fd);
  if ("error" in s) return { error: s.error, values: formValues(fd) };
  await updateClass(teacherId, str(classId), s.settings);
  refresh();
  return { ok: "Saved." };
}

export async function newCodeAction(classId: unknown) {
  await newClassCode(await active(), str(classId));
  refresh();
}

export async function assignAction(classId: unknown, formulaId: unknown) {
  await assign(await active(), str(classId), str(formulaId));
  refresh();
}

export async function unassignAction(classId: unknown, formulaId: unknown) {
  await unassign(await active(), str(classId), str(formulaId));
  refresh();
}

export async function nextWeekAction(classId: unknown) {
  await startNextWeek(await active(), str(classId));
  refresh();
}

export async function newGameAction(classId: unknown) {
  await newGame(await active(), str(classId));
  refresh();
}

// ── students ──

export async function removeStudentAction(classId: unknown, studentId: unknown) {
  await removeStudent(await active(), str(classId), str(studentId));
  redirect(`/c/${str(classId)}/students`);
}
