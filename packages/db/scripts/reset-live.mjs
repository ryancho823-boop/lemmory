// Resets the LIVE database for a fresh start (testing phase: after each merge). From the repo root:
//   npm run db:reset:prod                                    -> backup, then delete every account and class
// Or from packages/db:
//   node --env-file=../../.env.turso scripts/reset-live.mjs          -> backup only (safe)
//   node --env-file=../../.env.turso scripts/reset-live.mjs --wipe   -> backup, then delete every account and class
// The backup is a JSON file in data/backups (git-ignored). Table structure and migrations stay.
// Reads DATABASE_URL / DATABASE_AUTH_TOKEN from the env file and never prints them (only the
// database's name, which --wipe asks you to type back before it deletes anything).
import { mkdirSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { createClient } from "@libsql/client/web";

const clean = (v) => v?.trim().replace(/^["']+|["']+$/g, "").trim();
const db = createClient({ url: clean(process.env.DATABASE_URL), authToken: clean(process.env.DATABASE_AUTH_TOKEN)?.replace(/\s+/g, "") });

const tables = (
  await db.execute("select name from sqlite_master where type='table' and name not like 'sqlite_%' and name not like '__drizzle%' and name not like '_cf_%'")
).rows.map((r) => r.name);

const backup = {};
for (const t of tables) backup[t] = (await db.execute(`select * from "${t}"`)).rows;
const dir = new URL("../../../data/backups/", import.meta.url);
mkdirSync(dir, { recursive: true });
const file = new URL(`live-${new Date().toISOString().replace(/[:.]/g, "-")}.json`, dir);
writeFileSync(file, JSON.stringify(backup, null, 1));
console.log("Backup saved:", file.pathname);
console.log("Rows now:", Object.fromEntries(tables.map((t) => [t, backup[t].length])));

if (process.argv.includes("--wipe")) {
  const name = new URL(clean(process.env.DATABASE_URL).replace(/^libsql:/, "https:")).hostname.split(".")[0];
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const typed = (await rl.question(`This deletes every account and class in "${name}". Type the database name to continue: `)).trim();
  rl.close();
  if (typed !== name) {
    console.log("Names don't match. Nothing was deleted.");
    process.exit(1);
  }
  await db.batch(tables.map((t) => `delete from "${t}"`), "write");
  const after = {};
  for (const t of tables) after[t] = Number((await db.execute(`select count(*) as n from "${t}"`)).rows[0].n);
  console.log("After wipe:", after);
} else {
  console.log("Backup only. Add --wipe to delete everything.");
}
