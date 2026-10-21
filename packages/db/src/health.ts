import "server-only";
import { sql } from "drizzle-orm";
import journal from "../drizzle/meta/_journal.json";

/** Describe a value without revealing it: length, and whether it has stray characters. */
function describe(raw: string | undefined) {
  if (!raw) return "MISSING";
  const notes = [];
  if (raw !== raw.trim()) notes.push("has spaces or line breaks at the ends (cleaned automatically)");
  if (/^\s*["']|["']\s*$/.test(raw)) notes.push("wrapped in quotes (cleaned automatically)");
  if (/\s/.test(raw.trim())) notes.push("has a space or line break in the middle (removed automatically for the token)");
  return notes.length ? `set, but ${notes.join("; ")}` : "set";
}

/** A quick check of the database setup, safe to show publicly (no secrets). */
export async function databaseHealth() {
  const { cleanEnv, DATABASE_AUTH_TOKEN: token } = await import("./client");
  const url = cleanEnv(process.env.DATABASE_URL);
  // No host name or account count: this page is public, and neither helps fix a setup.
  const report = {
    DATABASE_URL: describe(process.env.DATABASE_URL),
    url_starts_with: url ? url.split(":")[0] + ":" : "-",
    DATABASE_AUTH_TOKEN: describe(process.env.DATABASE_AUTH_TOKEN),
    // Turso tokens are three dot-separated parts, a few hundred characters long.
    token_shape: token ? `${token.length} characters, ${token.split(".").length} parts` : "-",
    database: "not checked",
    /** Whether every migration in the code has been applied (deploys apply them before building). */
    schema: "not checked",
  };
  try {
    const { db } = await import("./client");
    await db.all(sql`select 1 from users limit 1`);
    report.database = "connected";
    // Drizzle goes by date: every migration newer than the newest applied one is still to run.
    const [{ last }] = await db.all<{ last: number | null }>(sql`select max(created_at) as last from __drizzle_migrations`);
    const behind = journal.entries.filter((e) => e.when > Number(last ?? 0)).length;
    report.schema = behind ? `${behind} migration(s) not applied: run npm run db:migrate:prod` : "up to date";
  } catch (e) {
    const err = e as Error & { cause?: Error };
    report.database = `ERROR: ${(err.cause?.message ?? err.message).slice(0, 300)}`;
  }
  return report;
}
