import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import type { Memory, Stage } from "@lemmory/core/srs";
import type { DaySession } from "@lemmory/core/session";

const createdAt = () =>
  integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date());

// Every row belongs to a user (and some to a class). Deleting a user or class deletes their
// rows with it ("cascade"), so nothing is left pointing at someone who's gone.
const user = (name: string) => text(name).notNull().references(() => users.id, { onDelete: "cascade" });

/**
 * Teachers sign in with an email; students with a username, and give a contact email (theirs or a
 * parent's) for password resets. Siblings can share one, so `recoveryEmail` isn't unique.
 */
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  role: text("role", { enum: ["teacher", "student"] }).notNull(),
  name: text("name").notNull(),
  email: text("email").unique(),
  username: text("username").unique(),
  recoveryEmail: text("recovery_email"),
  /** Set once the owner clicks the link. Password resets only go to a confirmed address. */
  emailConfirmedAt: integer("email_confirmed_at", { mode: "timestamp_ms" }),
  /** When the current address was added, which starts the time they have to confirm it. */
  emailAddedAt: integer("email_added_at", { mode: "timestamp_ms" }),
  passwordHash: text("password_hash").notNull(),
  /** Students on their own have no class time zone, so "today" uses their browser's (IANA name). */
  timezone: text("timezone"),
  /**
   * Students in no class: past days are recorded through this day (in a class, enrollments keep
   * it per class). Null until their first visit.
   */
  settledThrough: integer("settled_through"),
  /** Who gave permission for a student under 13: a parent by email, a parent's signed form, or a school. Null for everyone else; we don't keep birthdays. */
  consent: text("consent", { enum: ["parent", "signed", "school"] }),
  /** When the parent is due their follow-up email, the second step of email consent. Cleared once sent. */
  parentFollowUpAt: integer("parent_follow_up_at", { mode: "timestamp_ms" }),
  createdAt: createdAt(),
});

/** `id` is a SHA-256 of the cookie token, so a leaked database can't be used to sign in. */
export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: user("user_id"),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [index("sessions_user").on(t.userId)],
);

