import "server-only";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanEnv } from "./client";

export interface Mail {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Sends an email through Resend (https://resend.com) when RESEND_API_KEY is set. Without a
 * key, local development prints the email to the server log instead (and saves it to
 * data/outbox to look at), so links can be followed from the terminal. Returns whether
 * the email actually went out.
 */
export async function sendMail(mail: Mail): Promise<boolean> {
  const key = cleanEnv(process.env.RESEND_API_KEY)?.replace(/\s+/g, "");
  if (!key) {
    // Never print the body in production: it can hold a password-reset link.
    if (process.env.NODE_ENV === "production") console.warn(`[mail] RESEND_API_KEY isn't set, so "${mail.subject}" wasn't sent.`);
    else {
      // Also save the email as a web page (data/outbox, next to the local database) to see how it looks.
      const dir = resolve(process.cwd(), "../../data/outbox");
      const file = resolve(dir, `${new Date().toISOString().replace(/[:.]/g, "-")}-${mail.subject.replace(/\W+/g, "-").toLowerCase()}.html`);
      try {
        mkdirSync(dir, { recursive: true });
        writeFileSync(file, mail.html);
      } catch {}
      console.info(`[mail] RESEND_API_KEY isn't set, so this wasn't sent.\nTo: ${mail.to}\nSubject: ${mail.subject}\nPreview: ${file}\n\n${mail.text}\n`);
    }
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

const INK = "#0f1121";
const SOFT = "#5b5d6b";
const LEMON = "#ffd43b";
const SERIF = "Fraunces,Georgia,'Times New Roman',serif";
const SANS = "'Source Sans 3',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

/** Styles shared by email bodies, so every email looks the same. */
export const mailStyle = {
  p: `margin:0 0 16px;font-size:16px;line-height:1.6;color:${INK}`,
  h2: `margin:0 0 4px;font-family:${SERIF};font-size:19px;font-weight:600;color:${INK}`,
  label: `margin:0 0 6px;font-size:13px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:${SOFT}`,
  list: `margin:0 0 16px;padding-left:20px;font-size:16px;line-height:1.6;color:${INK}`,
  soft: SOFT,
  section: "border-top:1px solid #eeeae0;padding-top:22px;margin-top:22px",
};

/** A big, dark button. Built as a table so Outlook draws it too. */
export function mailButton(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 4px"><tr><td bgcolor="${INK}" style="border-radius:12px">
<a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 26px;font-family:${SANS};font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px">${escapeHtml(label)}</a>
</td></tr></table>`;
}

/**
 * Every Lemmory email: a warm yellow background, the Σ logo, and one white card with a
 * serif title, the message, an optional button (with the link written out underneath in
 * case the button doesn't work), and a small note. `body` is HTML; escape what goes in it.
 */
export function mailHtml(m: { title: string; body: string; button?: { href: string; label: string }; note?: string; footer?: string }) {
  const button = m.button
    ? `${mailButton(m.button.href, m.button.label)}
<p style="margin:14px 0 0;font-size:13px;line-height:1.5;color:${SOFT}">Button not working? Paste this into your browser:<br><a href="${escapeHtml(m.button.href)}" style="color:${SOFT};word-break:break-all">${escapeHtml(m.button.href)}</a></p>`
    : "";
  const note = m.note ? `<p style="margin:22px 0 0;padding-top:18px;border-top:1px solid #eeeae0;font-size:14px;line-height:1.55;color:${SOFT}">${m.note}</p>` : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Source+Sans+3:wght@400;700&display=swap" rel="stylesheet"><title>${escapeHtml(m.title)}</title></head>
<body style="margin:0;padding:0;background:#fff4c2">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fff4c2" style="background:#fff4c2;background-image:linear-gradient(180deg,#ffe27a 0%,#fff4c2 340px)">
<tr><td align="center" style="padding:36px 14px 40px;font-family:${SANS};color:${INK}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px">
<tr><td style="padding:0 6px 20px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="34" height="34" align="center" valign="middle" bgcolor="${INK}" style="border-radius:9px;font-family:${SERIF};font-size:20px;font-weight:700;color:${LEMON};line-height:34px">&Sigma;</td>
<td style="padding-left:10px;font-family:${SERIF};font-size:21px;font-weight:600;color:${INK}">Lemmory</td>
</tr></table></td></tr>
<tr><td bgcolor="#ffffff" style="background:#ffffff;border-radius:20px;border:1px solid #f1e3a6;padding:34px 32px 30px;box-shadow:0 10px 30px rgba(15,17,33,.07)">
<h1 style="margin:0 0 18px;font-family:${SERIF};font-size:27px;line-height:1.25;font-weight:600;color:${INK}">${escapeHtml(m.title)}</h1>
${m.body}
${button}
${note}
</td></tr>
<tr><td align="center" style="padding:22px 16px 0;font-size:13px;line-height:1.55;color:${SOFT}">${m.footer ?? "Lemmory &middot; Remember every formula. Know when to use it."}</td></tr>
</table></td></tr></table></body></html>`;
}
