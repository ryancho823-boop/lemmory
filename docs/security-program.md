# Lemmory information security program

COPPA requires a written program for protecting children's information. Keep it true, and review it every year.

**Responsible person:** Ryan Cho. **Last risk review:** November 7, 2026. **Next one due:** by November 7, 2027.

## What we protect
Student names, usernames, password hashes, contact emails, parents' emails, classes and practice results. The list on the privacy page is the source of truth.

## Safeguards in place
- Passwords are stored only as one-way hashes. Session, email and parent link tokens are stored as hashes.
- Every server action checks the session, and teachers can reach only their own classes.
- Login, class code, sign-up and email sending are rate limited.
- Secrets live in Vercel and a git-ignored file, never in the repo.
- The `main` branch is protected, and checks run on every pull request.
- There are no ads, analytics or tracking scripts.
- Production data is reachable only through the database token. Anyone who leaves the project loses it, and the token is rotated.

## Service companies
Turso, Vercel, Resend, ImprovMX and Google (support inbox). Before adding one, confirm it will handle the data only for us and keep it secure, and get that in writing. Update the privacy page.

## Yearly risk review
Look at who has access, what's stored and whether we still need it, open security alerts, and each service company's terms. Write down what was found and what changed.

### November 7, 2026
- `npm audit --omit=dev` found no vulnerabilities in anything that ships.
- Two open Dependabot alerts, `minimatch` and `esbuild`, are in development tools only (ESLint and drizzle-kit), so they don't reach users.
- Risks to watch: secrets on one laptop, one person holding all the access, and requests handled by hand.

## If something goes wrong
1. Rotate the affected secrets and stop the exposure.
2. Work out whose information was involved.
3. Tell affected schools and parents without delay, and check state breach notice rules.
4. Write down what happened and what will change.

## Requests and retention
Parent and school requests are answered within 30 days, using `npm run student:data:prod`. Signed forms are kept in the support inbox. The daily job at `/api/cron/privacy` handles retention, as described on the privacy page.
