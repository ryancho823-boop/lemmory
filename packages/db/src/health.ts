import "server-only";
import { sql } from "drizzle-orm";

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
  let host = "";
  try {
    host = url ? new URL(url).host : "";
  } catch {
    host = "not a valid address";
  }
  const report = {
    DATABASE_URL: describe(process.env.DATABASE_URL),
    database_host: host || "-",
    url_starts_with: url ? url.split("://")[0] + "://" : "-",
    DATABASE_AUTH_TOKEN: describe(process.env.DATABASE_AUTH_TOKEN),
    // Turso tokens are three dot-separated parts, a few hundred characters long.
    token_shape: token ? `${token.length} characters, ${token.split(".").length} parts` : "-",
    database: "not checked",
  };
  try {
    const { db } = await import("./client");
    const rows = await db.all<{ n: number }>(sql`select count(*) as n from users`);
    report.database = `connected (${rows[0]?.n ?? 0} accounts)`;
  } catch (e) {
    const err = e as Error & { cause?: Error };
    report.database = `ERROR: ${(err.cause?.message ?? err.message).slice(0, 300)}`;
  }
  return report;
}
