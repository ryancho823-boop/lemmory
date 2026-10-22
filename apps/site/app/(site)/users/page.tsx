import Link from "next/link";
import { Container, PageIntro } from "@/components/site/blocks";
import { INDIVIDUAL_SIGNUP_URL, SIGNUP_URL } from "@/lib/links";
import { TIER_ACCENT, TRIAL_DAYS, TIERS } from "@/lib/pricing";
import { TOTAL_FORMULAS } from "@/lib/bank";

export const metadata = { title: "Plans and pricing · Lemmory" };

// What a visitor deciding what to buy needs: the plans and how Lemmory compares.
const INTRO = {
  title: "Plans and pricing",
  sub: `Pick the plan that matches how you teach. Every plan starts with a ${TRIAL_DAYS}-day free trial, and students in a paid class never pay.`,
};

// How Lemmory compares with the other ways contest students and clubs study. Keep claims about
// other tools conservative and recheck them now and then (last checked October 2026).
const COMPARE = {
  columns: ["Lemmory", "AoPS Alcumus", "Achievable AMC", "Podsie", "Quizlet", "Anki"],
  rows: [
    { label: "Built for math competitions", cells: [`Yes, ${TOTAL_FORMULAS} formulas`, "Problems only", "Yes", "No", "No", "No"] },
    { label: "Keeps formulas from being forgotten", cells: ["Yes", "Partly", "Yes", "Yes", "Partly", "Yes"] },
    { label: "Teaches when to use each formula", cells: ["Yes", "Problems only", "Problems only", "Write your own", "Make your own", "Make your own"] },
    { label: "Grades math in any equivalent form", cells: ["Yes", "Numbers only", "Multiple choice", "Partly", "No", "No"] },
    { label: "Ready to use on day one", cells: ["Yes", "Yes", "Yes", "Write your own", "Make your own", "Make your own"] },
    { label: "Shows what the class is forgetting", cells: ["Yes", "Reports", "No", "By standard", "Plus only", "No"] },
    { label: "Price", cells: ["From $2/mo", "Free", "$99/yr", "Free", "Free, Plus $36/yr", "Free"] },
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
              <div key={t.id} className={`flex flex-col rounded-lg border border-t-4 border-line bg-white p-7 ${TIER_ACCENT[t.id].top}`}>
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
            <table className="w-full min-w-[880px] text-left">
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
    </div>
  );
}
