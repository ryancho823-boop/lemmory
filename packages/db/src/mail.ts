import "server-only";
import { cleanEnv } from "./client";

export interface Mail {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Sends an email through Resend (https://resend.com) when RESEND_API_KEY is set. Without a
 * key, local development prints the email to the server log instead, so password-reset
 * links can be followed from the terminal. Returns whether the email actually went out.
 */
export async function sendMail(mail: Mail): Promise<boolean> {
  const key = cleanEnv(process.env.RESEND_API_KEY)?.replace(/\s+/g, "");
  if (!key) {
    // Never print the body in production: it can hold a password-reset link.
    if (process.env.NODE_ENV === "production") console.warn(`[mail] RESEND_API_KEY isn't set, so "${mail.subject}" wasn't sent.`);
    else console.info(`[mail] RESEND_API_KEY isn't set, so this wasn't sent.\nTo: ${mail.to}\nSubject: ${mail.subject}\n\n${mail.text}\n`);
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: cleanEnv(process.env.EMAIL_FROM) ?? "Lemmory <onboarding@resend.dev>",
      to: [mail.to],
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    }),
  });
  if (!res.ok) console.error(`[mail] Resend answered ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.ok;
}

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** A plain, readable email body: a heading, paragraphs and lists, in one centred column. */
export function mailHtml(body: string) {
  return `<!doctype html><html><body style="margin:0;background:#f6f5f1;padding:24px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f1121;font-size:15px;line-height:1.5">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e7e5df;border-radius:16px;padding:28px">
<p style="margin:0 0 20px;font-weight:800;font-size:18px">Lemmory</p>
${body}
</div></body></html>`;
}
