import { cleanEnv } from "@lemmory/db/client";
import { sendMail } from "@lemmory/db/mail";
import { buildWeeklyReport, markWeeklyReportSent, teachersDueWeeklyReport } from "@lemmory/db/report";
import { teacherUrl } from "@/lib/session";

export const dynamic = "force-dynamic";
// Loading every class can take a while for a big account.
export const maxDuration = 60;

/**
 * The Monday email to teachers about struggling students. Vercel Cron calls this (see
 * vercel.json) with `Authorization: Bearer $CRON_SECRET`. Safe to run twice: a teacher
 * who got the email in the last 6 days is skipped, and only sent emails are recorded.
 */
export async function GET(req: Request) {
  const secret = cleanEnv(process.env.CRON_SECRET);
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Unauthorized", { status: 401 });
  let sent = 0;
  let nothingToSend = 0;
  let failed = 0;
  for (const teacher of await teachersDueWeeklyReport()) {
    const report = teacher.email ? await buildWeeklyReport(teacher, teacherUrl) : null;
    if (!report) {
      nothingToSend++;
      continue;
    }
    if (await sendMail({ to: teacher.email!, ...report })) {
      await markWeeklyReportSent(teacher.id);
      sent++;
    } else failed++;
  }
  return Response.json({ sent, nothingToSend, failed });
}
