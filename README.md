# Lemmory

Remember every formula. Know when to use it. Spaced-repetition practice for competition math academies.

One repo, three websites. The student and teacher sites share one database.

| Website | Folder | Local URL | What it is |
| --- | --- | --- | --- |
| **Main site** | `apps/site` | http://localhost:3000 | The pitch, pricing ("For users"), the log-in chooser, and the no-login demo |
| **Student site** | `apps/student` | http://localhost:3001 | Students sign up with a class code and do their daily review |
| **Teacher site** | `apps/teacher` | http://localhost:3002 | Teachers pick a plan, create classes, assign formulas, and see analytics |

Shared code lives in `packages/`:

```
packages/core   Formula bank (187 formulas, 378 problems), FSRS scheduling, grading, analytics. No React, no database.
packages/ui     React components, theme and the app icon, shared by all three sites
packages/db     Database schema, migrations, accounts and sessions, plans, and every read and write the sites make
```

## Run it

```bash
npm install
npm run setup   # create data/lemmory.db with a sample class
npm run dev     # all three sites (or dev:site / dev:student / dev:teacher)
```

The sample accounts (local only) are listed at the top of `packages/db/scripts/seed.ts`. `npm run db:seed` resets the local database to the sample data at any time.

Other commands:

| Command | What it does |
| --- | --- |
| `npm run check` | Verifies every formula's grading and every problem's answer |
| `npm run typecheck` / `npm run lint` / `npm run build` | All three sites |
| `npm run db:generate` | Writes a migration after a change to `packages/db/src/schema.ts` |
| `npm run club:verify` | Lists school clubs waiting for club pricing; add a teacher's email to approve one |

## Logging in and signing up

- **Log in.** The main site's only button is **Log in** (`/login`), which asks "teacher or student?" and opens that site's login page: "Teacher log in" (email) or "Student log in" (username). Each has a **New? Sign up** link.
- **Sign up.** One page with a **Teacher | Student** switch at the top. Teacher (`apps/teacher` at `/signup`): name, email, password. Student (`apps/student` at `/join`): class code, name, username, password. The switch links between the two sites.
- **No account yet.** Logging in with an email or username that doesn't exist goes to sign-up with it filled in (carried in a short-lived cookie, not the URL).
- Already-logged-in visitors skip the login page. Sessions last 30 days.
- **Teachers confirm their email.** After signing up, a teacher gets a link by email and sees "Check your email" (`/verify`) until they click it (`/confirm`). The link works once, for 24 hours; **Send it again** makes a new one and the old one stops working.
- **Forgot password (teachers).** **Forgot your password?** on the login page emails a link to set a new one (`/forgot` → `/reset`). The link works once, for an hour, and signs the account out everywhere. At most one email per account every 2 minutes, and the page says the same thing whether or not the email has an account.
- **Forgot password (students).** Students have no email by default, so their teacher clicks **Make a reset code** on the student's page. The student enters it at `/forgot` on the student site with a new password they choose, so the teacher never knows it. A code works once, for 24 hours, and stops working after 5 wrong tries; making a new one cancels the old one.
- **Recovery email (students 13 and older, optional).** On **My classes**, a student can add an email and confirm it by link. Then **Forgot your password?** can email them a reset link instead. Each site only accepts its own reset links.

Locally the sites link to each other on localhost. Online they use the addresses in `apps/site/lib/links.ts`, `apps/teacher/lib/session.ts` and `apps/student/lib/links.ts`, which `NEXT_PUBLIC_TEACHER_URL` / `NEXT_PUBLIC_STUDENT_URL` override.

## The main site (`apps/site`)

| Route | What it is |
| --- | --- |
| `/` | The problem, how it works (with a live card to try), research |
| `/users` | Who it's for, pricing, how we verify each group, FAQ (`/academies` redirects here) |
| `/login` | Teacher or student? |
| `/demo`, `/student/*`, `/teacher/*` | The demo: a simulated class of 13 saved in the browser. **Skip to tomorrow** shows the scheduler working (up to 30 days ahead). |

The demo only includes 22 of the formulas (`DEMO_IDS` in `apps/site/lib/demo.ts`). Before every `dev` and `build`, `scripts/build-demo-bank.ts` copies that slice out of `packages/core`, and the site imports only the copy, so the rest of the bank never reaches the browser. The other formulas show as locked names.

