import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FORMULAS, LOCKED, TOPIC_COLOR, TOTAL_FORMULAS, type Topic } from "@/lib/bank";
import { Tex } from "@lemmory/ui/Tex";
import { Container, CtaLink, DemoCTA, SectionTitle } from "@/components/site/blocks";
import { TryIt } from "@/components/site/TryIt";
import { ForgettingCurve, RESEARCH } from "@/components/site/research";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { ProductTour } from "@/components/site/ProductTour";
import { ACCENT_CYCLE } from "@/lib/accents";
import { ReviewCalendar, StepCard } from "@/components/site/HowItWorks";

// The homepage's wording, top to bottom. Lists of items (problems, steps, topics) follow below.
const TEXT = {
  hero: {
      body: "Flashcards with spaced repetition, built for competition math. Teachers assign the formulas they teach, students spend five minutes a day, and each formula returns right before it's forgotten.",
    button: "Try the student demo",
    second: "See the teacher view",
  },
  bank: { title: <>{TOTAL_FORMULAS} formulas, from AMC 8 to AIME and calculus rounds</>, link: "See the formula bank", linkNote: "Open it in the demo" },
  mission: {
    quote: "Every formula a student learns should still be there on contest day.",
    body: "We make review part of the course, so every student keeps what they're taught, not just the ones with perfect study habits.",
  },
  inside: { title: "A look inside", body: "Real screens from the app. The demo has all of them, with a sample class you can click around." },
  how: {
    schedulerTitle: "One formula, 90 days",
    schedulerBody: "Each right answer pushes the next review further out. A miss stays in that day's review until it's right, then the card comes back sooner. Two misses in a row on problems send it back to recall. Each square is a day:",
    fsrsTitle: "What is FSRS?",
    fsrsBody: "FSRS (Free Spaced Repetition Scheduler) is the open-source algorithm that decides when each card comes back. From a student's answers on a card, it estimates how strong that memory is, then schedules the next review for the day recall is predicted to drop to 90%. We use its published default settings, trained on hundreds of millions of real reviews.",
  },
  research: { title: "Built on how memory actually works" },
};

