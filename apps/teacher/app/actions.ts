"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { isTimeZone, parseDate } from "@lemmory/core/days";
import { RESET_MINUTES, accountExists, checkLogin, createPasswordReset, createTeacher, resetPasswordWithToken } from "@lemmory/db/accounts";
import { currentUser, endSession, startSession } from "@lemmory/db/auth";
import { PASSWORD_MIN } from "@lemmory/db/password";
import { checkoutAcademy, requestClub, schoolEmailProblem, startPilot } from "@lemmory/db/billing";
import { escapeHtml, mailHtml, sendMail } from "@lemmory/db/mail";
import { setWeeklyReport } from "@lemmory/db/report";
import {
  type ClassSettings,
  assign,
  createClass,
  kickStudent,
  letBackIn,
  newClassCode,
  newGame,
  removeStudent,
  resetStudentPassword,
  startNextWeek,
  unassign,
  updateClass,
} from "@lemmory/db/teacher";
import { teacherUrl } from "@/lib/session";

// Server actions are public endpoints: every one checks the session, and the db layer
// checks that the class belongs to this teacher.

/** Carries the email from a failed login to the sign-up form, without putting it in the URL. */
const SIGNUP_HINT = "lemmory_signup_email";

export type FormState = { error?: string; ok?: string; values?: Record<string, string> } | undefined;

async function me() {
  const user = await currentUser("teacher");
  if (!user) redirect("/login");
  return user.id;
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
  const id = await checkLogin("teacher", email, String(fd.get("password") ?? ""));
  if (!id) {
    // No account with that email: go make one, with the email already filled in.
    if (email && !(await accountExists("teacher", email))) {
      (await cookies()).set(SIGNUP_HINT, email, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 600 });
      redirect("/signup?new=1");
    }
    return { error: "That password isn't right for this email.", values: { email } };
  }
  await startSession(id, "teacher");
  redirect("/");
}

export async function signup(_: FormState, fd: FormData): Promise<FormState> {
  const values = { name: field(fd, "name"), email: field(fd, "email").toLowerCase() };
  const password = String(fd.get("password") ?? "");
  const fail = (error: string) => ({ error, values });
  if (values.name.length < 2 || values.name.length > 60) return fail("Enter the name students know you by, like Ms. Chen.");
  if (!EMAIL.test(values.email) || values.email.length > 200) return fail("Enter a valid email.");
  if (password.length < PASSWORD_MIN || password.length > 200) return fail(`Passwords need at least ${PASSWORD_MIN} characters.`);
  const id = await createTeacher(values.name, values.email, password);
  if (!id) return fail("There's already an account with that email. Log in instead.");
  await startSession(id, "teacher");
  redirect("/plan");
}

export async function logout() {
  await endSession("teacher");
  redirect("/login");
}

/** "Forgot password": email a one-hour reset link. Says the same thing whether or not the account exists. */
export async function forgotPassword(_: FormState, fd: FormData): Promise<FormState> {
  const email = field(fd, "email").toLowerCase();
  if (!EMAIL.test(email) || email.length > 200) return { error: "Enter the email you signed up with.", values: { email } };
  const reset = await createPasswordReset(email);
  if (reset) {
    const link = `${teacherUrl}/reset?token=${reset.token}`;
    await sendMail({
      to: reset.email,
      subject: "Reset your Lemmory password",
      text: `Hi ${reset.name},\n\nSomeone (hopefully you) asked to reset the password for your Lemmory teacher account. Set a new one here:\n\n${link}\n\nThe link works once, for ${RESET_MINUTES} minutes. If you didn't ask, ignore this email: your password stays the same.`,
      html: mailHtml(
        `<p style="margin:0 0 16px">Hi ${escapeHtml(reset.name)}, someone (hopefully you) asked to reset the password for your Lemmory teacher account.</p>
<a href="${escapeHtml(link)}" style="display:inline-block;background:#0f1121;color:#ffffff;text-decoration:none;font-weight:700;padding:10px 18px;border-radius:10px">Set a new password</a>
<p style="margin:16px 0 0;font-size:13px;color:#5b5d6b">The link works once, for ${RESET_MINUTES} minutes. If you didn't ask, ignore this email: your password stays the same.</p>`,
      ),
    });
  }
  return { ok: `If there's a teacher account for ${email}, we've emailed it a link to set a new password. Check your spam folder too.`, values: { email } };
}

