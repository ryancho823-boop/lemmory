import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FORMULAS, LOCKED, TOPIC_COLOR, TOTAL_FORMULAS, type Topic } from "@/lib/bank";
import { Tex } from "@lemmory/ui/Tex";
import { Container, CtaLink, DemoCTA, SectionTitle } from "@/components/site/blocks";
import { TryIt } from "@/components/site/TryIt";
import { ForgettingCurve, RESEARCH } from "@/components/site/research";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { ProductTour } from "@/components/site/ProductTour";
import { TRIAL_DAYS } from "@/lib/pricing";
import { INDIVIDUAL_SIGNUP_URL, SIGNUP_URL } from "@/lib/links";
import { PRICES } from "@lemmory/core/plans";
import { ACCENT_CYCLE } from "@/lib/accents";

// The homepage's wording, top to bottom. Lists of items (problems, steps, topics) follow below.
const TEXT = {
  hero: {
    title: "Remember every formula. Know when to use it.",
    body: "Flashcards with spaced repetition, built for competition math. Teachers assign the formulas they teach, students spend about five minutes a day, and each formula comes back right before it would be forgotten.",
    button: "Try the student demo",
    second: "See the teacher view",
    note: <>Every plan starts with a {TRIAL_DAYS}-day free trial. Students in a paid class never pay.</>,
  },
  bank: { title: <>{TOTAL_FORMULAS} formulas, from AMC 8 to AIME</>, link: "See the formula bank", linkNote: "Open it in the demo" },
  problem: {
    title: "Courses move on. Memory fades.",
    body: "A formula taught in September has to last until the contest in November.",
  },
  mission: {
    quote: "Every formula a student learns should still be there on contest day.",
    body: "We make review part of the course, so every student keeps what they're taught, not just the ones with perfect study habits.",
  },
  inside: { title: "A look inside", body: "Real screens from the app. The demo has all of them, with a sample class you can click around." },
  how: {
    title: "Five minutes a day. The scheduling is automatic.",
    schedulerTitle: "Then the scheduler takes over",
    schedulerBody: "Each correct review pushes the next one further out. A missed card comes back later in the same review until it's right, and then sooner on the calendar. Here is one formula, answered right every time:",
    fsrsTitle: "What is FSRS?",
    fsrsBody: "FSRS (Free Spaced Repetition Scheduler) is the open-source algorithm that decides when each card comes back. For every student and every formula, it estimates how strong the memory is and how fast it's fading, then schedules the next review for the day recall is predicted to drop to 90%. It was trained on hundreds of millions of real reviews.",
  },
  research: { title: "Built on how memory actually works" },
};

// Who it's for. Each side sees what they get and where to start.
const AUDIENCES = [
  {
    title: "For teachers",
    points: [
      "Keep teaching your own course. Each week, assign the formulas you covered, and they go into every student's deck.",
      "See what the class is forgetting and who is falling behind, so you know what to reteach.",
      "Students in a paid class never pay.",
    ],
    cta: `Start a ${TRIAL_DAYS}-day free trial`,
    href: SIGNUP_URL,
  },
  {
    title: "For students",
    points: [
      "Each formula is a flashcard, and your flashcards are your deck. In a class, sign up with your teacher's code and their assignments join your deck.",
      "On your own: pick your contest (AMC 8, AMC 10, AMC 12 or AIME) and start with its formulas.",
      `$${PRICES.student.monthly} a month after a ${TRIAL_DAYS}-day free trial.`,
    ],
    cta: "Sign up on your own",
    href: INDIVIDUAL_SIGNUP_URL,
  },
];

const PROBLEMS = [
  {
    title: "Formulas get forgotten.",
    body: "Courses teach new formulas almost every week. Without review, a formula from week 2 is mostly gone by the November contest.",
  },
  {
    title: "Recognizing the formula is the hard part.",
    body: "On the AMC and AIME, the hard step is seeing that two crossing chords call for Power of a Point. Most practice only checks whether you can solve.",
  },
  {
    title: "Reference is scattered.",
    body: "Formulas live across the AoPS Wiki, forum posts and random PDFs, with no single place organized by topic and contest level.",
  },
];

