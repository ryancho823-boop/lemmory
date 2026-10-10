import Link from "next/link";
import { ArrowRight, BookOpenCheck, CalendarClock, Check, Flame, MousePointerClick, Puzzle, Search, Timer } from "lucide-react";
import { FORMULAS } from "@/lib/formulas";
import { Tex } from "@/components/Tex";
import { DemoCTA } from "@/components/site/SiteChrome";
import { TryIt } from "@/components/site/TryIt";
import { ForgettingCurve, RESEARCH } from "@/components/site/research";
import { ScrollReveal } from "@/components/site/ScrollReveal";

const PROBLEMS = [
  {
    icon: Timer,
    title: "Formulas get forgotten",
    body: "Courses teach new formulas almost every week. Without review, a formula from week 2 is mostly gone by the November contest.",
  },
  {
    icon: Search,
    title: "Recognition is the hard part",
    body: "On the AMC and AIME, the hard step is seeing that two crossing chords call for Power of a Point. Most practice only checks whether you can solve.",
  },
  {
    icon: Puzzle,
    title: "Reference is scattered",
    body: "Formulas live across the AoPS Wiki, forum posts and random PDFs, with no single place organized by topic and contest level.",
  },
];

const STEPS = [
  { icon: MousePointerClick, title: "Teacher assigns", body: "This week's formulas go into every student's deck with one click." },
  { icon: BookOpenCheck, title: "Recall", body: "Students see a formula's name and type it out. Any equivalent form counts." },
  { icon: Search, title: "Application", body: "Once recall is solid, the card becomes a real problem: choose the formula, then solve." },
  { icon: CalendarClock, title: "Spaced review", body: "Each card comes back right before it would be forgotten." },
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
      {/* ── Overview ── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_212_59/0.35),transparent)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-16 sm:pt-24 lg:grid-cols-[1.05fr_1fr]">
          <div className="rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink/60">
              <span className="size-1.5 rounded-full bg-lemon-deep" /> Lemma + Memory
            </span>
            <h1 className="mt-6 text-[44px] font-extrabold leading-[1.03] tracking-[-0.035em] sm:text-6xl lg:text-[64px]">
              Remember every formula.{" "}
              <span className="relative whitespace-nowrap">
                <span className="absolute inset-x-0 bottom-1.5 h-4 rounded-sm bg-lemon/70 sm:bottom-2.5 sm:h-5" />
                <span className="relative">Know when to use it.</span>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/60">
              Spaced-repetition practice for competition math academies. Every student gets a formula deck that grows with the
              course and brings each formula back right before it would be forgotten.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/demo" className="inline-flex h-12 items-center gap-2 rounded-xl bg-ink px-6 font-bold text-white hover:bg-ink/85">
                View live demo <ArrowRight size={18} />
              </Link>
              <a href="#how" className="inline-flex h-12 items-center rounded-xl border border-line bg-white px-6 font-semibold hover:border-ink/30">
                How it works
              </a>
            </div>
          </div>
          <div className="rise" style={{ animationDelay: "150ms" }}>
            <HeroVisual />
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-canvas">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-line px-5 md:grid-cols-4 md:divide-x">
          {[
            ["350,000+", "students take the AMC each year"],
            ["~6,000", "qualify for the AIME"],
            ["~500", "reach the USAMO and USAJMO"],
            [`${FORMULAS.length}`, "formulas, AMC 8 to AIME"],
          ].map(([n, l], i) => (
            <div key={l} data-reveal style={{ "--d": `${i * 90}ms` } as React.CSSProperties} className="px-2 py-7 md:px-6">
              <p className="text-3xl font-extrabold tracking-tight">{n}</p>
              <p className="mt-1 text-sm text-ink/50">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <SectionHead eyebrow="The problem" title="Courses move on. Memory fades." />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PROBLEMS.map((p, i) => (
            <div key={p.title} data-reveal style={{ "--d": `${i * 110}ms` } as React.CSSProperties} className="rounded-3xl border border-line p-7">
              <span className="grid size-10 place-items-center rounded-xl bg-lemon-soft">
                <p.icon size={20} />
              </span>
              <h3 className="mt-5 text-lg font-bold tracking-tight">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-ink/60">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="px-5 pb-24">
        <div data-reveal="scale" className="mx-auto max-w-4xl rounded-[28px] bg-lemon-soft px-8 py-14 text-center sm:px-14">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-lemon-deep">Our mission</p>
          <p className="mt-5 text-2xl font-extrabold leading-snug tracking-tight sm:text-[32px]">
            Every formula a student learns should still be there on contest day.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-ink/65">
            We make review part of the course, so every student keeps what they&apos;re taught, not just the ones with perfect
            study habits.
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="scroll-mt-20 bg-canvas px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHead eyebrow="How it works" title="Five minutes a day. The scheduling is automatic." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.title} data-reveal style={{ "--d": `${i * 110}ms` } as React.CSSProperties} className="rounded-3xl bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-lemon-soft">
                    <s.icon size={20} />
                  </span>
                  <span className="text-sm font-bold text-ink/20">0{i + 1}</span>
                </div>
                <h3 className="mt-5 font-bold tracking-tight">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid items-start gap-10 lg:grid-cols-[1fr_1.5fr]">
            <div data-reveal className="lg:sticky lg:top-28">
              <h3 className="text-2xl font-extrabold leading-tight tracking-tight">Try it: choose the formula, then solve the problem.</h3>
              <p className="mt-3 leading-relaxed text-ink/60">
                On the AMC, the hard step is seeing which tool a problem needs. Application cards train exactly that.
              </p>
              <ol className="mt-6 space-y-4">
                {[
                  ["Read a fresh problem", "A different one each review, so students can't memorize answers."],
                  ["Pick the formula", "Look-alike formulas are mixed in as options."],
                  ["Solve it", "Type the answer in any form: 37/4 and 9.25 both count."],
                ].map(([t, b], i) => (
                  <li key={t} className="flex gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white">{i + 1}</span>
                    <div>
                      <p className="font-bold">{t}</p>
                      <p className="text-sm text-ink/55">{b}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div data-reveal style={{ "--d": "120ms" } as React.CSSProperties}>
              <TryIt />
            </div>
          </div>

          <div data-reveal className="mt-20">
            <h3 className="text-center text-2xl font-extrabold tracking-tight">Then the scheduler takes over</h3>
            <p className="mx-auto mt-2 max-w-xl text-center text-ink/60">
              Each correct review pushes the next one further out; a miss brings it back sooner. One formula, answered right
              every time:
            </p>
            <div className="relative mx-auto mt-10 max-w-4xl">
              <div className="absolute left-[12.5%] right-[12.5%] top-[19px] h-0.5 bg-line" />
              <ol className="relative grid grid-cols-4">
                {TIMELINE.map((t, i) => (
                  <li key={t.day} data-reveal style={{ "--d": `${200 + i * 140}ms` } as React.CSSProperties} className="flex flex-col items-center text-center">
                    <span className={`grid size-10 place-items-center rounded-full border-4 border-canvas text-sm font-bold ${i === 0 ? "bg-ink text-white" : "bg-lemon"}`}>
                      {i}
                    </span>
                    <p className="mt-3 font-extrabold">{t.day}</p>
                    <p className="text-sm text-ink/50">{t.note}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ── Research ── */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <SectionHead eyebrow="The research" title="Built on how memory actually works" />
        <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div data-reveal="scale">
            <ForgettingCurve />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {RESEARCH.map((r, i) => (
              <article key={r.label} data-reveal style={{ "--d": `${i * 90}ms` } as React.CSSProperties} className="flex flex-col rounded-3xl border border-line p-5">
                <span className="text-xs font-bold text-ink/50">{r.label}</span>
                <p className="mt-2 text-2xl font-extrabold tracking-tight">{r.stat}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{r.use}</p>
                <a href={r.href} target="_blank" rel="noreferrer" className="mt-auto pt-3 text-[11px] text-ink/40 hover:text-ink hover:underline">
                  {r.cite}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div data-reveal>
        <DemoCTA />
      </div>
    </div>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div data-reveal className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-lemon-deep">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-[40px]">{title}</h2>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="relative rounded-3xl border border-line bg-white p-6 shadow-[0_30px_70px_-30px_rgb(15_17_33/0.35)]">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-lemon px-2.5 py-1 text-xs font-bold">Application</span>
          <span className="text-xs font-semibold text-ink/40">4 / 11</span>
        </div>
        <p className="mt-5 leading-relaxed">
          Chords <Tex math="\overline{AB}" /> and <Tex math="\overline{CD}" /> meet at <Tex math="P" /> inside a circle. <Tex math="PA=4" />,{" "}
          <Tex math="PB=6" />, <Tex math="PC=3" />. Find <Tex math="PD" />.
        </p>
        <p className="mt-5 text-sm font-bold">1. Which formula does this need?</p>
        <div className="mt-2.5 grid grid-cols-2 gap-2 text-sm font-semibold">
          <span className="rounded-xl border-2 border-line px-3 py-2.5 text-ink/45">Stewart&apos;s Theorem</span>
          <span className="flex items-center justify-between rounded-xl border-2 border-good bg-good/5 px-3 py-2.5">
            Power of a Point <Check size={15} strokeWidth={3} className="text-good" />
          </span>
          <span className="rounded-xl border-2 border-line px-3 py-2.5 text-ink/45">Ptolemy&apos;s Theorem</span>
          <span className="rounded-xl border-2 border-line px-3 py-2.5 text-ink/45">Inscribed Angle</span>
        </div>
        <p className="mt-5 text-sm font-bold">2. Now solve it.</p>
        <div className="mt-2.5 flex items-center gap-3 rounded-xl border-2 border-good bg-good/5 px-4 py-2.5">
          <Tex math="PD = 8" />
          <Check size={15} strokeWidth={3} className="ml-auto text-good" />
        </div>
      </div>
      <div className="absolute -left-3 -top-5 flex items-center gap-2 rounded-2xl border border-line bg-white px-3.5 py-2.5 text-sm font-bold shadow-lg sm:-left-8">
        <Flame size={18} className="fill-lemon text-lemon-deep" /> 12-day streak
      </div>
      <div className="absolute -bottom-6 -right-2 rounded-2xl border border-line bg-white px-4 py-3 shadow-lg sm:-right-6">
        <p className="text-xs font-semibold text-ink/45">Next review</p>
        <p className="text-sm font-bold">Power of a Point · in 14 days</p>
      </div>
    </div>
  );
}
