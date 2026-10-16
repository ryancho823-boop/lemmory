import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { TOTAL_FORMULAS } from "@/lib/bank";
import { Tex } from "@/components/Tex";
import { DemoCTA } from "@/components/site/SiteChrome";
import { TryIt } from "@/components/site/TryIt";
import { ForgettingCurve, RESEARCH } from "@/components/site/research";
import { ScrollReveal } from "@/components/site/ScrollReveal";

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

const STEPS = [
  { title: "The teacher assigns", body: "This week's formulas go into every student's deck with one click." },
  { title: "Students recall", body: "They see a formula's name and type it out. Any equivalent form counts." },
  { title: "Then they apply", body: "Once recall is solid, the card becomes a real problem: choose the formula, then solve." },
  { title: "It comes back on time", body: "Each card returns right before it would be forgotten." },
];

// Intervals FSRS gives a card answered correctly each time (default parameters, 90% target).
const TIMELINE = [
  { day: "Class", note: "Learned" },
  { day: "Day 3", note: "1st review" },
  { day: "Day 17", note: "2nd review" },
  { day: "Day 74", note: "3rd review" },
];

export default function Overview() {
  return (
    <div>
      <ScrollReveal />
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.1fr_1fr]">
        <div className="rise">
          <h1 className="text-[42px] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-[56px]">
            Remember every formula. Know when to use it.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
            Lemmory is daily formula practice for competition math classes. Each student gets a deck that grows with the
            course, and every formula comes back right before they&apos;d forget it.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href="/demo" className="inline-flex h-12 items-center gap-2 rounded-lg bg-ink px-6 font-bold text-white hover:bg-ink/85">
              Try the demo <ArrowRight size={18} />
            </Link>
            <a href="#how" className="font-semibold underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
              How it works
            </a>
          </div>
        </div>
        <figure className="rise" style={{ animationDelay: "120ms" }}>
          <HeroCard />
          <figcaption className="mt-3 text-sm text-ink/60">An application card. Students pick the formula first, then solve.</figcaption>
        </figure>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[1fr_2fr]">
          <div data-reveal>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">Courses move on. Memory fades.</h2>
            <p className="mt-4 leading-relaxed text-ink/80">
              More than 350,000 students take the AMC each year. About 6,000 qualify for the AIME, and about 500 reach the
              USAMO. Lemmory covers {TOTAL_FORMULAS} formulas they need, from AMC 8 to AIME.
            </p>
          </div>
          <div className="divide-y divide-line">
            {PROBLEMS.map((p) => (
              <div key={p.title} data-reveal className="py-5 first:pt-0">
                <h3 className="text-xl font-extrabold">{p.title}</h3>
                <p className="mt-1.5 leading-relaxed text-ink/80">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <blockquote data-reveal className="border-l-4 border-lemon pl-6 sm:pl-8">
          <p className="max-w-3xl font-display text-2xl leading-snug sm:text-[30px]">
            Every formula a student learns should still be there on contest day.
          </p>
          <p className="mt-3 max-w-2xl text-ink/80">
            We make review part of the course, so every student keeps what they&apos;re taught, not just the ones with perfect
            study habits.
          </p>
        </blockquote>
      </section>

      <section id="how" className="scroll-mt-20 border-t border-line bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 data-reveal className="text-3xl font-extrabold leading-tight sm:text-4xl">Five minutes a day. The scheduling is automatic.</h2>
          <ol className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} data-reveal className="border-t-2 border-ink pt-4">
                <p className="font-display text-lg">
                  {i + 1}. {s.title}
                </p>
                <p className="mt-1.5 leading-relaxed text-ink/80">{s.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-20 grid items-start gap-10 lg:grid-cols-[1fr_1.5fr]">
            <div data-reveal className="lg:sticky lg:top-28">
              <h3 className="text-2xl font-extrabold leading-tight">Try one: choose the formula, then solve the problem.</h3>
              <p className="mt-3 leading-relaxed text-ink/80">
                On the AMC, the hard step is seeing which tool a problem needs. Application cards train exactly that. Each
                review shows a different problem, look-alike formulas are mixed into the choices, and answers count in any
                form (37/4 and 9.25 are both right).
              </p>
            </div>
            <div data-reveal>
              <TryIt />
            </div>
          </div>

          <div data-reveal className="mt-20">
            <h3 className="text-2xl font-extrabold">Then the scheduler takes over</h3>
            <p className="mt-2 max-w-2xl text-ink/80">
              Each correct review pushes the next one further out, and a miss brings it back sooner. Here is one formula,
              answered right every time:
            </p>
            <ol className="mt-8 grid max-w-4xl grid-cols-4 border-t border-ink/25">
              {TIMELINE.map((t, i) => (
                <li key={t.day} className="relative pt-5">
                  <span className={`absolute -top-[7px] left-0 size-3.5 rounded-full border-2 border-white ${i === 0 ? "bg-ink" : "bg-lemon-deep"}`} />
                  <p className="font-display text-lg">{t.day}</p>
                  <p className="text-sm text-ink/70">{t.note}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 data-reveal className="text-3xl font-extrabold leading-tight sm:text-4xl">Built on how memory actually works</h2>
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
        </div>
      </section>

      <DemoCTA />
    </div>
  );
}

function HeroCard() {
  return (
    <div className="rounded-lg border border-ink/15 bg-white p-6">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">Application</span>
        <span className="text-ink/50">4 of 11</span>
      </div>
      <p className="mt-4 leading-relaxed">
        Chords <Tex math="\overline{AB}" /> and <Tex math="\overline{CD}" /> meet at <Tex math="P" /> inside a circle. <Tex math="PA=4" />,{" "}
        <Tex math="PB=6" />, <Tex math="PC=3" />. Find <Tex math="PD" />.
      </p>
      <p className="mt-5 text-sm font-bold">1. Which formula does this need?</p>
      <div className="mt-2.5 grid grid-cols-2 gap-2 text-sm font-semibold">
        <span className="rounded-md border border-line px-3 py-2.5 text-ink/50">Stewart&apos;s Theorem</span>
        <span className="flex items-center justify-between rounded-md border-2 border-good px-3 py-2">
          Power of a Point <Check size={15} strokeWidth={3} className="text-good" />
        </span>
        <span className="rounded-md border border-line px-3 py-2.5 text-ink/50">Ptolemy&apos;s Theorem</span>
        <span className="rounded-md border border-line px-3 py-2.5 text-ink/50">Inscribed Angle</span>
      </div>
      <p className="mt-5 text-sm font-bold">2. Now solve it.</p>
      <div className="mt-2.5 flex items-center gap-3 rounded-md border-2 border-good px-4 py-2">
        <Tex math="PD = 8" />
        <Check size={15} strokeWidth={3} className="ml-auto text-good" />
      </div>
    </div>
  );
}
