import "server-only";
import { and, eq, isNull, lt, or } from "drizzle-orm";
import { FORMULA_BY_ID } from "@lemmory/core/formulas";
import { NEEDS_WORK, classFormulaHealth, needsAttention } from "@lemmory/core/analytics";
import { teacherActive } from "./billing";
import { db } from "./client";
import { escapeHtml, mailButton, mailHtml, mailStyle } from "./mail";
import { loadClass } from "./records";
import { classes, teacherPrefs, users } from "./schema";

// ── preferences ──

export async function getPrefs(teacherId: string) {
  const row = await db.select().from(teacherPrefs).where(eq(teacherPrefs.teacherId, teacherId)).get();
  return { weeklyReport: row?.weeklyReport ?? true };
}

export async function setWeeklyReport(teacherId: string, on: boolean) {
  await db
    .insert(teacherPrefs)
    .values({ teacherId, weeklyReport: on })
    .onConflictDoUpdate({ target: teacherPrefs.teacherId, set: { weeklyReport: on } });
}

// ── the weekly email ──

/** A teacher gets at most one weekly email in this window, even if the job runs twice. */
const MIN_GAP_MS = 6 * 86_400_000;

/** Teachers with the weekly email on (the default) who haven't had one in the last 6 days. */
export async function teachersDueWeeklyReport(now = new Date()) {
  return db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .leftJoin(teacherPrefs, eq(teacherPrefs.teacherId, users.id))
    .where(
      and(
        eq(users.role, "teacher"),
        or(isNull(teacherPrefs.teacherId), eq(teacherPrefs.weeklyReport, true)),
        or(isNull(teacherPrefs.lastWeeklyReportAt), lt(teacherPrefs.lastWeeklyReportAt, new Date(now.getTime() - MIN_GAP_MS))),
      ),
    );
}

export async function markWeeklyReportSent(teacherId: string, at = new Date()) {
  await db
    .insert(teacherPrefs)
    .values({ teacherId, lastWeeklyReportAt: at })
    .onConflictDoUpdate({ target: teacherPrefs.teacherId, set: { lastWeeklyReportAt: at } });
}

interface ClassReport {
  id: string;
  name: string;
  students: number;
  /** Students who finished their review on at least 5 of the last 7 days. */
  steady: number;
  attention: { id: string; name: string; tag: string; detail: string }[];
  forgetting: { name: string; accuracy: number; struggling: number }[];
}

/**
 * This week's email for one teacher: per class, who is behind or struggling and which
 * assigned formulas the class is forgetting. Null when there's nothing to send (no
 * students yet, or the teacher's plan has ended).
 */
export async function buildWeeklyReport(teacher: { id: string; name: string }, teacherUrl: string) {
  if (!(await teacherActive(teacher.id))) return null;
  const mine = await db.select({ id: classes.id }).from(classes).where(eq(classes.teacherId, teacher.id)).orderBy(classes.createdAt);
  const reports: ClassReport[] = [];
  for (const { id } of mine) {
    const view = await loadClass(id);
    if (!view || !view.students.length) continue;
    const { klass, today, students, assignments } = view;
    reports.push({
      id,
      name: klass.name,
      students: students.length,
      steady: students.filter((s) => s.doneDays.filter((d) => d > today - 7 && d <= today).length >= 5).length,
      attention: needsAttention(students, today, 8).map((a) => ({ id: a.student.id, name: a.student.name, tag: a.tag, detail: a.detail })),
      forgetting: classFormulaHealth(
        students,
        assignments.map((a) => a.formulaId),
        today,
      )
        .filter((h) => h.n >= 3 && h.accuracy !== null && h.accuracy < NEEDS_WORK)
        .slice(0, 3)
        .map((h) => ({ name: FORMULA_BY_ID[h.formulaId].name, accuracy: h.accuracy!, struggling: h.struggling })),
    });
  }
  if (!reports.length) return null;

  // A student in two of the teacher's classes counts once.
  const flagged = new Set(reports.flatMap((r) => r.attention.map((a) => a.id))).size;
  const subject = flagged
    ? `${flagged} student${flagged === 1 ? "" : "s"} could use your help this week`
    : "Your classes this week: everyone is on track";
  const prefsUrl = `${teacherUrl}/preferences`;
  const pct = (x: number) => `${Math.round(x * 100)}%`;

  const text = [
    `Hi ${teacher.name},`,
    "",
    "Here's how your students did on Lemmory this week.",
    ...reports.flatMap((r) => [
      "",
      `${r.name.toUpperCase()}: ${r.steady} of ${r.students} students reviewed on 5+ days`,
      ...(r.attention.length
        ? ["Needs attention:", ...r.attention.map((a) => `- ${a.name} (${a.tag}): ${a.detail}`)]
        : ["Everyone is on track."]),
      ...(r.forgetting.length
        ? ["Formulas the class is forgetting:", ...r.forgetting.map((f) => `- ${f.name}: ${pct(f.accuracy)} right on the first try, ${f.struggling} below 60%`)]
        : []),
      `Open the class: ${teacherUrl}/c/${r.id}`,
    ]),
    "",
    `You get this every Monday. To stop it, turn it off in Preferences: ${prefsUrl}`,
  ].join("\n");

  const e = escapeHtml;
  const st = mailStyle;
  const html = mailHtml({
    title: flagged ? `${flagged} student${flagged === 1 ? "" : "s"} could use your help` : "Everyone is on track",
    body: [
      `<p style="${st.p}">Hi ${e(teacher.name)}, here's how your students did on Lemmory this week.</p>`,
      ...reports.map(
        (r) => `<div style="${st.section}">
<p style="${st.h2}">${e(r.name)}</p>
<p style="${st.p};color:${st.soft}">${r.steady} of ${r.students} students reviewed on 5 or more days</p>
${
  r.attention.length
    ? `<p style="${st.label}">Needs attention</p><ul style="${st.list}">${r.attention
        .map((a) => `<li style="margin-bottom:6px"><b>${e(a.name)}</b> <span style="color:${a.tag === "Behind" ? "#c2410c" : "#a16207"};font-weight:700">${a.tag}</span><br>${e(a.detail)}</li>`)
        .join("")}</ul>`
    : `<p style="${st.p}">Everyone is on track.</p>`
}
${
  r.forgetting.length
    ? `<p style="${st.label}">Formulas the class is forgetting</p><ul style="${st.list}">${r.forgetting
        .map((f) => `<li style="margin-bottom:6px"><b>${e(f.name)}</b><br>${pct(f.accuracy)} right on the first try, ${f.struggling} below 60%</li>`)
        .join("")}</ul>`
    : ""
}
${mailButton(`${teacherUrl}/c/${r.id}`, `Open ${r.name}`)}
</div>`,
      ),
    ].join("\n"),
    footer: `You get this every Monday. <a href="${e(prefsUrl)}" style="color:${st.soft}">Turn it off in Preferences</a>.`,
  });
  return { subject, text, html };
}
