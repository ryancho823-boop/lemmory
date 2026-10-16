import { FORMULA_BY_ID, TOPICS, type Topic } from "./formulas";
import type { LogEntry, StudentRecord } from "./records";
import { pointsBetween, streak } from "./points";
import { type Card, isMastered, retrievability } from "./srs";

export * from "./points";

export interface Student extends StudentRecord {
  id: string;
  name: string;
  isYou: boolean;
}

export const accuracy = (log: LogEntry[]) => (log.length ? log.filter((l) => l.firstTry).length / log.length : null);
export const recent = (log: LogEntry[], today: number, days = 14) => log.filter((l) => l.day > today - days);

/** The weekly leaderboard counts from the teacher's last reset. */
export interface Competition {
  day: number;
  /** Points each student had already earned on the reset day before the reset. */
  baseline: Record<string, number>;
}

export const competitionPoints = (s: Student, c: Competition, today: number) =>
  Math.max(0, pointsBetween(s, c.day, today) - (c.baseline[s.id] ?? 0));

export function summary(s: Student, today: number) {
  const cards = Object.values(s.cards);
  const last14 = recent(s.log, today);
  return {
    streak: streak(s.doneDays, today),
    doneToday: s.doneDays.includes(today),
    xpWeek: pointsBetween(s, today - 6, today),
    xpTotal: pointsBetween(s, -Infinity, today),
    xpLastWeek: pointsBetween(s, today - 13, today - 7),
    accuracy: accuracy(last14),
    recallAccuracy: accuracy(last14.filter((l) => l.stage === "recall")),
    applyAccuracy: accuracy(last14.filter((l) => l.stage === "apply")),
    reviews14: last14.length,
    mastered: cards.filter(isMastered).length,
    inApply: cards.filter((c) => c.stage === "apply").length,
    total: cards.length,
    lastActive: s.doneDays.length ? Math.max(...s.doneDays) : null,
  };
}

export function byTopic(log: LogEntry[]) {
  return TOPICS.map((topic) => {
    const l = log.filter((x) => FORMULA_BY_ID[x.formulaId]?.topic === topic);
    return { topic, n: l.length, accuracy: accuracy(l) };
  }).filter((t) => t.n > 0);
}

export interface FormulaStat {
  formulaId: string;
  n: number;
  accuracy: number | null;
  recall: number | null;
  apply: number | null;
  /** Predicted recall today. */
  retention: number | null;
  card?: Card;
}

export function byFormula(s: Student, today: number, days = 28): FormulaStat[] {
  const log = recent(s.log, today, days);
  return Object.values(s.cards).map((card) => {
    const l = log.filter((x) => x.formulaId === card.formulaId);
    return {
      formulaId: card.formulaId,
      n: l.length,
      accuracy: accuracy(l),
      recall: accuracy(l.filter((x) => x.stage === "recall")),
      apply: accuracy(l.filter((x) => x.stage === "apply")),
      retention: retrievability(card, today),
      card,
    };
  });
}

/** Below this first-try accuracy, a formula "needs work". */
export const NEEDS_WORK = 0.7;

/** Formulas under 70% first-try accuracy, weakest first. */
export function weakest(s: Student, today: number, k = 5) {
  return byFormula(s, today)
    .filter((f) => f.n >= 2 && (f.accuracy ?? 1) < NEEDS_WORK)
    .map((f) => ({ ...f, score: (f.accuracy ?? 1) * 0.6 + (f.retention ?? 1) * 0.4 }))
    .sort((a, b) => a.score - b.score)
    .slice(0, k);
}

export function confusions(log: LogEntry[]) {
  const counts = new Map<string, { needed: string; picked: string; count: number }>();
  for (const l of log)
    for (const picked of l.confusedWith ?? []) {
      const key = `${l.formulaId}>${picked}`;
      const c = counts.get(key) ?? { needed: l.formulaId, picked, count: 0 };
      c.count++;
      counts.set(key, c);
    }
  return [...counts.values()].sort((a, b) => b.count - a.count);
}

/** Reviews per day for the last `days` days, oldest first. */
export function activity(log: LogEntry[], today: number, days = 35) {
  const out: { day: number; reviews: number }[] = [];
  for (let d = today - days + 1; d <= today; d++) out.push({ day: d, reviews: log.filter((l) => l.day === d).length });
  return out;
}

/** First-try accuracy per week, oldest first. */
export function weekly(log: LogEntry[], today: number, weeks = 4) {
  const out: { label: string; accuracy: number | null; n: number }[] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const l = log.filter((x) => x.day <= today - 7 * w && x.day > today - 7 * (w + 1));
    out.push({ label: w === 0 ? "This wk" : `${w} wk ago`, accuracy: accuracy(l), n: l.length });
  }
  return out;
}

