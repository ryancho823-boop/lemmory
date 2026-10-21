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

Where to change common things:

| To change | Edit |
| --- | --- |
| Prices or the trial length | `packages/core/src/plans.ts` (the pricing page and billing both read it) |
| The student and teacher site addresses | `packages/core/src/urls.ts` |
| Colors and fonts | `packages/ui/src/theme.css` (all three sites) |
| The main site's accent colors | `apps/site/lib/accents.ts` |
| Homepage wording | `TEXT` at the top of `apps/site/app/(site)/page.tsx` |
| Plans and the comparison chart | `apps/site/lib/pricing.ts` and `apps/site/app/(site)/users/page.tsx` |

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
- **Sign up.** One page with a **Teacher | Student** switch at the top. Teacher (`apps/teacher` at `/signup`): name, email, password. Student (`apps/student` at `/join`): class code, first and last name, username, password. The switch links between the two sites.
- **Students on their own.** `/join?own=1` (linked as "No class code? Sign up on your own", and from the pricing pages) skips the class code. They land on **Plan & classes** to get the individual plan; without a class or that plan they can browse the bank but not review.
- **No account yet.** Logging in with an email or username that doesn't exist goes to sign-up with it filled in (carried in a short-lived cookie, not the URL).
- Already-logged-in visitors skip the login page. Sessions last 30 days.

Locally the sites link to each other on localhost. Online they use the addresses in `packages/core/src/urls.ts`, which `NEXT_PUBLIC_TEACHER_URL` / `NEXT_PUBLIC_STUDENT_URL` override.

## The main site (`apps/site`)

| Route | What it is |
| --- | --- |
| `/` | The problem, how it works (with a live card to try), research |
| `/users` | Plans and pricing, and how Lemmory compares with Podsie, Anki and Quizlet (`/academies` redirects here) |
| `/plans` | Plan details: a button per plan showing what it includes, what it costs and how to start (`/plans#club` opens one) |
| `/login` | Teacher or student? |
| `/demo`, `/student/*`, `/teacher/*` | The demo: a simulated class of 13 saved in the browser. **Skip to tomorrow** shows the scheduler working (up to 30 days ahead). |

The demo only includes 22 of the formulas (`DEMO_IDS` in `apps/site/lib/demo.ts`). Before every `dev` and `build`, `scripts/build-demo-bank.ts` copies that slice out of `packages/core`, and the site imports only the copy, so the rest of the bank never reaches the browser. The other formulas show as locked names.

## The teacher site (`apps/teacher`)

- Sign up → pick a plan → create a class → share its code or join link → assign formulas.
- Pages: Overview (who finished today, what the class is forgetting, who needs attention), Assign formulas, Formula analytics (accuracy, recall vs. application, mix-ups), Students (per-student stats, password reset, remove), Leaderboard (start a new game), Class settings (contest date, time zone, new join code), Plan & billing.
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
- **Privacy.** Students sign up with a username, no email. Students see classmates only as leaderboard rows, never their review history.

## Plans (prices in `packages/core/src/plans.ts`, billing in `packages/db/src/billing.ts`)

| Plan | Price | Notes |
| --- | --- | --- |
| Free trial | $0 for 14 days | Once per teacher; it can't be restarted |
| Academy | $3 per student per month | A student in two of the teacher's classes counts once |
| School math club | $3 per student, never over $20 a month per class | Needs a school email; the cap applies once the club is confirmed (`npm run club:verify`). Until then it runs on the trial |
| Individual student | $2 per month | For students not in a class |

When a trial ends unpaid, the teacher is sent to the plan page and their students can't start reviews until a plan is picked. Nothing is lost. **Checkout is simulated:** no payment provider is connected, so nothing is charged.

## Deploying

See [DEPLOY.md](DEPLOY.md). Each site has a `/health` page (student and teacher) that shows whether the database is reachable, without revealing any secrets.

## Not built yet

- Real payments in place of the simulated checkout
- An admin page for approving school clubs (it's a command for now)
- Teacher password reset by email (a signed-in teacher can change their password; students can ask their teacher to reset theirs)
- Academy accounts with several teachers
- Teacher-made formulas and problems
- A weekly email to teachers and a daily reminder to students
- A privacy and COPPA review before onboarding students under 13