// One well-known formula per topic, as a taste of the bank.
const TOPICS: { topic: Topic; sample: string; tex: string }[] = [
  { topic: "Algebra", sample: "Vieta's Formulas", tex: "r_1 + r_2 = -\\tfrac{b}{a}" },
  { topic: "Geometry", sample: "Power of a Point", tex: "PA \\cdot PB = PC \\cdot PD" },
  { topic: "Trigonometry", sample: "Law of Cosines", tex: "c^2 = a^2 + b^2 - 2ab\\cos C" },
  { topic: "Number Theory", sample: "Legendre's Formula", tex: "\\nu_p(n!) = \\sum_{i \\ge 1} \\left\\lfloor \\tfrac{n}{p^i} \\right\\rfloor" },
  { topic: "Combinatorics", sample: "Stars and Bars", tex: "\\binom{n+k-1}{k-1}" },
  { topic: "Probability", sample: "Bayes' Theorem", tex: "P(A \\mid B) = \\tfrac{P(B \\mid A)\\,P(A)}{P(B)}" },
  { topic: "Calculus", sample: "Power Rule", tex: "\\tfrac{d}{dx}\\, x^n = n x^{n-1}" },
];

const COUNTS = [...FORMULAS, ...LOCKED].reduce<Partial<Record<Topic, number>>>((m, f) => ({ ...m, [f.topic]: (m[f.topic] ?? 0) + 1 }), {});

const STEPS = [
  { title: "The teacher assigns", body: "Keep teaching your own curriculum. Each week, assign the formulas you covered, and they go into every student's deck." },
  { title: "Students review daily", body: "A few minutes a day: type each formula from memory, then, once it sticks, use it on real problems." },
  { title: "It comes back on time", body: "Each card returns right before it would be forgotten." },
];

// The days a card answered right every time comes back, from packages/core/src/srs.ts (FSRS defaults,
// 90% target). Once recall is solid it becomes an application card with its own fresh schedule.
const TIMELINE = [
  { day: "Class", note: "Learned" },
  { day: "Day 3", note: "Recall review" },
  { day: "Day 4", note: "First problem" },
  { day: "Day 7", note: "Problem" },
  { day: "Day 21", note: "Problem" },
  { day: "Day 78", note: "Problem" },
];

