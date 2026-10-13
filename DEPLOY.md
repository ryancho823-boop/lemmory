# Deploying Lemmory

Three websites, all from this one GitHub repo, plus one database:

| Website | Folder | Netlify site name | Address |
| --- | --- | --- | --- |
| Main site + demo | `apps/site` | `lemmory` | https://lemmory.netlify.app |
| Teacher site | `apps/teacher` | `lemmory-teacher` | https://lemmory-teacher.netlify.app |
| Student site | `apps/student` | `lemmory-student` | https://lemmory-student.netlify.app |
| Database | Turso | `lemmory` | `libsql://…turso.io` |

The sites already know these addresses, so if you use these exact Netlify names, the links between them work with no extra settings.

## Part 1: The database (Turso)

1. Go to **turso.tech** and log in.
2. Click **Create Database**. Name it `lemmory`. For the location, pick the one closest to your users (for example US West). Click **Create**.
3. On the database's page, copy its **URL**. It starts with `libsql://`.
4. On the same page, click **Create Token** (sometimes **Generate Token**). Choose **Read & Write** and **no expiration**. Copy the token. You only see it once.
5. On your Mac, open Terminal and run these one at a time:

   ```bash
   cd ~/Downloads/Projects/Lemmory
   ```
   ```bash
   cp .env.turso.example .env.turso
   ```
   ```bash
   open -e .env.turso
   ```

   A TextEdit window opens. Replace the two example values with your URL and token, then save and close.
   `.env.turso` never gets uploaded to GitHub.
6. Create the database tables:

   ```bash
   npm run db:migrate:prod
   ```

   It should end with `Migrated libsql://…`. The database is ready, and empty.

Never run `npm run db:seed` for production. That's the fake sample class, for your computer only.

## Part 2: The teacher site on Netlify

1. Go to **app.netlify.com** → **Add new site** (or **Add new project**) → **Import an existing project** → **GitHub** → **lemmory**.
2. On the **Review configuration** screen:
   - **Project name**: `lemmory-teacher`
   - **Project to deploy**: `apps/teacher`
   - Leave the branch (`main`), build command (`npm run build`) and publish directory (`.next`) as they are.
3. On the same screen, click **Add environment variables** and add two:
   - `DATABASE_URL`: the `libsql://…` URL
   - `DATABASE_AUTH_TOKEN`: the token
4. Click **Deploy**.

## Part 3: The student site on Netlify

The same steps as Part 2, with **Project name** `lemmory-student` and **Project to deploy** `apps/student`. It needs the same two database variables.

## Part 4: The main site

Import the repo the same way, with **Project name** `lemmory` and **Project to deploy** `apps/site`. It needs no environment variables: its Sign up and Log in buttons already point at `lemmory-teacher` and `lemmory-student`.

## If a Netlify name is taken

Pick any free names, then tell the sites where each other live. In Netlify, under **Site configuration → Environment variables**:

| On this site | Add |
| --- | --- |
| Main site | `NEXT_PUBLIC_TEACHER_URL` = your teacher address, and `NEXT_PUBLIC_STUDENT_URL` = your student address |
| Teacher site | `NEXT_PUBLIC_STUDENT_URL` = your student address |

Then redeploy those sites: **Deploys → Trigger deploy → Clear cache and deploy site**. These addresses are built into the page, so they only take effect after a new deploy. Do the same if you later move to your own domain (say `teach.lemmory.com`).

## Part 5: Try it live

1. Open https://lemmory.netlify.app and click **Sign up**. Create a teacher account, pick a plan, and create a class.
2. Copy the class's join link. In a private browser window, open it and sign up as a student.
3. As the teacher, assign a formula. Refresh the student's page: it shows up in their cards.

## Every day after that

- Push to GitHub's `main` branch, and all three sites redeploy on their own.
- After changing `packages/db/src/schema.ts`, run `npm run db:generate`, commit the new migration, and run `npm run db:migrate:prod`.
- To approve a school club's pricing, run `npm run club:verify:prod` to list requests, then `npm run club:verify:prod -- teacher@school.org`.

## If something fails

- **A deploy fails.** Open the failed deploy, scroll to the red lines at the bottom of the log, and send them over.
- **The teacher or student site shows "Application error".** Check that both database variables are set on that site, with no spaces around the values, then redeploy.
