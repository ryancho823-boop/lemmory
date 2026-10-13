# Lemmory

Remember every formula. Know when to use it. Spaced-repetition practice for competition math academies.

One repo, three websites:

| | Folder | Local URL | What it is |
| --- | --- | --- | --- |
| **Site** | `apps/site` | http://localhost:3000 | Main website, pricing ("For users"), and the no-login demo |
| **Student site** | `apps/student` | http://localhost:3001 | Students: daily review, deck, formula bank, stats, leaderboard |
| **Teacher site** | `apps/teacher` | http://localhost:3002 | Teachers: plans, classes, assigning, analytics |

The student and teacher sites share one database. **To put it all online, follow [DEPLOY.md](DEPLOY.md).**

Shared code lives in `packages/`:

```
packages/core   Formula bank (187 formulas), FSRS scheduling, grading, analytics. No React, no database.
packages/ui     React components and theme shared by both sites
packages/db     Database schema, migrations, sign-in, and every read and write the app makes
```

## Run it

```bash
npm install
npm run setup   # create data/lemmory.db with a sample class
npm run dev     # all three sites (or dev:site / dev:student / dev:teacher)
npm run check   # verify every formula's grading and every problem's answer
```

The sample accounts, all for local development only, are listed at the top of `packages/db/scripts/seed.ts`. `npm run db:seed` resets the database to the sample data at any time.

## The site (`apps/site`)

| Route | What it is |
| --- | --- |
| `/` | Website: the problem, how it works (with a live card), research |
| `/users` | Who it's for, pricing, how we verify each group, FAQ |
| `/demo`, `/student/*`, `/teacher/*` | The demo: a simulated class saved in the browser. **Skip to tomorrow** shows the scheduler working. |

**Sign up / Log in** go to the teacher and student sites: localhost while developing, the Vercel addresses in DEPLOY.md on Vercel (override with `NEXT_PUBLIC_TEACHER_URL` / `NEXT_PUBLIC_STUDENT_URL`).

The demo is a sales tool, so it only includes 22 of the formulas (`DEMO_IDS` in `apps/site/lib/demo.ts`). Before every `dev` and `build`, `scripts/build-demo-bank.ts` copies that slice out of `packages/core`, and the site imports only the copy, so the rest of the bank never reaches the browser.

## The student and teacher sites

- **Teachers** (`apps/teacher`) sign in with an email: sign up, pick a plan, create classes, share the join code, assign formulas, and see class and student analytics. Switch classes from the sidebar.
- **Students** (`apps/student`) sign in with a username, and join with a class code at `/join`. Daily review, deck, Practice all, formula bank, stats, leaderboard. A student can be in several classes (switch from the sidebar); their deck is shared across them.
- **Grading happens on the server.** The browser only gets the prompt, so answers can't be read ahead of time and points can't be faked. Only the first attempt each day goes to FSRS. Picking the wrong formula ends an application card; it comes back later.
- **Plans** (`packages/db/src/billing.ts`): academies $3/student/month, school clubs $3/student capped at $40/class/month after the school is confirmed, individual students $2/month. **Checkout is simulated**: nothing is charged until a payment provider (e.g. Stripe) is connected. List and approve club requests with `npm run club:verify`.
- **Days** run midnight to midnight in each class's time zone. Past days are filled in when a class loads, so nothing has to run on a schedule.

## Deploying

See [DEPLOY.md](DEPLOY.md): a Turso database, then one Vercel project per folder.

## Not built yet

- Real payments (Stripe Checkout and a webhook in place of the simulated checkout), and blocking reviews when a pilot runs out
- An admin page for approving clubs (it's a command for now)
- Rate limiting on login and sign-up; teacher password reset by email
- Academy accounts with several teachers
- Teacher-made formulas and problems
- A weekly email to teachers and a daily reminder to students
- A privacy and COPPA review before onboarding under-13 students
