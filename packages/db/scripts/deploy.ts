// Runs before every production build of the student and teacher sites (their "prebuild" step):
// applies every migration in packages/db/drizzle, so a release can never go live on a database
// that's missing its tables or columns. (A migration that wasn't run once made every login and
// sign-up fail.) If it fails, the build fails and the last working release stays live.
//
// It acts on Vercel production deploys (VERCEL_ENV=production), and on previews that have a
// database of their own (PREVIEW_DATABASE_URL; previews never touch the live one, see client.ts).
// Elsewhere it does nothing, unless run with --force, which is for trying it on a local database file.
import { migrate } from "drizzle-orm/libsql/migrator";
import { DATABASE_URL, IS_PREVIEW, db } from "../src/client";
import journal from "../drizzle/meta/_journal.json";

const migrationsFolder = new URL("../drizzle", import.meta.url).pathname;
const production = process.env.VERCEL_ENV === "production" || process.argv.includes("--force");

/** Is every migration in the code applied? Drizzle goes by date: anything newer than the newest applied one runs. */
const upToDate = async () => {
  try {
    const rows = await db.$client.execute("select max(created_at) as last from __drizzle_migrations");
    return Number(rows.rows[0].last ?? 0) >= journal.entries[journal.entries.length - 1].when;
  } catch {
    return false; // a brand-new database has no migrations table yet
  }
};

/**
 * The student and teacher sites build at the same time, so both may try to migrate at once and
 * one can collide with the other. Migrations apply all-or-nothing, so after a failed try this
 * waits for the database to be up to date (the other build finishing), trying again meanwhile.
 */
async function migrateWithRetry() {
  const deadline = Date.now() + 120_000;
  for (;;) {
    if (await upToDate()) return;
    try {
      await migrate(db, { migrationsFolder });
      return;
    } catch (e) {
      if (Date.now() > deadline) throw e;
      console.warn("Migration didn't go through (another build may be migrating); checking again shortly.");
      await new Promise((r) => setTimeout(r, 2000 + Math.random() * 2000));
    }
  }
}

if (IS_PREVIEW && !DATABASE_URL) {
  console.log("Database migration skipped: this preview has no database of its own (PREVIEW_DATABASE_URL).");
  process.exit(0);
}
if (!production && !IS_PREVIEW) {
  console.log("Database migration skipped (not a production deploy).");
  process.exit(0);
}
if (production && !process.env.DATABASE_URL) {
  console.error("DATABASE_URL isn't set for this production build. Add it in Vercel (see DEPLOY.md).");
  process.exit(1);
}
try {
  await migrateWithRetry();
  console.log(`Database up to date (${DATABASE_URL.split("://")[0]}).`);
  process.exit(0);
} catch (e) {
  console.error("Database migration failed, so this release won't go live:", e);
  process.exit(1);
}