export async function resetPassword(token: string, _: FormState, fd: FormData): Promise<FormState> {
  const password = String(fd.get("password") ?? "");
  if (password.length < PASSWORD_MIN || password.length > 200) return { error: `Passwords need at least ${PASSWORD_MIN} characters.` };
  if (password !== String(fd.get("confirm") ?? "")) return { error: "The two passwords don't match." };
  const id = await resetPasswordWithToken(str(token, 100), password);
  if (!id) return { error: "This link has expired or was already used. Ask for a new one." };
  await startSession(id, "teacher");
  redirect("/");
}

// ── preferences ──

export async function savePreferences(_: FormState, fd: FormData): Promise<FormState> {
  await setWeeklyReport(await me(), fd.get("weeklyReport") === "on");
  refresh();
  return { ok: "Saved." };
}

// ── plan ──

export async function startPilotAction() {
  // The pilot can only be used once; if it's been used, the plan page says so.
  if (!(await startPilot(await me()))) redirect("/plan");
  redirect("/");
}

/** Simulated academy checkout: no payment provider is connected, so nothing is charged. */
export async function academyCheckoutAction(_: FormState, fd: FormData): Promise<FormState> {
  const teacherId = await me();
  const orgName = field(fd, "orgName");
  if (orgName.length < 2 || orgName.length > 80) return { error: "Enter your academy's name." };
  await checkoutAcademy(teacherId, orgName);
  redirect("/?paid=1");
}

/** A school club asks for club pricing; it's confirmed with the school before the cap applies. */
export async function clubRequestAction(_: FormState, fd: FormData): Promise<FormState> {
  const teacherId = await me();
  const values = { orgName: field(fd, "orgName"), schoolEmail: field(fd, "schoolEmail") };
  if (values.orgName.length < 2 || values.orgName.length > 80) return { error: "Enter your school's name.", values };
  const problem = schoolEmailProblem(values.schoolEmail);
  if (problem) return { error: problem, values };
  await requestClub(teacherId, values.orgName, values.schoolEmail);
  redirect("/");
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
  return { settings: { name, contestName: contestName || null, contestDay, timezone } };
}

const formValues = (fd: FormData) => Object.fromEntries(["name", "contestName", "contestDate", "timezone"].map((k) => [k, field(fd, k)]));

export async function createClassAction(_: FormState, fd: FormData): Promise<FormState> {
  const teacherId = await me();
  const s = settings(fd);
  if ("error" in s) return { error: s.error, values: formValues(fd) };
  const id = await createClass(teacherId, s.settings);
  redirect(`/c/${id}`);
}

export async function updateClassAction(classId: string, _: FormState, fd: FormData): Promise<FormState> {
  const teacherId = await me();
  const s = settings(fd);
  if ("error" in s) return { error: s.error, values: formValues(fd) };
  await updateClass(teacherId, str(classId), s.settings);
  refresh();
  return { ok: "Saved." };
}

export async function newCodeAction(classId: unknown) {
  await newClassCode(await me(), str(classId));
  refresh();
}

export async function assignAction(classId: unknown, formulaId: unknown) {
  await assign(await me(), str(classId), str(formulaId));
  refresh();
}

export async function unassignAction(classId: unknown, formulaId: unknown) {
  await unassign(await me(), str(classId), str(formulaId));
  refresh();
}

export async function nextWeekAction(classId: unknown) {
  await startNextWeek(await me(), str(classId));
  refresh();
}

export async function newGameAction(classId: unknown) {
  await newGame(await me(), str(classId));
  refresh();
}

// ── students ──

export async function removeStudentAction(classId: unknown, studentId: unknown) {
  await removeStudent(await me(), str(classId), str(studentId));
  redirect(`/c/${str(classId)}/students`);
}

/** Kick out: like remove, but the class code stops working for them until they're let back in. */
export async function kickStudentAction(classId: unknown, studentId: unknown) {
  await kickStudent(await me(), str(classId), str(studentId));
  redirect(`/c/${str(classId)}/students`);
}

export async function letBackInAction(classId: unknown, studentId: unknown) {
  await letBackIn(await me(), str(classId), str(studentId));
  refresh();
}

export async function resetPasswordAction(classId: string, studentId: string, _: FormState, fd: FormData): Promise<FormState> {
  const teacherId = await me();
  const password = String(fd.get("password") ?? "");
  if (password.length < PASSWORD_MIN || password.length > 200) return { error: `Passwords need at least ${PASSWORD_MIN} characters.` };
  await resetStudentPassword(teacherId, str(classId), str(studentId), password);
  return { ok: "Password changed. Give it to the student; they've been signed out everywhere." };
}
