import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { FORMULAS, LOCKED, TOPIC_COLOR, TOTAL_FORMULAS, type Topic } from "@/lib/bank";
import { Tex } from "@/components/Tex";
import { DemoCTA } from "@/components/site/SiteChrome";
import { TryIt } from "@/components/site/TryIt";
import { ForgettingCurve, RESEARCH } from "@/components/site/research";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { ProductTour } from "@/components/site/ProductTour";
import { PILOT_DAYS } from "@/lib/pricing";

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
  { topic: "Probability", sample: "Complementary Counting", tex: "P(A) = 1 - P(\\overline{A})" },
  { topic: "Calculus", sample: "Power Rule", tex: "\\tfrac{d}{dx}\\, x^n = n x^{n-1}" },
];

const COUNTS = [...FORMULAS, ...LOCKED].reduce<Partial<Record<Topic, number>>>((m, f) => ({ ...m, [f.topic]: (m[f.topic] ?? 0) + 1 }), {});

const STEP_COLORS = ["#e11d48", "#2563eb", "#16a34a", "#9333ea"];

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
      <section className="bg-lemon">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_1fr]">
          <div className="rise">
            <h1 className="text-[42px] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-[58px]">
              Remember every formula. Know when to use it.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed">
              Lemmory is daily formula practice for competition math classes. Each student gets a deck that grows with the
              course, and every formula comes back right before they&apos;d forget it.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link href="/demo" className="group inline-flex h-12 items-center gap-2 rounded-lg bg-ink px-6 font-bold text-white hover:bg-ink/85">
                Try the demo <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a href="#inside" className="font-semibold underline decoration-ink/40 decoration-2 underline-offset-4 hover:decoration-ink">
                See inside the app
              </a>
            </div>
            <p className="mt-8 text-[15px]">Free for students in a paid class. Teachers start with a free {PILOT_DAYS}-day pilot.</p>
          </div>
          <figure className="rise" style={{ animationDelay: "120ms" }}>
            <HeroCard />
            <figcaption className="mt-4 text-sm">An application card: pick the formula first, then solve.</figcaption>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div data-reveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-xl text-3xl font-extrabold leading-tight sm:text-4xl">{TOTAL_FORMULAS} formulas, from AMC 8 to AIME</h2>
          <Link href="/student/bank" className="font-semibold underline decoration-ink/30 decoration-2 underline-offset-4 hover:decoration-ink">
            Browse the formula bank
          </Link>
        </div>
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
              <Tex math={t.tex} className="mt-1 block overflow-x-auto text-[15px]" />
            </li>
          ))}
          <li data-reveal className="flex">
            <Link href="/demo" className="group flex w-full flex-col justify-between rounded-lg bg-ink p-5 text-white hover:bg-ink/90">
              <p className="font-display text-xl">Try some now</p>
              <p className="mt-6 flex items-center gap-1.5 font-semibold text-lemon">
                Open the demo <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </p>
            </Link>
          </li>
        </ul>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[1fr_2fr]">
          <div data-reveal>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">Courses move on. Memory fades.</h2>
            <p className="mt-4 leading-relaxed text-ink/80">
              More than 350,000 students take the AMC each year. About 6,000 qualify for the AIME, and about 500 reach the
              USAMO. The formulas they learn in September have to last until contest day.
            </p>
          </div>
          <div className="divide-y divide-line">
            {PROBLEMS.map((p, i) => (
              <div key={p.title} data-reveal className="flex gap-5 py-5 first:pt-0">
                <span className="font-display text-3xl leading-none" style={{ color: STEP_COLORS[i] }}>
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-xl font-extrabold">{p.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-ink/80">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-white">
        <blockquote data-reveal className="mx-auto max-w-6xl px-5 py-20">
          <span aria-hidden className="block font-display text-7xl leading-[0.6] text-lemon">&ldquo;</span>
          <p className="mt-4 max-w-3xl font-display text-3xl leading-snug sm:text-[40px]">
            Every formula a student learns should still be there on contest day.
          </p>
          <p className="mt-5 max-w-2xl text-lg text-white/80">
            We make review part of the course, so every student keeps what they&apos;re taught, not just the ones with perfect
            study habits.
          </p>
        </blockquote>
      </section>

      <section id="inside" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 data-reveal className="text-3xl font-extrabold leading-tight sm:text-4xl">A look inside</h2>
          <p data-reveal className="mt-3 max-w-2xl text-lg text-ink/80">
            Real screens from the app. The demo has all of them, with a sample class you can click around.
          </p>
          <div data-reveal className="mt-10">
            <ProductTour />
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-20 border-t border-line bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 data-reveal className="text-3xl font-extrabold leading-tight sm:text-4xl">Five minutes a day. The scheduling is automatic.</h2>
          <ol className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} data-reveal className="border-t-4 pt-4" style={{ borderColor: STEP_COLORS[i] }}>
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
            <ol className="mt-10 grid max-w-4xl grid-cols-4 border-t-2 border-ink/20">
              {TIMELINE.map((t, i) => (
                <li key={t.day} className="relative pt-5">
                  <span className={`absolute -top-[9px] left-0 size-4 rounded-full border-[3px] border-white ${i === 0 ? "bg-ink" : "bg-lemon-deep"}`} />
                  <p className="font-display text-xl">{t.day}</p>
                  <p className="text-ink/70">{t.note}</p>
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
    <div className="rounded-lg border-2 border-ink bg-white p-6 shadow-[6px_6px_0_var(--color-ink)]">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">Application</span>
        <span className="text-ink/50">4 of 11</span>
      </div>
      <div className="mt-4 flex items-start gap-4">
      <p className="flex-1 leading-relaxed">
        Chords <Tex math="\overline{AB}" /> and <Tex math="\overline{CD}" /> meet at <Tex math="P" /> inside a circle. <Tex math="PA=4" />,{" "}
        <Tex math="PB=6" />, <Tex math="PC=3" />. Find <Tex math="PD" />.
      </p>
      <ChordDiagram />
      </div>
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

/** The hero problem's figure, drawn to scale: PA·PB = PC·PD = 24 on one circle. */
function ChordDiagram() {
  const pts = { A: [48.5, 144.4], B: [193.4, 183.2], C: [85.3, 199.7], D: [162.8, 54], P: [106.4, 159.9] } as const;
  const label = (n: keyof typeof pts, dx: number, dy: number) => (
    <text x={pts[n][0] + dx} y={pts[n][1] + dy} className="fill-ink font-display italic" fontSize="20">
      {n}
    </text>
  );
  return (
    <svg viewBox="30 30 200 200" className="w-32 shrink-0 sm:w-40" role="img" aria-label="Circle with chords AB and CD crossing at P">
      <circle cx="130" cy="130" r="82.8" fill="none" className="stroke-ink" strokeWidth="2" />
      <line x1={pts.A[0]} y1={pts.A[1]} x2={pts.B[0]} y2={pts.B[1]} stroke="#2563eb" strokeWidth="3" />
      <line x1={pts.C[0]} y1={pts.C[1]} x2={pts.D[0]} y2={pts.D[1]} stroke="#e11d48" strokeWidth="3" />
      {Object.values(pts).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" className="fill-ink" />
      ))}
      {label("A", -18, 4)}
      {label("B", 6, 10)}
      {label("C", -16, 14)}
      {label("D", 4, -6)}
      {label("P", 6, 18)}
    </svg>
  );
}