// ── class level ──

export function formulaAcrossClass(students: Student[], formulaId: string, today: number) {
  const rows = students
    .filter((s) => s.cards[formulaId])
    .map((s) => {
      const card = s.cards[formulaId];
      const l = recent(s.log, today, 28).filter((x) => x.formulaId === formulaId);
      return {
        student: s,
        card,
        n: l.length,
        accuracy: accuracy(l),
        retention: retrievability(card, today),
      };
    });
  const all = students.flatMap((s) => s.log.filter((l) => l.formulaId === formulaId));
  return {
    rows,
    accuracy: accuracy(recent(all, today)),
    recall: accuracy(recent(all, today).filter((l) => l.stage === "recall")),
    apply: accuracy(recent(all, today).filter((l) => l.stage === "apply")),
    weekly: weekly(all, today),
    confusions: confusions(all),
    inApply: rows.filter((r) => r.card.stage === "apply").length,
    mastered: rows.filter((r) => isMastered(r.card)).length,
  };
}

export function classFormulaHealth(students: Student[], formulaIds: string[], today: number) {
  return formulaIds
    .map((id) => {
      const all = recent(
        students.flatMap((s) => s.log.filter((l) => l.formulaId === id)),
        today,
      );
      const ret = students.map((s) => (s.cards[id] ? retrievability(s.cards[id], today) : null)).filter((x): x is number => x !== null);
      return {
        formulaId: id,
        accuracy: accuracy(all),
        n: all.length,
        retention: ret.length ? ret.reduce((a, b) => a + b, 0) / ret.length : null,
        struggling: students.filter((s) => {
          const a = accuracy(recent(s.log, today).filter((l) => l.formulaId === id));
          return a !== null && a < 0.6;
        }).length,
      };
    })
    .sort((a, b) => (a.accuracy ?? 1) - (b.accuracy ?? 1));
}

export const topicOf = (id: string): Topic => FORMULA_BY_ID[id].topic;

// ── daily consistency ──

export type DayStatus = "done" | "few" | "some" | "many" | "today" | "none";

/** Green: all done. Light green: 5 or fewer missed. Yellow: fewer than 15. Red: 15 or more. */
export function dayStatus(s: StudentRecord, day: number, today: number): DayStatus {
  if (s.doneDays.includes(day)) return "done";
  if (day === today) return "today";
  const m = s.missed[day];
  if (m === undefined) return "none";
  if (m === 0) return "done";
  if (m <= 5) return "few";
  if (m < 15) return "some";
  return "many";
}

/** A leaderboard row, computed on the server so students never get classmates' review logs. */
export interface LeaderRow {
  id: string;
  name: string;
  /** The viewing student. */
  you: boolean;
  /** Points since the teacher started the current game. */
  game: number;
  total: number;
  streak: number;
}

export function leaderRows(students: Student[], game: Competition, today: number, youId?: string): LeaderRow[] {
  return students.map((s) => ({
    id: s.id,
    name: s.name,
    you: s.id === youId,
    game: competitionPoints(s, game, today),
    total: pointsBetween(s, -Infinity, today),
    streak: streak(s.doneDays, today),
  }));
}

const pctOf = (x: number | null) => (x === null ? "–" : `${Math.round(x * 100)}%`);

export interface Attention {
  student: Student;
  tag: "Behind" | "Struggling";
  /** What a teacher would act on, like "No review in 4d · 12 cards waiting". */
  detail: string;
}

/**
 * Students who are behind on reviews (no streak) or struggling (under 60% right on the
 * first try, last 14 days), worst first. Shown on the teacher's overview and in the weekly email.
 */
export function needsAttention(students: Student[], today: number, k = 5): Attention[] {
  return students
    .map((s) => ({ s, m: summary(s, today) }))
    .filter(({ m }) => m.streak === 0 || (m.accuracy ?? 1) < 0.6)
    .map(({ s, m }) => {
      const waiting = Object.values(s.cards).filter((c) => c.source === "teacher" && c.memory.due <= today).length;
      const away = m.lastActive === null ? null : today - m.lastActive;
      const weak = byTopic(recent(s.log, today, 28))
        .filter((t) => t.n >= 3)
        .sort((a, b) => (a.accuracy ?? 1) - (b.accuracy ?? 1))[0];
      const behind = m.streak === 0;
      return {
        student: s,
        tag: behind ? ("Behind" as const) : ("Struggling" as const),
        detail: behind
          ? `${away === null ? "Never reviewed" : `No review in ${away}d`} · ${waiting} cards waiting`
          : `${pctOf(m.accuracy)} first try${weak ? ` · weak: ${weak.topic}` : ""}`,
        score: behind ? -waiting : (m.accuracy ?? 1),
      };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, k)
    .map(({ score: _, ...a }) => a);
}
