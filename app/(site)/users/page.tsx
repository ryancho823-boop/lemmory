import { BarChart3, CalendarCheck, ChevronDown, MousePointerClick, Users } from "lucide-react";
import { TOTAL_FORMULAS } from "@/lib/bank";
import { PageIntro } from "@/components/site/SiteChrome";
import { SIGNUP_URL, STUDENT_URL } from "@/lib/links";
import { PILOT_DAYS, TIERS } from "@/lib/pricing";

export const metadata = { title: "For users · Lemmory" };

const BENEFITS = [
  { icon: MousePointerClick, title: "One-click assignments", body: "Pick formulas from the bank as the course covers them. Scheduling handles the rest." },
  { icon: CalendarCheck, title: "Review is homework", body: "Because it counts, students actually do it. That's where standalone flashcard apps fail." },
  { icon: BarChart3, title: "See what to reteach", body: "Class analytics show which formulas are fading and which ones students confuse." },
  { icon: Users, title: "Class competitions", body: "A class leaderboard with streak bonuses. Start a new game whenever you want." },
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
      <section className="px-5 pb-20 pt-16 sm:pt-20">
        <PageIntro
          eyebrow="For users"
          title="For academies, math clubs, and students"
          sub="A retention tool that runs between classes, with no extra work for teachers. Every plan starts with a free pilot."
        />
        <div className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-3xl border border-line p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-lemon-soft">
                <b.icon size={20} />
              </span>
              <h3 className="mt-5 font-bold tracking-tight">{b.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-canvas px-5 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight">Know what to reteach before the contest</h2>
            <p className="mt-4 leading-relaxed text-ink/60">
              Every review feeds the class dashboard: which formulas the class is forgetting, which students fell behind, and
              which look-alike formulas students mix up.
            </p>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_30px_70px_-40px_rgb(15_17_33/0.35)]">
            <p className="text-[15px] font-bold">What the class is forgetting</p>
            <p className="text-sm text-ink/50">Right on first try, last 14 days</p>
            <ul className="mt-5 space-y-3">
              {PREVIEW.map((p) => (
                <li key={p.name} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 sm:grid-cols-[170px_1fr_auto]">
                  <span className="truncate text-sm">{p.name}</span>
                  <span className="text-right text-sm font-semibold tabular-nums sm:order-last">{Math.round(p.v * 100)}%</span>
                  <span className="col-span-2 h-2.5 rounded-full bg-ink/6 sm:col-span-1">
                    <span
                      className="block h-full rounded-full"
                      style={{ width: `${p.v * 100}%`, background: p.v >= 0.8 ? "var(--color-good)" : p.v >= 0.65 ? "var(--color-warn)" : "var(--color-bad)" }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-center text-3xl font-extrabold">Pricing</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-ink/75">
          Teachers start with a free {PILOT_DAYS}-day pilot. Students in a paid class never pay.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TIERS.map((t) => (
            <div key={t.id} className="flex flex-col rounded-2xl border-2 border-lemon bg-white p-7">
              <h3 className="text-lg font-semibold">{t.who}</h3>
              <p className="mt-4">
                <span className="text-4xl font-extrabold">{t.price}</span> <span className="text-ink/70">{t.per}</span>
              </p>
              {t.note && <p className="mt-1 font-semibold">{t.note}</p>}
              <p className="mt-3 leading-relaxed text-ink/75">{t.body}</p>
              <div className="mt-5 flex-1 rounded-xl bg-canvas p-4">
                <p className="text-sm font-semibold">How we check</p>
                <p className="mt-1 text-sm leading-relaxed text-ink/75">{t.verify}</p>
              </div>
              <a
                href={t.id === "student" ? `${STUDENT_URL}/join` : SIGNUP_URL}
                className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-ink px-4 font-semibold text-white hover:bg-ink/85"
              >
                {t.id === "student" ? "Sign up as a student" : "Start a free pilot"}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-canvas px-5 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight">FAQ</h2>
          <div className="mt-10 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white">
            {FAQ.map((f) => (
              <details key={f.q} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {f.q}
                  <ChevronDown size={18} className="shrink-0 text-ink/40 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 leading-relaxed text-ink/65">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