## The teacher site (`apps/teacher`)

- Sign up → pick a plan → create a class → share its code or join link → assign formulas.
- Pages: Overview (who finished today, what the class is forgetting, who needs attention), Assign formulas, Formula analytics (accuracy, recall vs. application, mix-ups), Students (per-student stats, reset codes, remove or kick out), Leaderboard (start a new game), Class settings (contest date, time zone, new join code), Plan & billing, Preferences.
- **Remove vs. kick out.** Both take a student out of the class and keep their account and history. A removed student can rejoin with the class code; a kicked-out student can't until the teacher clicks **Let back in** on the Students page.
- **Weekly email.** Every Monday each teacher gets an email per class: who's behind on reviews or under 60% right on the first try (the same list as "Needs attention"), and the assigned formulas the class is forgetting. It's on by default; teachers turn it off in **Preferences**. Teachers without students or with an ended plan get nothing.
- A teacher can run several classes and switch between them from the sidebar.

## The student site (`apps/student`)

- Sign up with a class code. Pages: Home (today's cards), Review, My deck, Practice all (cram mode, not recorded), Formula bank, My stats, Leaderboard, My classes.
- A student can be in several classes (switch from the sidebar). Their deck is shared across all of them.
- **Recall cards:** type the formula with Desmos-style input; any equivalent form counts, and a one-letter typo gets one free retry.
- **Application cards:** pick the formula(s) a problem needs, then solve it. A wrong pick ends the card, and it comes back later.
- **Points:** 10 per assigned card, plus a streak bonus (+5 per streak day, up to +100). Self-added cards earn nothing.

## How it works

- **Scheduling.** [FSRS](https://github.com/open-spaced-repetition/ts-fsrs) with a 90% target retention. Only the first attempt each day counts; misses come back until they're right. At most 6 new cards a day. A card moves from recall to application once its stability reaches 10 days.
- **Grading happens on the server.** The browser only gets the prompt, so answers can't be read ahead of time and points can't be faked. Typed math is checked numerically with [Compute Engine](https://cortexjs.io/compute-engine/).
- **Days** run midnight to midnight in each class's time zone. Past days are filled in when a class loads, so nothing has to run on a schedule.
- **Privacy.** Students sign up with a username, no email (13 and older can add one for password recovery). Students see classmates only as leaderboard rows, never their review history.

## Plans (`packages/db/src/billing.ts`)

| Plan | Price | Notes |
| --- | --- | --- |
| Free pilot | $0 for 14 days | Once per teacher; it can't be restarted |
| Academy | $3 per student per month | A student in two of the teacher's classes counts once |
| School math club | $3 per student, capped at $40 per class per month | Needs a school email; the cap applies once the club is confirmed (`npm run club:verify`). Until then it runs on the pilot |
| Individual student | $2 per month | For students not in a class |

When a pilot ends unpaid, the teacher is sent to the plan page and their students can't start reviews until a plan is picked. Nothing is lost. **Checkout is simulated:** no payment provider is connected, so nothing is charged.

## Email (`packages/db/src/mail.ts`)

Emails go out through [Resend](https://resend.com) when `RESEND_API_KEY` is set (on the teacher site, and on the student site for recovery emails). Without it, local development prints each email (including confirmation and reset links) to the terminal running that site and saves it as a web page in `data/outbox`, and production logs that it wasn't sent.

The weekly email is sent by `GET /api/cron/weekly-report` on the teacher site, which Vercel Cron calls every Monday at 15:00 UTC (`apps/teacher/vercel.json`). It needs `Authorization: Bearer $CRON_SECRET`. Running it twice in a week is safe: teachers emailed in the last 6 days are skipped. To try it locally, start the teacher site with `CRON_SECRET=test npm run dev:teacher` and run `curl -H "Authorization: Bearer test" localhost:3002/api/cron/weekly-report`.

## Deploying

See [DEPLOY.md](DEPLOY.md). Each site has a `/health` page (student and teacher) that shows whether the database is reachable, without revealing any secrets.

## Not built yet

- Real payments in place of the simulated checkout
- An admin page for approving school clubs (it's a command for now)
- Rate limiting on login and sign-up
- Academy accounts with several teachers
- Teacher-made formulas and problems
- A daily reminder to students
- A privacy and COPPA review before onboarding students under 13
