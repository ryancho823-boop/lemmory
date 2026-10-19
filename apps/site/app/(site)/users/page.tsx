import Link from "next/link";
import { Container, PageIntro } from "@/components/site/blocks";
import { JOIN_URL, SIGNUP_URL } from "@/lib/links";
import { PILOT_DAYS, TIERS } from "@/lib/pricing";
import { ACCENT } from "@/lib/accents";

export const metadata = { title: "Plans and pricing · Lemmory" };

// What a visitor deciding what to buy needs: the plans, how Lemmory compares, and the basics.
const INTRO = {
  title: "Plans and pricing",
  sub: `Pick the plan that matches how you teach. Every teacher plan starts with a free ${PILOT_DAYS}-day pilot, and students in a paid class never pay.`,
};

// "Yes", "No", or a short note. Keep claims about other tools conservative.
const COMPARE = {
  // Podsie: from podsie.org (free, by the nonprofit Teaching Lab; ready-made sets are science).
  columns: ["Lemmory", "Podsie", "Anki", "Quizlet", "Studying alone"],
  rows: [
    { label: "Competition formulas, ready to assign", cells: ["Yes, 187", "No (science sets)", "Make your own", "Make your own", "No"] },
    { label: "Checks typed math in any equivalent form", cells: ["Yes", "Not listed", "No", "No", "No"] },
    { label: "Practice picking the right formula for a problem", cells: ["Yes", "No", "No", "No", "No"] },
    { label: "Reviews spaced so formulas aren't forgotten", cells: ["Yes", "Yes", "Yes", "Partly", "No"] },
    { label: "Teacher sees what the class is forgetting", cells: ["Yes", "Yes", "No", "Partly", "No"] },
    { label: "Class leaderboard", cells: ["Yes", "Not listed", "No", "Partly", "No"] },
  ],
};

// Plain facts, not repeated from the homepage or the plan details.
const GOOD_TO_KNOW = [
  {
    title: "Getting started",
    color: ACCENT.blue,
    items: [
      "Setting up a class takes a few minutes: create it, share the class code or join link, and assign formulas as the course covers them.",
      "Students join with a username and the class code. No email needed, so younger students can join.",
      "Covers the AMC 8, AMC 10/12 and AIME, plus calculus for tournament rounds.",
      "It works alongside your curriculum. You keep teaching the way you do now.",
    ],
  },
  {
    title: "Day to day",
    color: ACCENT.green,
    items: [
      "About five minutes a day, usually 5 to 15 cards.",
      "If a student misses a day, their cards wait for them and their streak resets.",
      "Students can add any formula for extra practice. Extra practice doesn't earn leaderboard points.",
      "Before a contest, Practice all runs through the whole deck without changing the schedule.",
    ],
  },
  {
    title: "For teachers",
    color: ACCENT.rose,
    items: [
      "Run several classes and switch between them from the sidebar.",
      "A student in two of your classes keeps one deck across both.",
      "Students earn 10 points per assigned card plus a streak bonus. Start a new leaderboard game whenever you want.",
    ],
  },
];

export default function ForUsers() {
  return (
    <div>
      <section className="bg-lemon">
        <Container className="pb-16 pt-14 sm:pt-20">
          <PageIntro title={INTRO.title} sub={INTRO.sub} />
        </Container>
      </section>

      <section id="pricing">
        <Container className="py-16">
          <div className="grid gap-5 md:grid-cols-3">
            {TIERS.map((t) => (
              <div key={t.id} className="flex flex-col rounded-lg border-2 border-lemon bg-white p-7">
                <h2 className="text-xl font-semibold">{t.who}</h2>
                <p className="mt-1 text-ink/70">{t.bestFor}</p>
                <p className="mt-6">
                  <span className="text-4xl font-extrabold">{t.price}</span> <span className="text-ink/70">{t.per}</span>
                </p>
                <p className="mt-1 min-h-6 font-semibold">{t.note}</p>
                <a
                  href={t.id === "student" ? JOIN_URL : SIGNUP_URL}
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-ink px-4 font-semibold text-white hover:bg-ink/85"
                >
                  {t.id === "student" ? "Sign up as a student" : "Start a free pilot"}
                </a>
                <Link href={`/plans#${t.id}`} className="mt-3 text-center text-sm font-semibold underline underline-offset-2 hover:text-ink/70">
                  Learn more
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-white py-20">
        <Container>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">How Lemmory compares</h2>
          <div className="mt-8 overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[760px] text-left">
              <thead className="border-b border-line bg-canvas">
                <tr>
                  <th className="px-5 py-3 font-semibold" />
                  {COMPARE.columns.map((c, i) => (
                    <th key={c} className={i === 0 ? "bg-lemon-soft px-4 py-3 font-bold" : "px-4 py-3 font-semibold text-ink/70"}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {COMPARE.rows.map((r) => (
                  <tr key={r.label}>
                    <td className="px-5 py-3">{r.label}</td>
                    {r.cells.map((c, i) => (
                      <td key={i} className={i === 0 ? "bg-lemon-soft px-4 py-3 font-semibold" : "px-4 py-3 text-ink/70"}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-20">
        <Container>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Good to know</h2>
          <div className="mt-8 grid gap-10 md:grid-cols-3">
            {GOOD_TO_KNOW.map((g) => (
              <div key={g.title} className="border-t-4 pt-4" style={{ borderColor: g.color }}>
                <h3 className="text-xl font-extrabold">{g.title}</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-ink/85 marker:text-ink/40">
                  {g.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
