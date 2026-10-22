// Checks the migrations folder (CI runs it on every pull request):
// - every migration in the journal has its .sql file, and every .sql file is in the journal;
// - with a base branch (`node check-migrations.mjs origin/main`), no migration that's already on
//   that branch was edited or deleted. A migration may have run somewhere, so changing it leaves
//   databases out of step with the code: write a new migration that undoes it instead.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dir = fileURLToPath(new URL("../drizzle/", import.meta.url));
const journal = JSON.parse(readFileSync(`${dir}meta/_journal.json`, "utf8"));
const tags = journal.entries.map((e) => e.tag);
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).map((f) => f.slice(0, -4));
const problems = [
  ...tags.filter((t) => !files.includes(t)).map((t) => `${t}.sql is in the journal but the file is missing`),
  ...files.filter((f) => !tags.includes(f)).map((f) => `${f}.sql isn't in the journal (run npm run db:generate instead of writing it by hand)`),
];

const base = process.argv[2];
if (base) {
  const git = (...args) => execFileSync("git", args, { encoding: "utf8" });
  const rel = "packages/db/drizzle"; // the same folder, as git names it from the repo root
  const onBase = git("ls-tree", "--full-tree", "--name-only", `${base}:${rel}`).split("\n").filter((f) => f.endsWith(".sql"));
  for (const f of onBase) {
    if (!existsSync(`${dir}${f}`)) problems.push(`${f} was deleted, but it's on ${base} and may already have run`);
    else if (git("show", `${base}:${rel}/${f}`) !== readFileSync(`${dir}${f}`, "utf8")) problems.push(`${f} was edited, but it's on ${base} and may already have run`);
  }
}

if (problems.length) {
  console.error(`Migration problems:\n- ${problems.join("\n- ")}\n\nTo undo a migration, add a new one that reverses it.`);
  process.exit(1);
}
console.log(`${tags.length} migrations, all present${base ? `, none changed since ${base}` : ""}.`);
