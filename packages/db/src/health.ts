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

/**
 * A quick check of the database setup, safe to show publicly (no secrets). When the database
 * works, it says only that; hints about how the variables are set appear only when it doesn't.
 */
export async function databaseHealth() {
  try {
    const { db } = await import("./client");
    await db.all(sql`select 1 from users limit 1`);
    // Drizzle goes by date: every migration newer than the newest applied one is still to run.
    const [{ last }] = await db.all<{ last: number | null }>(sql`select max(created_at) as last from __drizzle_migrations`);
    const behind = journal.entries.filter((e) => e.when > Number(last ?? 0)).length;
    /** Whether every migration in the code has been applied (deploys apply them before building). */
    return { database: "connected", schema: behind ? `${behind} migration(s) not applied: run npm run db:migrate:prod` : "up to date" };
  } catch (e) {
    const err = e as Error & { cause?: Error };
    const { DATABASE_URL: url, DATABASE_AUTH_TOKEN: token, IS_PREVIEW } = await import("./client");
    // Previews read their own variables (see client.ts).
    const name = (v: string) => (IS_PREVIEW ? `PREVIEW_${v}` : v);
    // No host name or account count: this page is public, and neither helps fix a setup.
    return {
      database: `ERROR: ${(err.cause?.message ?? err.message).slice(0, 300)}`,
      [name("DATABASE_URL")]: describe(process.env[name("DATABASE_URL")]),
      url_starts_with: url ? url.split(":")[0] + ":" : "-",
      [name("DATABASE_AUTH_TOKEN")]: describe(process.env[name("DATABASE_AUTH_TOKEN")]),
      // Turso tokens are three dot-separated parts, a few hundred characters long.
      token_shape: token ? `${token.length} characters, ${token.split(".").length} parts` : "-",
    };
  }
}
