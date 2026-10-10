# Lemmory

Remember every formula. Know when to use it. Spaced-repetition practice for competition math academies.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run check   # verify every formula's grading and every problem's answer
```

## Pages

| Route | What it is |
| --- | --- |
| `/` | Website: numbers, the problem, mission, how it works (with a live, clickable card), research |
| `/academies` | What we sell, who it's for, FAQ |
| `/demo` | Pick the student or teacher view |
| `/student/*` | Home (start today's cards), deck, Practice all (pre-contest cram, not saved), formula bank, stats, leaderboard |
| `/teacher/*` | Class overview, assigning formulas, per-formula and per-student analytics, leaderboard where the teacher can start a new game |

Both views share one simulated class, so a review you finish as the student shows up in the teacher view.
Use **Skip to tomorrow** in the sidebar to watch the scheduler work, and **Reset demo** to start over.

## How it works

- **Content** (`lib/content/`): 155 formulas in 7 topics. Each has recall prompts, a "when to use it" note, links to look-alike formulas, and at least 2 practice problems.
- **Grading** (`lib/grade.ts`): typed math is checked numerically with [Compute Engine](https://cortexjs.io/compute-engine/), so any equivalent form counts. Each prompt can also ban retyping the left-hand side or require a factored or expanded form.
- **Scheduling** (`lib/srs.ts`): [FSRS](https://github.com/open-spaced-repetition/ts-fsrs) with default parameters and a 90% target retention. Only the first attempt each day counts toward scheduling; misses come back until the student gets them right. A card moves from recall to application once its stability reaches 10 days.
- **Points**: 10 per finished assigned card, however many tries it takes, plus a streak bonus for finishing the day's review (+5 per streak day, up to +100). Self-added cards and Practice all earn nothing. The teacher can start a new leaderboard game anytime; streaks and all-time points carry over.
- **Simulated class** (`lib/sim.ts`): 12 classmates run the real scheduler day by day, with a seeded model deciding whether each answer is right. Every chart is computed from review logs (`lib/analytics.ts`).
- **State** (`lib/store.tsx`): the demo student's data is saved in `localStorage`. A real version would need accounts and a database.