/** A link in an email. `id` is a SHA-256 of the token, like sessions. `email` is the address a "confirm" link confirms. */
export const emailTokens = sqliteTable(
  "email_tokens",
  {
    id: text("id").primaryKey(),
    userId: user("user_id"),
    kind: text("kind", { enum: ["confirm", "reset", "remove"] }).notNull(),
    email: text("email"),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [index("email_tokens_user").on(t.userId, t.kind)],
);

/**
 * A child under 13 waiting on a parent. It holds only what we may keep before permission, and it's
 * deleted when the parent agrees or the link runs out. `id` is a SHA-256 of the emailed token.
 */
export const parentRequests = sqliteTable(
  "parent_requests",
  {
    id: text("id").primaryKey(),
    firstName: text("first_name").notNull(),
    parentEmail: text("parent_email").notNull(),
    classId: text("class_id").references(() => classes.id, { onDelete: "cascade" }),
    timezone: text("timezone"),
    /** We have the parent's signed form, so the account can be in a class. */
    signed: integer("signed", { mode: "boolean" }).notNull().default(false),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [index("parent_requests_email").on(t.parentEmail)],
);

/** What a teacher wants emailed. No row means the defaults: the weekly report is on. */
export const teacherSettings = sqliteTable("teacher_settings", {
  teacherId: user("teacher_id").primaryKey(),
  weeklyReport: integer("weekly_report", { mode: "boolean" }).notNull().default(true),
  lastWeeklyReportAt: integer("last_weekly_report_at", { mode: "timestamp_ms" }),
  /** In the report's unsubscribe link, which has to work without logging in. */
  unsubscribeToken: text("unsubscribe_token").notNull().unique(),
});

export const classes = sqliteTable(
  "classes",
  {
    id: text("id").primaryKey(),
    teacherId: user("teacher_id"),
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
    /** Set once the school's signed form is in, so under-13s can join without a parent's email. */
    schoolApprovedAt: integer("school_approved_at", { mode: "timestamp_ms" }),
    createdAt: createdAt(),
  },
  (t) => [index("classes_teacher").on(t.teacherId)],
);

/** A student can be in several classes (say, an academy course and a school club). */
export const enrollments = sqliteTable(
  "enrollments",
  {
    studentId: user("student_id"),
    classId: text("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }),
    joinedDay: integer("joined_day").notNull(),
    /** Past days up to here have a row in `days`. */
    settledThrough: integer("settled_through").notNull(),
  },
  (t) => [primaryKey({ columns: [t.studentId, t.classId] }), index("enrollments_class").on(t.classId)],
);

export const assignments = sqliteTable(
  "assignments",
  {
    classId: text("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }),
    formulaId: text("formula_id").notNull(),
    week: integer("week").notNull(),
    day: integer("day").notNull(),
  },
  (t) => [primaryKey({ columns: [t.classId, t.formulaId] })],
);

export const cards = sqliteTable(
  "cards",
  {
    studentId: user("student_id"),
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
    studentId: user("student_id"),
    day: integer("day").notNull(),
    formulaId: text("formula_id").notNull(),
    stage: text("stage", { enum: ["recall", "apply"] }).$type<Stage>().notNull(),
    firstTry: integer("first_try", { mode: "boolean" }).notNull(),
    confusedWith: text("confused_with", { mode: "json" }).$type<string[]>(),
    /** A self-added card: extra practice, no class points. */
    extra: integer("extra", { mode: "boolean" }).notNull().default(false),
  },
  (t) => [
    // Covers the per-day points count (student, day, extra) as well as reading recent days.
    index("reviews_student_day").on(t.studentId, t.day, t.extra),
    // A card is finished once a day. Two answers sent at the same moment (a double click, two
    // tabs) can both pass the "is it due" check, and this makes the second one a no-op instead of
    // a duplicate row that would count its points twice.
    uniqueIndex("reviews_one_per_card_day").on(t.studentId, t.day, t.formulaId),
  ],
);

/**
 * Points-earning cards finished each day (not self-added ones, which are extra practice).
 * Kept up to date as reviews come in, so a leaderboard reads one small row per student per day
 * instead of counting the whole review log.
 */
export const dailyScores = sqliteTable(
  "daily_scores",
  {
    studentId: user("student_id"),
    day: integer("day").notNull(),
    n: integer("n").notNull(),
  },
  (t) => [primaryKey({ columns: [t.studentId, t.day] })],
);

/** Each past day: did the student finish, and how many assigned cards were left. */
export const days = sqliteTable(
  "days",
  {
    studentId: user("student_id"),
    day: integer("day").notNull(),
    done: integer("done", { mode: "boolean" }).notNull(),
    missed: integer("missed").notNull(),
  },
  (t) => [primaryKey({ columns: [t.studentId, t.day] })],
);

/** Today's in-progress review, so a reload picks up where the student left off. */
export const reviewSessions = sqliteTable("review_sessions", {
  studentId: text("student_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  data: text("data", { mode: "json" }).$type<DaySession>().notNull(),
});

/**
 * A teacher's plan. Every teacher starts with a free trial of the plan they pick; after it
 * ends they must enter their academy or school's details and pay. Checkout is simulated for
 * now (no payment provider yet), so "paying" just records it. Swap in Stripe later.
 */
export const plans = sqliteTable("plans", {
  teacherId: text("teacher_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  /** "pilot" is the old trial with no plan picked; new teachers pick academy or club. */
  kind: text("kind", { enum: ["pilot", "academy", "club"] }).notNull(),
  /** Academy or school name. */
  orgName: text("org_name"),
  /** City and state of the academy or school. */
  orgLocation: text("org_location"),
  /** Who gets the bills, for academies. */
  billingName: text("billing_name"),
  billingEmail: text("billing_email"),
  /** Clubs give a school address; the club price applies once it's verified. */
  schoolEmail: text("school_email"),
  clubStatus: text("club_status", { enum: ["pending", "verified", "rejected"] }),
  /** When the free trial runs out. Kept after paying, so a trial can't be restarted. */
  pilotEndsAt: integer("pilot_ends_at", { mode: "timestamp_ms" }),
  /** Set by the (simulated) checkout. */
  paidAt: integer("paid_at", { mode: "timestamp_ms" }),
});

/** Students on their own ($2/month): a free trial, then a (simulated) payment. */
export const studentPlans = sqliteTable("student_plans", {
  studentId: text("student_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  trialEndsAt: integer("trial_ends_at", { mode: "timestamp_ms" }),
  paidAt: integer("paid_at", { mode: "timestamp_ms" }),
  /** A parent or guardian, for the receipt. */
  billingName: text("billing_name"),
  billingEmail: text("billing_email"),
});

/**
 * Where each free trial came from, so one person can't keep starting new ones. Values are
 * SHA-256 hashes: a normalized email, a browser cookie id, or an IP address.
 */
export const trialClaims = sqliteTable(
  "trial_claims",
  {
    id: text("id").primaryKey(),
    role: text("role", { enum: ["teacher", "student"] }).notNull(),
    kind: text("kind", { enum: ["email", "device", "ip"] }).notNull(),
    hash: text("hash").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("trial_claims_hash").on(t.kind, t.hash)],
);

/**
 * Recent attempts at things worth slowing down: failed logins, wrong class codes, new accounts.
 * `key` is a SHA-256 hash of what was tried (an account, an IP address or a browser), never the raw value.
 */
export const attempts = sqliteTable(
  "attempts",
  {
    id: text("id").primaryKey(),
    key: text("key").notNull(),
    createdAt: createdAt(),
  },
  // The second index is for clearing out old rows, which goes by time alone.
  (t) => [index("attempts_key").on(t.key, t.createdAt), index("attempts_created").on(t.createdAt)],
);

