# Deploying Lemmory

Three websites on Vercel, all from this one GitHub repo, plus one Turso database:

| Website | Folder | Vercel address |
| --- | --- | --- |
| Main site + demo | `apps/site` | https://lemmory-chi.vercel.app |
| Teacher site | `apps/teacher` | https://lemmory-teacher.vercel.app |
| Student site | `apps/student` | https://lemmory-student.vercel.app |
| Database | Turso | `libsql://lemmory-ryancho823-boop.aws-us-east-2.turso.io` |

The sites already know these addresses (`packages/core/src/urls.ts`), so the links between them work with no extra settings. Pushing to GitHub's `main` branch redeploys all three.

## The database (Turso)

Already set up. Your Turso values live in `.env.turso` on your Mac, which never goes to GitHub.

- After changing `packages/db/src/schema.ts`: run `npm run db:generate` and commit the new migration. Deploys apply it: the student and teacher sites' builds run every migration first (`packages/db/scripts/deploy.ts`), and if that fails the build fails, so the last working version stays live instead of one that can't log anyone in. You can still run `npm run db:migrate:prod` by hand; it's safe to repeat.
- Keep migrations **additive** (new tables, new columns, new indexes). Deploys migrate first, so for a few minutes the old code runs against the new schema. Renaming or dropping a column would break live users in that window: do that in two releases (add the new, move the code over, then drop the old).
- **Never edit or delete a migration once it's on `main`.** It may already have run on the live database, which would then be out of step with the code (Drizzle can even skip newer migrations). To undo one, add a new migration that reverses it. CI checks this on every pull request, and a deploy refuses to run if the database has a migration the code doesn't.
- `/health` on the student or teacher site says whether the database is up to date (`"schema": "up to date"`).
- Never run `npm run db:seed` for production. That's the fake sample class, for your computer only.

## After each merge (while testing)

Until real classes start, wipe the test accounts after each merge, once Vercel has finished deploying:

```bash
npm run db:reset:prod
```

It saves a backup in `data/backups`, then asks you to type the database's name before deleting every account and class. Stop doing this once real teachers and students are using Lemmory.

## A Vercel project per site

For each site: **vercel.com → Add New → Project → import `lemmory`**, then:

| Project | Root Directory | Environment Variables |
| --- | --- | --- |
| Main site | `apps/site` | none |
| Teacher site | `apps/teacher` | `DATABASE_URL`, `DATABASE_AUTH_TOKEN` |
| Student site | `apps/student` | `DATABASE_URL`, `DATABASE_AUTH_TOKEN` |

Leave everything else as Vercel detects it (Next.js). For the variables, check **Production** only. Mark the token **Sensitive**.

The student and teacher sites run in Vercel's Cleveland region (`cle1`, set in their `vercel.json`), next to the database in Ohio, so each trip to the database is short.

To copy the token to your clipboard without displaying it (then paste it once, with Cmd+V, into an empty value box):

```bash
grep '^DATABASE_AUTH_TOKEN=' ~/Downloads/Projects/Lemmory/.env.turso | cut -d= -f2- | tr -d '\n' | pbcopy
```

The database address is the `DATABASE_URL=` line in the same file.

After adding or changing a variable, redeploy: **Deployments → ⋯ on the latest one → Redeploy**.

### Previews (one per pull request)

Previews run code that isn't merged yet, so they never use the live database, even if `DATABASE_URL` is checked for Preview. Without a database of their own, the main site works and the student and teacher sites say "This preview has no database". To give previews one, make a separate, empty database once:

```bash
turso db create lemmory-preview
```

```bash
turso db show lemmory-preview --url
```

```bash
turso db tokens create lemmory-preview | tr -d '\n' | pbcopy
```

Then on the teacher and student projects, add `PREVIEW_DATABASE_URL` (the address) and `PREVIEW_DATABASE_AUTH_TOKEN` (paste the copied token), checking **Preview** only. Preview builds apply migrations to it themselves. Test accounts made there never reach the live site.

## Check that it works

Open `/health` on the teacher and student sites:

- https://lemmory-teacher.vercel.app/health
- https://lemmory-student.vercel.app/health

Both should show `"database":"connected"` and `"schema":"up to date"`, and nothing else. If the database can't be reached, the page also says how the variables look (never their values): `MISSING` means that variable isn't set on that project, or was added without redeploying.

Then try the whole thing:

1. On the main site, click **Sign up**. Create a teacher account, pick a plan, and create a class.
2. Open the class's join link in a private window and sign up as a student.
3. As the teacher, assign a formula. Refresh the student's page: it shows up in their cards.

## If the addresses change

If you rename a project or add your own domain (say `teach.lemmory.com`), either update that file and push, or set these in Vercel (**Settings → Environment Variables**) and redeploy:

| On this project | Add |
| --- | --- |
| Main site | `NEXT_PUBLIC_TEACHER_URL`, `NEXT_PUBLIC_STUDENT_URL` |
| Teacher site | `NEXT_PUBLIC_STUDENT_URL` |

## Approving school clubs

On your Mac, `npm run club:verify:prod` lists club pricing requests on the live database. `npm run club:verify:prod -- teacher@school.org` approves one.

## Plan note

Vercel's free Hobby plan is for non-commercial use. Move to Vercel Pro once you start charging customers.
