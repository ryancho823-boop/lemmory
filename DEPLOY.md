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

Leave everything else as Vercel detects it (Next.js). For the variables, check **Production** and **Preview** and leave **Development** unchecked. Mark the token **Sensitive**.

To copy the token to your clipboard without displaying it (then paste it once, with Cmd+V, into an empty value box):

```bash
grep '^DATABASE_AUTH_TOKEN=' ~/Downloads/Projects/Lemmory/.env.turso | cut -d= -f2- | tr -d '\n' | pbcopy
```

The database address is the `DATABASE_URL=` line in the same file.

After adding or changing a variable, redeploy: **Deployments → ⋯ on the latest one → Redeploy**.

## Check that it works

Open `/health` on the teacher and student sites:

- https://lemmory-teacher.vercel.app/health
- https://lemmory-student.vercel.app/health

Both should show `"database":"connected"` and `"token_shape":"348 characters, 3 parts"`. It never shows the token itself. If one says `MISSING`, that variable isn't set on that project (or it was added without redeploying).

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
