import { Container, PageIntro } from "@/components/site/blocks";
import { Faq, type FaqGroup } from "@/components/site/Faq";
import { JOIN_URL, SIGNUP_URL } from "@/lib/links";
import { PILOT_DAYS, PRICES, TIERS } from "@/lib/pricing";
import { ACCENT, ACCENT_CYCLE } from "@/lib/accents";

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

const FAQ: FaqGroup[] = [
  {
    id: "start",
    label: "Getting started",
    color: ACCENT.blue,
    items: [
      {
        q: "How long does it take to set up a class?",
        a: "A few minutes. Sign up, create a class, and share its code or join link. Students sign up with the code, and you assign formulas whenever the course covers them.",
      },
      {
        q: "Do students need an email address?",
        a: "No. Students sign up with a username and the class code, so younger students can join without an email.",
      },
      {
        q: "Who is it for?",
        a: "Middle and high school students preparing for the AMC 8, AMC 10/12 and AIME, plus calculus rounds at tournaments. It works for academy courses, school math clubs, and students studying on their own.",
      },
      {
        q: "Does it replace our curriculum?",
        a: "No. You teach the way you already do and assign each week's formulas to match. Lemmory handles the review between classes.",
      },
    ],
  },
  {
    id: "daily",
    label: "Day to day",
    color: ACCENT.green,
    items: [
      {
        q: "How long does it take students each day?",
        a: "About five minutes. Each day's review only includes the cards that are due, usually 5 to 15.",
      },
      {
        q: "How is typed math graded?",
        a: "Answers are checked by value, so any equivalent form counts: 37/4 and 9.25 are both right. A one-letter typo in a formula gets one free retry.",
      },
      {
        q: "What happens if a student misses a day?",
        a: "Their cards wait for them and their streak resets. Teachers can see who's behind, and students see the missed days on their calendar.",
      },
      {
        q: "Can students practice more than what's assigned?",
        a: "Yes. They can add any formula from the bank to their own deck, or run Practice all before a contest. Extra practice doesn't earn leaderboard points, so the competition stays fair.",
      },
    ],
  },
  {
    id: "teachers",
    label: "For teachers",
    color: ACCENT.rose,
    items: [
      {
        q: "What will I see about my class?",
        a: "Which formulas the class is forgetting, who finished today's review, who needs attention, which look-alike formulas students mix up, and full stats for each student.",
      },
      {
        q: "Can I teach more than one class?",
        a: "Yes. Switch between classes from the sidebar. A student can be in several classes and keeps one deck across all of them.",
      },
      {
        q: "How does the leaderboard work?",
        a: "Students earn 10 points per assigned card, plus a streak bonus. You can start a new game whenever you want, for example at the start of a unit.",
      },
      {
        q: "How is this different from Anki or Quizlet?",
        a: "Those only have the cards people make. Lemmory comes with a ready-to-assign competition formula bank, grades typed math, trains students to recognize which formula a problem needs, and shows you how the class is doing.",
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing",
    color: ACCENT.purple,
    items: [
      {
        q: "Why are there different prices?",
        a: `Academies charge for contest prep, so they pay the standard $${PRICES.academy.perStudent} per student. School clubs are usually free for students, so their price is never over $${PRICES.club.classCap} a month per class. Students on their own pay $${PRICES.student.monthly} a month.`,
      },
      {
        q: "What happens when the free pilot ends?",
        a: `The pilot lasts ${PILOT_DAYS} days, once per teacher. When it ends, you pick a plan to keep going. Until then students can't start new reviews, but nothing is lost.`,
      },
      {
        q: "How do you check that a club is a school club?",
        a: "Club sign-ups need a school email address and the school's name, and we confirm with the school before the club price applies. A program that charges tuition counts as an academy.",
      },
      {
        q: "Do students in a paid class pay anything?",
        a: "No. When the teacher's plan covers the class, students use Lemmory for free.",
      },
    ],
  },
];

export default function ForUsers() {
  return (
    <div>
      <section className="bg-lemon">
        <Container className="pb-16 pt-14 sm:pt-20">
          <PageIntro
            title="For academies, math clubs, and students"
            sub="A retention tool that runs between classes, with no extra work for teachers. Every plan starts with a free pilot."
          />
        </Container>
      </section>
      <Container as="section" className="py-16">
        <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <li key={b.title} className="border-t-4 pt-4" style={{ borderColor: ACCENT_CYCLE[i] }}>
              <h3 className="text-lg font-extrabold">{b.title}</h3>
              <p className="mt-1.5 leading-relaxed text-ink/80">{b.body}</p>
            </li>
          ))}
        </ul>
      </Container>

      <section className="border-t border-line bg-white py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
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
        </Container>
      </section>

      <section id="pricing" className="border-t border-line">
        <Container className="py-20">
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
        </Container>
      </section>

      <section className="border-t border-line py-20">
        <Container>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Questions people ask</h2>
          <div className="mt-8">
            <Faq groups={FAQ} />
          </div>
        </Container>
      </section>
    </div>
  );
}
