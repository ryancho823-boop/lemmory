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

- After changing `packages/db/src/schema.ts`: run `npm run db:generate`, commit the new migration, and run `npm run db:migrate:prod`.
- Never run `npm run db:seed` for production. That's the fake sample class, for your computer only.

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

Both should show `"database":"connected (… accounts)"` and `"token_shape":"348 characters, 3 parts"`. It never shows the token itself. If one says `MISSING`, that variable isn't set on that project (or it was added without redeploying).

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
