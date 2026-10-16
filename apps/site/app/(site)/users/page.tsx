import { ChevronDown } from "lucide-react";
import { TOTAL_FORMULAS } from "@/lib/bank";
import { PageIntro } from "@/components/site/SiteChrome";
import { JOIN_URL, SIGNUP_URL } from "@/lib/links";
import { PILOT_DAYS, TIERS } from "@/lib/pricing";

export const metadata = { title: "For users · Lemmory" };

const BENEFITS = [
  { title: "One-click assignments", body: "Pick formulas from the bank as the course covers them. Scheduling handles the rest." },
  { title: "Review is homework", body: "Because it counts, students actually do it. That's where standalone flashcard apps fail." },
  { title: "See what to reteach", body: "Class analytics show which formulas are fading and which ones students confuse." },
  { title: "Class competitions", body: "A class leaderboard with streak bonuses. Start a new game whenever you want." },
];

// A static preview of the teacher dashboard's "forgetting" panel.
const PREVIEW = [
  { name: "Inscribed Angle Theorem", v: 0.62 },
  { name: "Number of Divisors", v: 0.64 },
  { name: "Power of a Point", v: 0.71 },
  { name: "Heron's Formula", v: 0.79 },
  { name: "Arithmetic Series", v: 0.88 },
];

const FAQ = [
  {
    q: "Why are there different prices?",
    a: "Academies charge for contest prep, so they pay the standard $3 per student. School clubs are usually free for students, so their price is capped at $40 per class a month. Individual students pay $2 a month for their own deck.",
  },
  {
    q: "How do you know a math club is really a school club?",
    a: "Club sign-ups need a school email address and the school's name, and we confirm with the school before the club price applies. A program that charges students tuition counts as an academy.",
  },
  {
    q: "Could an academy just have its students buy the $2 plan?",
    a: "Students could, but the teacher would lose everything that makes Lemmory useful for a class: assigning formulas, class analytics, and the leaderboard. Individual accounts can't be grouped into a class.",
  },
  {
    q: "How long does it take students each day?",
    a: "About five minutes. Each day's review only includes the cards that are due, usually 5 to 15.",
  },
  {
    q: "How is it different from Anki or Quizlet?",
    a: "Those only have the cards people make. Lemmory comes with a ready-to-assign competition formula bank, grades typed math (any equivalent form counts), trains students to recognize which formula a problem needs, and gives teachers class analytics.",
  },
  {
    q: "How does the scheduling work?",
    a: "We use FSRS, the open-source algorithm Anki adopted in 2023. It estimates how well each student remembers each formula and brings the card back when predicted recall drops to 90%.",
  },
  {
    q: "What happens if a student misses a day?",
    a: "Their cards wait for them and their streak resets. Teachers can see who's behind, and the student's calendar shows which days they missed and by how much.",
  },
  {
    q: "Can students add their own formulas?",
    a: "Yes. Any formula in the bank can go into a student's personal deck as extra practice. Only teacher-assigned cards earn leaderboard points, so the competition stays fair.",
  },
  {
    q: "What about right before the contest?",
    a: "Students can run Practice all to go through their whole deck at once. It doesn't affect their schedule or points, so it's pure short-term review.",
  },
  {
    q: "Which contests does it cover?",
    a: `${TOTAL_FORMULAS} formulas spanning AMC 8, AMC 10/12 and AIME across algebra, geometry, trigonometry, number theory, combinatorics and probability, plus calculus for tournament calculus rounds.`,
  },
  {
    q: "Does it replace our curriculum?",
    a: "No. You teach the way you already do and assign each week's formulas to match. Lemmory handles the review between classes.",
  },
];

export default function ForUsers() {
  return (
    <div>
      <section className="bg-lemon">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-14 sm:pt-20">
          <PageIntro
            title="For academies, math clubs, and students"
            sub="A retention tool that runs between classes, with no extra work for teachers. Every plan starts with a free pilot."
          />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-16">
        <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <li key={b.title} className="border-t-4 pt-4" style={{ borderColor: ["#e11d48", "#2563eb", "#16a34a", "#9333ea"][i] }}>
              <h3 className="text-lg font-extrabold">{b.title}</h3>
              <p className="mt-1.5 leading-relaxed text-ink/80">{b.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-line bg-white py-20">
        <div className="mx-auto grid max-w-6xl px-5 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight">Know what to reteach before the contest</h2>
            <p className="mt-4 leading-relaxed text-ink/80">
              Every review feeds the class dashboard: which formulas the class is forgetting, which students fell behind, and
              which look-alike formulas students mix up.
            </p>
          </div>
          <figure>
            <div className="rounded-lg border border-ink/15 bg-white p-6">
              <p className="font-bold">What the class is forgetting</p>
              <ul className="mt-4 space-y-3">
                {PREVIEW.map((p) => (
                  <li key={p.name} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 sm:grid-cols-[170px_1fr_auto]">
                    <span className="truncate text-sm">{p.name}</span>
                    <span className="text-right text-sm font-semibold tabular-nums sm:order-last">{Math.round(p.v * 100)}%</span>
                    <span className="col-span-2 h-2 rounded-sm bg-ink/6 sm:col-span-1">
                      <span
                        className="block h-full rounded-sm"
                        style={{ width: `${p.v * 100}%`, background: p.v >= 0.8 ? "var(--color-good)" : p.v >= 0.65 ? "var(--color-warn)" : "var(--color-bad)" }}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <figcaption className="mt-3 text-sm text-ink/60">From the teacher dashboard: right on the first try, last 14 days.</figcaption>
          </figure>
        </div>
      </section>

      <section id="pricing" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-3xl font-extrabold">Pricing</h2>
          <p className="mt-3 max-w-xl text-lg text-ink/80">Teachers start with a free {PILOT_DAYS}-day pilot. Students in a paid class never pay.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {TIERS.map((t) => (
              <div key={t.id} className="flex flex-col rounded-lg border-2 border-lemon bg-white p-7">
                <h3 className="text-lg font-semibold">{t.who}</h3>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold">{t.price}</span> <span className="text-ink/70">{t.per}</span>
                </p>
                {t.note && <p className="mt-1 font-semibold">{t.note}</p>}
                <p className="mt-3 leading-relaxed text-ink/80">{t.body}</p>
                <div className="mt-5 flex-1 border-t border-line pt-4">
                  <p className="text-sm font-semibold">How we check</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink/75">{t.verify}</p>
                </div>
                <a
                  href={t.id === "student" ? JOIN_URL : SIGNUP_URL}
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-ink px-4 font-semibold text-white hover:bg-ink/85"
                >
                  {t.id === "student" ? "Sign up as a student" : "Start a free pilot"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line py-20">
        <div className="mx-auto grid max-w-6xl px-5 gap-10 lg:grid-cols-[1fr_2fr]">
          <h2 className="text-3xl font-extrabold tracking-tight">Questions</h2>
          <div className="divide-y divide-line border-y border-line">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold">
                  {f.q}
                  <ChevronDown size={18} className="shrink-0 text-ink/50 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-ink/80">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
