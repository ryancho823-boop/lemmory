import "server-only";
import { sql } from "drizzle-orm";

/** A quick check of the database setup, safe to show publicly (no secrets). */
export async function databaseHealth() {
  const url = process.env.DATABASE_URL;
  const report = {
    DATABASE_URL: url ? (url.startsWith("libsql://") || url.startsWith("https://") ? "set" : `set, but should start with libsql:// (starts with "${url.slice(0, 8)}")`) : "MISSING",
    DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN ? "set" : "MISSING",
    database: "not checked",
  };
  try {
    // Imported here so a bad setup is reported instead of crashing the page.
    const { db } = await import("./client");
    const rows = await db.all<{ n: number }>(sql`select count(*) as n from users`);
    report.database = `connected (${rows[0]?.n ?? 0} accounts)`;
  } catch (e) {
    const err = e as Error & { cause?: Error };
    report.database = `ERROR: ${(err.cause?.message ?? err.message).slice(0, 300)}`;
  }
  return report;
}
