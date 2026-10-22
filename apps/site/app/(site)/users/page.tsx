import Link from "next/link";
import { Container, PageIntro } from "@/components/site/blocks";
import { INDIVIDUAL_SIGNUP_URL, SIGNUP_URL } from "@/lib/links";
import { TRIAL_DAYS, TIERS } from "@/lib/pricing";
import { TOTAL_FORMULAS } from "@/lib/bank";

export const metadata = { title: "Plans and pricing · Lemmory" };

// What a visitor deciding what to buy needs: the plans and how Lemmory compares.
const INTRO = {
  title: "Plans and pricing",
  sub: `Pick the plan that matches how you teach. Every plan starts with a ${TRIAL_DAYS}-day free trial, and students in a paid class never pay.`,
};

// How Lemmory compares with the other ways a contest student or club studies formulas.
// Every cell comes from the tool's own public pages or help center (checked October 2026). A
// dash means we couldn't find it described there; it is not a claim that the tool can't do it.
// Keep claims about other tools conservative, and recheck them now and then.
//   AoPS Alcumus: free adaptive problems; teachers can make classes and see progress.
//   Achievable AMC: $99 for a year; textbook, review questions and practice exams.
//   Podsie: free, by the nonprofit Teaching Lab; teachers write questions or have AI make them.
//   Anki: free spaced repetition on desktop; you make or download the decks.
//   Quizlet: flashcards; about 90 user-made AMC 10 sets.
const COMPARE = {
  columns: ["Lemmory", "AoPS Alcumus", "Achievable AMC", "Podsie", "Anki", "Quizlet"],
  rows: [
    { label: "Price", cells: [`From $2 a month, ${TRIAL_DAYS}-day free trial`, "Free", "$99 a year", "Free", "Free on desktop", "Free, with a paid Plus"] },
    { label: "Made for contest formulas", cells: [`Yes, ${TOTAL_FORMULAS}, every answer machine-checked`, "Problems by topic", "Textbook, review questions, exams", "General tool: you or AI write the cards", "Make your own, or find a shared deck", "About 90 user-made AMC 10 sets"] },
    { label: "Who grades a typed answer", cells: ["Lemmory, in any equivalent form", "Automatic, two tries", "—", "Auto for short answers, you for free response", "You do (it only shows character differences)", "Flashcards: you rate yourself"] },
    { label: "Practice choosing the right formula before solving", cells: ["Yes", "—", "—", "—", "—", "—"] },
    { label: "Reviews come back just before you'd forget", cells: ["Yes (FSRS)", "Some review problems mixed in", "Yes", "Yes", "Yes (FSRS or SM-2)", "Website flashcards only"] },
    { label: "A teacher assigns it and sees the class", cells: ["Yes, and what the class is forgetting", "Teacher classes and progress reports", "Individuals; organizations separately", "Yes, by standard", "No built-in way", "Class Progress needs Plus"] },
    { label: "Class leaderboard", cells: ["Yes", "—", "—", "—", "Third-party add-on", "Quizlet Live game"] },
  ],
};

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
                  href={t.id === "student" ? INDIVIDUAL_SIGNUP_URL : SIGNUP_URL}
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-ink px-4 font-semibold text-white hover:bg-ink/85"
                >
                  {t.id === "student" ? "Sign up as a student" : "Start a free trial"}
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
            <table className="w-full min-w-[1040px] text-left">
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
          <p className="mt-4 max-w-3xl text-sm text-ink/60">
            Based on each tool&apos;s own public pages and help center, October 2026. A dash means we couldn&apos;t find it described there. Tools change, so check before you decide.
          </p>
        </Container>
      </section>
    </div>
  );
}