const PROBLEMS = [
  { title: "Formulas fade", body: "A week after studying, students who only re-read remembered 40%." },
  { title: "Classes move on", body: "A class learns a formula, then jumps straight into the next topic." },
  { title: "Sources are scattered across the internet", body: "AoPS Wiki, random PDFs, forum posts." },
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

export default function Overview() {
  return (
    <div>
      <ScrollReveal />
      <section className="overflow-x-clip border-b-2 border-ink bg-lemon">
        <Container className="grid items-start gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:gap-16 lg:py-24">
          <div>
            {/* Two lines, two voices: the upright promise, then the italic "and the harder part". */}
            <h1 className="font-display text-[44px] leading-[1.04] tracking-[-0.025em] sm:text-[64px]">
              <span className="block font-bold">Remember every formula.</span>
              <span className="block font-medium italic">Know when to use it.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[19px] leading-relaxed text-pretty text-ink/85">{TEXT.hero.body}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <CtaLink href="/student">{TEXT.hero.button}</CtaLink>
              <Link href="/teacher" className="font-semibold underline underline-offset-4 hover:no-underline">
                {TEXT.hero.second}
              </Link>
            </div>
          </div>
          {/* The real card, recall then application, right where the product needs explaining. */}
          {/* The card sits on top of a little deck: two more cards, askew, behind it. */}
          <div className="relative">
            <div aria-hidden className="absolute inset-0 translate-x-2 translate-y-2 rotate-[1.5deg] sm:translate-x-4 sm:translate-y-3 sm:rotate-[4deg] rounded-lg border-2 border-ink bg-white" />
            <div aria-hidden className="absolute inset-0 -translate-x-1 translate-y-1 -rotate-[1deg] sm:-translate-x-3 sm:translate-y-2 sm:-rotate-[2.5deg] rounded-lg border-2 border-ink bg-paper" />
            <div className="relative">
              <TryIt />
            </div>
          </div>
        </Container>
      </section>



      <Container as="section" className="py-20 lg:py-24">
        <SectionTitle reveal className="max-w-xl">
          {TEXT.bank.title}
        </SectionTitle>
        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {TOPICS.map((t) => (
            <li key={t.topic} data-reveal className="border-t-4 pt-4" style={{ borderColor: TOPIC_COLOR[t.topic] }}>
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
          <li data-reveal className="border-t-4 border-ink pt-4">
            <Link href="/student/bank" className="group block">
              <p className="font-display text-xl group-hover:underline">{TEXT.bank.link}</p>
              <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold">
                {TEXT.bank.linkNote} <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </p>
            </Link>
          </li>
        </ul>
      </Container>

      {/* The photo is nearly black at its edges, so it runs straight into the dark section. */}
      <section className="bg-ink text-white">
        <div className="grid lg:grid-cols-2">
          {/* Photo by Kevin Yudhistira Alloni: unsplash.com/photos/WBU233kGI6g (Unsplash License). */}
          <div className="relative aspect-[21/9] lg:aspect-auto">
            <Image src="/photos/desk-at-night.jpg" alt="A student seen from behind, working late at a desk under a lamp, with a calendar and sticky notes on the wall" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="px-5 py-16 lg:px-16 lg:py-24">
            <h2 data-reveal className="max-w-2xl font-display text-[32px] leading-[1.2] sm:text-[40px] lg:max-w-lg">
              Right now, no one <em>actively helps</em> students put formulas into <em>long-term memory</em>.
            </h2>
            <ol className="mt-10 grid gap-x-8 md:grid-cols-3 lg:max-w-lg lg:grid-cols-1">
              {PROBLEMS.map((p, i) => (
                <li key={p.title} data-reveal className="flex gap-5 border-t border-white/20 py-5">
                  <span className="font-display text-xl leading-7 text-lemon">{i + 1}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{p.title}</h3>
                    <p className="mt-1 leading-relaxed text-white/75">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-canvas">
        <Container className="py-20 lg:py-24">
          <blockquote data-reveal className="mx-auto max-w-3xl text-center">
            <p className="font-display text-3xl leading-snug sm:text-[38px]">{TEXT.mission.quote}</p>
            <p className="mt-5 text-lg text-ink/75">{TEXT.mission.body}</p>
          </blockquote>
        </Container>
      </section>

      <section id="inside" className="scroll-mt-20 py-20 lg:py-24">
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

      <section id="how" className="scroll-mt-20 overflow-x-clip bg-lemon-soft py-20 lg:py-24">
        <Container>
          <h2 data-reveal className="font-display text-[36px] leading-[1.1] tracking-[-0.02em] sm:text-[52px]">
            <span className="block font-bold">Five minutes a day.</span>
            <span className="block font-medium italic">The scheduling is automatic.</span>
          </h2>
          <ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} data-reveal>
                <StepCard step={i} />
                <p className="mt-7 font-display text-xl">
                  <span style={{ color: ACCENT_CYCLE[i] }}>{i + 1}.</span> {s.title}
                </p>
                <p className="mt-1.5 leading-relaxed text-ink/80">{s.body}</p>
              </li>
            ))}
          </ol>

          <div data-reveal className="mt-20 lg:mt-24">
            <h3 className="font-display text-[28px] leading-tight sm:text-[34px]">{TEXT.how.schedulerTitle}</h3>
            <p className="mt-2 max-w-2xl leading-relaxed text-ink/80">{TEXT.how.schedulerBody}</p>
            <ReviewCalendar />
            <aside className="mt-12 max-w-3xl border-t border-ink/20 pt-6">
              <p className="font-display text-xl">{TEXT.how.fsrsTitle}</p>
              <p className="mt-2 leading-relaxed">{TEXT.how.fsrsBody}</p>
            </aside>
          </div>
        </Container>
      </section>

      <section id="research" className="scroll-mt-20">
        <Container className="py-20 lg:py-24">
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
