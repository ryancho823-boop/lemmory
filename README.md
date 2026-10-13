# Lemmory

Remember every formula. Know when to use it. Spaced-repetition practice for competition math academies.

One repo, two websites:

| | Folder | Local URL | What it is |
| --- | --- | --- | --- |
| **Site** | `apps/site` | http://localhost:3000 | Main website, pricing ("For users"), and the no-login demo |
| **App** | `apps/app` | http://localhost:3001 | The real product: one login for teachers (`/teach`) and students (`/learn`) |

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
npm run dev     # both sites (or dev:site / dev:app)
npm run check   # verify every formula's grading and every problem's answer
```

The sample accounts, all for local development only, are listed at the top of `packages/db/scripts/seed.ts`. `npm run db:seed` resets the database to the sample data at any time.

## The site (`apps/site`)

| Route | What it is |
| --- | --- |
| `/` | Website: the problem, how it works (with a live card), research |
| `/users` | Who it's for, pricing, how we verify each group, FAQ |
| `/demo`, `/student/*`, `/teacher/*` | The demo: a simulated class saved in the browser. **Skip to tomorrow** shows the scheduler working. |

The demo is a sales tool, so it only includes 22 of the formulas (`DEMO_IDS` in `apps/site/lib/demo.ts`). Before every `dev` and `build`, `scripts/build-demo-bank.ts` copies that slice out of `packages/core`, and the site imports only the copy, so the rest of the bank never reaches the browser. Sign up and Log in send people to the app (`NEXT_PUBLIC_APP_URL`).

## The app (`apps/app`)

- **One login** at `/login`: an email signs in a teacher, a username signs in a student. `/signup` makes a teacher account; `/join` makes a student account from a class code.
- **Teachers** (`/teach`): sign up, pick a plan, create classes, share the join code, assign formulas, and see class and student analytics. Switch classes from the sidebar.
- **Students** (`/learn`): daily review, deck, Practice all, formula bank, stats, leaderboard. A student can be in several classes (switch from the sidebar); their deck is shared across them.
- **Grading happens on the server.** The browser only gets the prompt, so answers can't be read ahead of time and points can't be faked. Only the first attempt each day goes to FSRS. Picking the wrong formula ends an application card; it comes back later.
- **Plans** (`packages/db/src/billing.ts`): academies $3/student/month, school clubs $3/student capped at $40/class/month after the school is confirmed, individual students $2/month. **Checkout is simulated**: nothing is charged until a payment provider (e.g. Stripe) is connected. List and approve club requests with `npm run club:verify`.
- **Days** run midnight to midnight in each class's time zone. Past days are filled in when a class loads, so nothing has to run on a schedule.

## Deploying

### 1. Database (Turso)

Locally the app uses a SQLite file (`data/lemmory.db`). Hosts like Netlify can't keep files, so production needs a hosted database. Turso runs the same database engine, so no code changes are needed.

```bash
brew install tursodatabase/tap/turso
turso auth signup
turso db create lemmory
turso db show lemmory --url
turso db tokens create lemmory
```

Then create the tables (use the URL and token from the commands above):

```bash
DATABASE_URL="libsql://…" DATABASE_AUTH_TOKEN="…" npm run db:migrate
```

Don't run `db:seed` against production: it deletes everything first (it refuses unless you pass `--force`).

### 2. Netlify: two sites from this repo

Create two Netlify sites, both from this GitHub repo:

| | Package directory | Environment variables |
| --- | --- | --- |
| Site | `apps/site` | `NEXT_PUBLIC_APP_URL` = the app's address, e.g. `https://app.lemmory.com` |
| App | `apps/app` | `DATABASE_URL`, `DATABASE_AUTH_TOKEN` |

For each: **Add new site → Import an existing project → GitHub → lemmory**. Leave **Base directory** empty and set **Package directory** as above. The build command and publish directory come from each folder's `netlify.toml`. Add the environment variables under **Site configuration → Environment variables**, then redeploy.

## Not built yet

- Real payments (Stripe Checkout and a webhook in place of the simulated checkout), and blocking reviews when a pilot runs out
- An admin page for approving clubs (it's a command for now)
- Rate limiting on login and sign-up; teacher password reset by email
- Academy accounts with several teachers
- Teacher-made formulas and problems
- A weekly email to teachers and a daily reminder to students
- A privacy and COPPA review before onboarding under-13 students
