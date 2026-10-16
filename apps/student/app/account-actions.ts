"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import {
  CONFIRM_HOURS,
  RESET_MINUTES,
  createEmailConfirmation,
  createStudentEmailReset,
  removeRecoveryEmail,
  resetLinkRole,
  resetPasswordWithToken,
  resetWithStudentCode,
} from "@lemmory/db/accounts";
import { currentUser, startSession } from "@lemmory/db/auth";
import { escapeHtml, mailHtml, sendMail } from "@lemmory/db/mail";
import { PASSWORD_MIN } from "@lemmory/db/password";
import { studentUrl } from "@/lib/links";

// Getting back into a student account, and the optional recovery email (13 and older).

export type AccountState = { error?: string; ok?: string; values?: Record<string, string> } | undefined;

const field = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function newPassword(fd: FormData) {
  const password = String(fd.get("password") ?? "");
  if (password.length < PASSWORD_MIN || password.length > 200) return { error: `Passwords need at least ${PASSWORD_MIN} characters.` };
  if (password !== String(fd.get("confirm") ?? "")) return { error: "The two passwords don't match." };
  return { password };
}

/** A student uses the code their teacher gave them to choose a new password. */
export async function resetWithCode(_: AccountState, fd: FormData): Promise<AccountState> {
  const values = { username: field(fd, "username").toLowerCase(), code: field(fd, "code").toUpperCase() };
  const p = newPassword(fd);
  if ("error" in p) return { error: p.error, values };
  const id = await resetWithStudentCode(values.username.slice(0, 60), values.code.slice(0, 20), p.password);
  if (!id) return { error: "That code doesn't work for this username. Check both, or ask your teacher for a new code.", values };
  await startSession(id, "student");
  redirect("/");
}

/** "Forgot password" by email, for students who added a confirmed email. Same answer either way. */
export async function emailResetLink(_: AccountState, fd: FormData): Promise<AccountState> {
  const login = field(fd, "login").slice(0, 200);
  if (!login) return { error: "Enter your username or your email.", values: { login } };
  const reset = await createStudentEmailReset(login);
  if (reset) {
    const link = `${studentUrl}/reset?token=${reset.token}`;
    await sendMail({
      to: reset.email,
      subject: "Reset your Lemmory password",
      text: `Hi ${reset.name},\n\nSomeone (hopefully you) asked to reset your Lemmory password. Choose a new one here:\n\n${link}\n\nThe link works once, for ${RESET_MINUTES} minutes. If you didn't ask, ignore this email.`,
      html: mailHtml(
        `<p style="margin:0 0 16px">Hi ${escapeHtml(reset.name)}, someone (hopefully you) asked to reset your Lemmory password.</p>
<a href="${escapeHtml(link)}" style="display:inline-block;background:#0f1121;color:#ffffff;text-decoration:none;font-weight:700;padding:10px 18px;border-radius:10px">Choose a new password</a>
<p style="margin:16px 0 0;font-size:13px;color:#5b5d6b">The link works once, for ${RESET_MINUTES} minutes. If you didn't ask, ignore this email.</p>`,
      ),
    });
  }
  return {
    ok: "If that account has an email added, we sent it a link. No email on your account? Ask your teacher for a reset code instead.",
    values: { login },
  };
}

/** Choose a new password from an emailed link. */
export async function resetWithLink(token: string, _: AccountState, fd: FormData): Promise<AccountState> {
  const p = newPassword(fd);
  if ("error" in p) return { error: p.error };
  const t = String(token).slice(0, 100);
  if ((await resetLinkRole(t)) !== "student") return { error: "This link has expired or was already used. Ask for a new one." };
  const id = await resetPasswordWithToken(t, p.password);
  if (!id) return { error: "This link has expired or was already used. Ask for a new one." };
  await startSession(id, "student");
  redirect("/");
}

/** Add a recovery email (13 or older only). It counts once they click the link we send. */
export async function addRecoveryEmail(_: AccountState, fd: FormData): Promise<AccountState> {
  const user = await currentUser("student");
  if (!user) redirect("/login");
  const email = field(fd, "email").toLowerCase();
  if (fd.get("age") !== "on") return { error: "Only students 13 or older can add an email.", values: { email } };
  if (!EMAIL.test(email) || email.length > 200) return { error: "Enter a valid email.", values: { email } };
  const token = await createEmailConfirmation(user.id, email);
  if (!token) return { error: "We just sent one. Wait a minute before asking again.", values: { email } };
  const link = `${studentUrl}/confirm?token=${token}`;
  await sendMail({
    to: email,
    subject: "Confirm your Lemmory email",
    text: `Hi ${user.name},\n\nConfirm this email so you can reset your Lemmory password yourself if you forget it:\n\n${link}\n\nThe link works once, for ${CONFIRM_HOURS} hours.`,
    html: mailHtml(
      `<p style="margin:0 0 16px">Hi ${escapeHtml(user.name)}, confirm this email so you can reset your Lemmory password yourself if you forget it.</p>
<a href="${escapeHtml(link)}" style="display:inline-block;background:#0f1121;color:#ffffff;text-decoration:none;font-weight:700;padding:10px 18px;border-radius:10px">Confirm my email</a>
<p style="margin:16px 0 0;font-size:13px;color:#5b5d6b">The link works once, for ${CONFIRM_HOURS} hours.</p>`,
    ),
  });
  refresh();
  return { ok: `We sent a link to ${email}. Click it to finish.` };
}

export async function removeEmail() {
  const user = await currentUser("student");
  if (!user) redirect("/login");
  await removeRecoveryEmail(user.id);
  refresh();
}
