import { sql } from "drizzle-orm";
import type { Db } from "./client";
import journal from "../drizzle/meta/_journal.json";

/**
 * How the database's applied migrations compare with the ones in the code. Drizzle records each
 * by its date and runs only those newer than the newest applied one, so a migration that was
 * applied and later deleted from the code (`unknown`) can make it silently skip real ones.
 */
export async function migrationStatus(db: Db) {
  let applied: number[] = [];
  try {
    applied = (await db.all<{ at: number }>(sql`select created_at as at from __drizzle_migrations`)).map((r) => Number(r.at));
  } catch {
    // A brand-new database has no migrations table yet.
  }
  const inCode = new Set(journal.entries.map((e) => e.when));
  const last = Math.max(0, ...applied);
  return {
    behind: journal.entries.filter((e) => e.when > last).length,
    unknown: applied.filter((at) => !inCode.has(at)).length,
  };
}

export const describeMigrations = ({ behind, unknown }: Awaited<ReturnType<typeof migrationStatus>>) =>
  unknown
    ? `${unknown} applied migration(s) aren't in the code (deleted after they ran?). Add a new migration instead of deleting one.`
    : behind
      ? `${behind} migration(s) not applied: run npm run db:migrate:prod`
      : "up to date";
