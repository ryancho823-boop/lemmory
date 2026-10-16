import { index, integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { Memory, Stage } from "@lemmory/core/srs";
import type { DaySession } from "@lemmory/core/session";

const createdAt = () =>
  integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date());

/** Teachers sign in with an email; students with a username (no email needed for under-13s). */
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  role: text("role", { enum: ["teacher", "student"] }).notNull(),
  name: text("name").notNull(),
  email: text("email").unique(),
  username: text("username").unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: createdAt(),
  /** When a teacher clicked the link in their confirmation email. Unconfirmed teachers can't use the site yet. */
  emailVerifiedAt: integer("email_verified_at", { mode: "timestamp_ms" }),
  /** A confirmed email a student (13 or older) added so they can reset their own password. */
  recoveryEmail: text("recovery_email"),
});

/** `id` is a SHA-256 of the cookie token, so a leaked database can't be used to sign in. */
export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [index("sessions_user").on(t.userId)],
);

export const classes = sqliteTable(
  "classes",
  {
    id: text("id").primaryKey(),
    teacherId: text("teacher_id").notNull(),
    name: text("name").notNull(),
    contestName: text("contest_name"),
    /** Day number of the contest. */
    contestDay: integer("contest_day"),
    /** IANA zone. "Today" flips at midnight here for everyone in the class. */
    timezone: text("timezone").notNull(),
    joinCode: text("join_code").notNull().unique(),
    currentWeek: integer("current_week").notNull().default(1),
    /** The leaderboard game counts points from this day. */
    gameDay: integer("game_day").notNull(),
    /** Points each student had already earned on `gameDay` before the game started. */
    gameBaseline: text("game_baseline", { mode: "json" }).$type<Record<string, number>>().notNull().default({}),
    createdAt: createdAt(),
  },
  (t) => [index("classes_teacher").on(t.teacherId)],
);

/** A student can be in several classes (say, an academy course and a school club). */
export const enrollments = sqliteTable(
  "enrollments",
  {
    studentId: text("student_id").notNull(),
    classId: text("class_id").notNull(),
    joinedDay: integer("joined_day").notNull(),
    /** Past days up to here have a row in `days`. */
    settledThrough: integer("settled_through").notNull(),
  },
  (t) => [primaryKey({ columns: [t.studentId, t.classId] }), index("enrollments_class").on(t.classId)],
);

export const assignments = sqliteTable(
  "assignments",
  {
    classId: text("class_id").notNull(),
    formulaId: text("formula_id").notNull(),
    week: integer("week").notNull(),
    day: integer("day").notNull(),
  },
  (t) => [primaryKey({ columns: [t.classId, t.formulaId] })],
);

export const cards = sqliteTable(
  "cards",
  {
    studentId: text("student_id").notNull(),
    formulaId: text("formula_id").notNull(),
    source: text("source", { enum: ["teacher", "self"] }).notNull(),
    stage: text("stage", { enum: ["recall", "apply"] }).$type<Stage>().notNull(),
    memory: text("memory", { mode: "json" }).$type<Memory>().notNull(),
    addedDay: integer("added_day").notNull(),
    /** Application mode rotates problems; this is the last one shown. */
    lastProblemId: text("last_problem_id"),
  },
  (t) => [primaryKey({ columns: [t.studentId, t.formulaId] })],
);

/** The review log: one row per finished card. Every chart is computed from it. */
export const reviews = sqliteTable(
  "reviews",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    studentId: text("student_id").notNull(),
    day: integer("day").notNull(),
    formulaId: text("formula_id").notNull(),
    stage: text("stage", { enum: ["recall", "apply"] }).$type<Stage>().notNull(),
    firstTry: integer("first_try", { mode: "boolean" }).notNull(),
    confusedWith: text("confused_with", { mode: "json" }).$type<string[]>(),
    /** A self-added card: extra practice, no class points. */
    extra: integer("extra", { mode: "boolean" }).notNull().default(false),
  },
  (t) => [index("reviews_student_day").on(t.studentId, t.day)],
);

/** Each past day: did the student finish, and how many assigned cards were left. */
export const days = sqliteTable(
  "days",
  {
    studentId: text("student_id").notNull(),
    day: integer("day").notNull(),
    done: integer("done", { mode: "boolean" }).notNull(),
    missed: integer("missed").notNull(),
  },
  (t) => [primaryKey({ columns: [t.studentId, t.day] })],
);

/** Today's in-progress review, so a reload picks up where the student left off. */
export const reviewSessions = sqliteTable("review_sessions", {
  studentId: text("student_id").primaryKey(),
  data: text("data", { mode: "json" }).$type<DaySession>().notNull(),
});

/**
 * A teacher's plan. Checkout is simulated for now (no payment provider yet), so
 * "paying" just records the choice. Swap in Stripe Checkout + a webhook later.
 */
export const plans = sqliteTable("plans", {
  teacherId: text("teacher_id").primaryKey(),
  kind: text("kind", { enum: ["pilot", "academy", "club"] }).notNull(),
  /** Academy or school name. */
  orgName: text("org_name"),
  /** Clubs sign up with a school address; the club price applies once it's verified. */
  schoolEmail: text("school_email"),
  clubStatus: text("club_status", { enum: ["pending", "verified", "rejected"] }),
  /** When a free pilot runs out. */
  pilotEndsAt: integer("pilot_ends_at", { mode: "timestamp_ms" }),
  /** Set by the (simulated) checkout. */
  paidAt: integer("paid_at", { mode: "timestamp_ms" }),
});

/** Individual students who pay for themselves ($2/month). Also simulated for now. */
export const studentPlans = sqliteTable("student_plans", {
  studentId: text("student_id").primaryKey(),
  paidAt: integer("paid_at", { mode: "timestamp_ms" }).notNull(),
});

/** Teachers' "forgot password" links. `id` is a SHA-256 of the emailed token, like `sessions`. */
export const passwordResets = sqliteTable(
  "password_resets",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("password_resets_user").on(t.userId)],
);

/** Students a teacher kicked out of a class. The class code stops working for them until they're let back in. */
export const classBans = sqliteTable(
  "class_bans",
  {
    classId: text("class_id").notNull(),
    studentId: text("student_id").notNull(),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.classId, t.studentId] })],
);

/** A teacher's preferences. No row means the defaults. */
export const teacherPrefs = sqliteTable("teacher_prefs", {
  teacherId: text("teacher_id").primaryKey(),
  /** The Monday email about students who are behind or struggling. On unless turned off. */
  weeklyReport: integer("weekly_report", { mode: "boolean" }).notNull().default(true),
  lastWeeklyReportAt: integer("last_weekly_report_at", { mode: "timestamp_ms" }),
});

/**
 * Links that confirm an email address: a new teacher's sign-up email, or a student's
 * recovery email. `id` is a SHA-256 of the link's token. One use, 24 hours.
 */
export const emailConfirmations = sqliteTable(
  "email_confirmations",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    email: text("email").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("email_confirmations_user").on(t.userId)],
);

/**
 * A one-time code a teacher gives a student who forgot their password. The student types it
 * with a new password of their choosing, so the teacher never knows the password. The code
 * is stored as a SHA-256, works for 24 hours, and stops working after a few wrong tries.
 */
export const studentResetCodes = sqliteTable("student_reset_codes", {
  studentId: text("student_id").primaryKey(),
  codeHash: text("code_hash").notNull(),
  createdBy: text("created_by").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  attempts: integer("attempts").notNull().default(0),
  createdAt: createdAt(),
});