export default function Overview() {
  return (
    <div>
      <ScrollReveal />
      <section className="bg-lemon">
        <Container className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:gap-16 lg:py-24">
          <div className="rise">
            <h1 className="text-[42px] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-[58px]">{TEXT.hero.title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed">{TEXT.hero.body}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <CtaLink href="/student">{TEXT.hero.button}</CtaLink>
              <Link href="/teacher" className="font-semibold underline underline-offset-4 hover:no-underline">
                {TEXT.hero.second}
              </Link>
            </div>
            <p className="mt-8 text-[15px]">{TEXT.hero.note}</p>
          </div>
          {/* The real card, recall then application, right where the product needs explaining. */}
          <div className="rise" style={{ animationDelay: "120ms" }}>
            <TryIt />
          </div>
        </Container>
      </section>

      <Container as="section" className="grid gap-x-12 gap-y-12 py-20 md:grid-cols-2">
        {AUDIENCES.map((a, i) => (
          <div key={a.title} data-reveal className="border-t-4 pt-5" style={{ borderColor: ACCENT_CYCLE[i] }}>
            <h2 className="font-display text-3xl">{a.title}</h2>
            <ul className="mt-4 border-t border-line">
              {a.points.map((pt) => (
                <li key={pt} className="border-b border-line py-3 leading-relaxed">
                  {pt}
                </li>
              ))}
            </ul>
            <a href={a.href} className="mt-5 inline-flex items-center gap-1.5 font-semibold underline underline-offset-4 hover:no-underline">
              {a.cta} <ArrowRight size={16} />
            </a>
          </div>
        ))}
      </Container>

      <Container as="section" className="py-20">
        <SectionTitle reveal className="max-w-xl">
          {TEXT.bank.title}
        </SectionTitle>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOPICS.map((t) => (
            <li key={t.topic} data-reveal className="rounded-lg border border-line border-t-4 bg-white p-5" style={{ borderTopColor: TOPIC_COLOR[t.topic] }}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-display text-xl">{t.topic}</p>
                <p className="text-sm font-semibold tabular-nums" style={{ color: TOPIC_COLOR[t.topic] }}>
                  {COUNTS[t.topic] ?? 0}
                </p>
              </div>
              <p className="mt-4 text-sm text-ink/70">{t.sample}</p>
              <Tex math={t.tex} className="math-scroll mt-1 block text-[15px]" />
            </li>
          ))}
          <li data-reveal className="flex">
            <Link href="/student/bank" className="group flex w-full flex-col justify-between rounded-lg bg-ink p-5 text-white hover:bg-ink/90">
              <p className="font-display text-xl">{TEXT.bank.link}</p>
              <p className="mt-6 flex items-center gap-1.5 font-semibold text-lemon">
                {TEXT.bank.linkNote} <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </p>
            </Link>
          </li>
        </ul>
      </Container>

      <section className="border-t border-line">
        <Container className="grid gap-10 py-20 lg:grid-cols-[1fr_2fr]">
          <div data-reveal>
            <SectionTitle>{TEXT.problem.title}</SectionTitle>
            <p className="mt-4 leading-relaxed text-ink/80">{TEXT.problem.body}</p>
          </div>
          <div className="divide-y divide-line">
            {PROBLEMS.map((p, i) => (
              <div key={p.title} data-reveal className="flex gap-5 py-5 first:pt-0">
                <span className="font-display text-3xl leading-none" style={{ color: ACCENT_CYCLE[i] }}>
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-xl font-extrabold">{p.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-ink/80">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink text-white">
        <Container className="py-16 lg:py-20">
          <blockquote data-reveal className="max-w-3xl">
            <span aria-hidden className="block font-display text-7xl leading-[0.6] text-lemon">&ldquo;</span>
            <p className="mt-4 font-display text-3xl leading-snug sm:text-[38px]">{TEXT.mission.quote}</p>
            <p className="mt-5 text-lg text-white/80">{TEXT.mission.body}</p>
          </blockquote>
        </Container>
      </section>

      <section id="inside" className="scroll-mt-20 py-20">
        <Container>
          <SectionTitle reveal>{TEXT.inside.title}</SectionTitle>
          <p data-reveal className="mt-3 max-w-2xl text-lg text-ink/80">
            {TEXT.inside.body}
          </p>
          <div data-reveal className="mt-10">
            <ProductTour />
          </div>
        </Container>
      </section>

      <section id="how" className="scroll-mt-20 border-t border-line bg-white py-20">
        <Container>
          <SectionTitle reveal>{TEXT.how.title}</SectionTitle>
          <ol className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} data-reveal className="border-t-4 pt-4" style={{ borderColor: ACCENT_CYCLE[i] }}>
                <p className="font-display text-lg">
                  {i + 1}. {s.title}
                </p>
                <p className="mt-1.5 leading-relaxed text-ink/80">{s.body}</p>
              </li>
            ))}
          </ol>

          <div data-reveal className="mt-20">
            <h3 className="text-2xl font-extrabold">{TEXT.how.schedulerTitle}</h3>
            <p className="mt-2 max-w-2xl text-ink/80">{TEXT.how.schedulerBody}</p>
            <ol className="mt-10 grid max-w-4xl grid-cols-3 gap-y-8 border-t-2 border-ink/20 sm:grid-cols-6">
              {TIMELINE.map((t, i) => (
                <li key={t.day} className="relative pt-5">
                  <span className={`absolute -top-[9px] left-0 size-4 rounded-full border-[3px] border-white ${i === 0 ? "bg-ink" : "bg-lemon-deep"}`} />
                  <p className="font-display text-xl">{t.day}</p>
                  <p className="text-ink/70">{t.note}</p>
                </li>
              ))}
            </ol>
            <aside className="mt-12 max-w-3xl rounded-lg border-l-4 border-lemon-deep bg-lemon-soft px-6 py-5">
              <p className="font-display text-xl">{TEXT.how.fsrsTitle}</p>
              <p className="mt-2 leading-relaxed">{TEXT.how.fsrsBody}</p>
            </aside>
          </div>
        </Container>
      </section>

      <section className="border-t border-line">
        <Container className="py-20">
          <SectionTitle reveal>{TEXT.research.title}</SectionTitle>
          <div className="mt-10 grid items-start gap-12 lg:grid-cols-[1fr_1.15fr]">
            <div data-reveal>
              <ForgettingCurve />
            </div>
            <div className="divide-y divide-line">
              {RESEARCH.map((r) => (
                <article key={r.label} data-reveal className="py-5 first:pt-0">
                  <p className="font-display text-xl">
                    {r.stat} <span className="text-base text-ink/60">· {r.label}</span>
                  </p>
                  <p className="mt-1.5 leading-relaxed text-ink/80">{r.use}</p>
                  <a href={r.href} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm text-ink/55 underline decoration-ink/20 underline-offset-2 hover:text-ink">
                    {r.cite}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <DemoCTA />
    </div>
  );
}
