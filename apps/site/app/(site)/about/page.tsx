import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ContactLink } from "@/components/site/Doc";
import { Container, DemoCTA } from "@/components/site/blocks";
import { ACCENT_CYCLE } from "@/lib/accents";
import { TOTAL_FORMULAS } from "@/lib/bank";

export const metadata = { title: "About · Lemmory" };

const FACTS = [
  { value: TOTAL_FORMULAS, label: "formulas, each with its own problems" },
  { value: 7, label: "topics, from algebra to calculus rounds" },
  { value: 0, label: "ads or tracking scripts" },
];

const BELIEFS = [
  { title: "Recall comes first", body: "Students type each formula from memory. Reading it again feels like studying, but it doesn't hold up on contest day." },
  { title: "Knowing it isn't enough", body: "Once a formula sticks, it shows up in real problems, where the skill is spotting that this is the one you need." },
  { title: "Teachers stay in charge", body: "Lemmory doesn't replace a course. Teachers keep their own curriculum, and see what the class is forgetting while there's still time to reteach it." },
];

export default function About() {
  return (
    <div>
      <section className="border-b-2 border-ink bg-lemon">
        <Container className="py-16 sm:py-20 lg:py-24">
          <h1 className="max-w-4xl font-display text-[40px] leading-[1.08] tracking-[-0.02em] sm:text-[60px]">
            <span className="block font-bold">Formulas learned in the fall</span>
            <span className="block font-medium italic">were gone by contest day.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[19px] leading-relaxed">That problem is why Lemmory exists.</p>
        </Container>
      </section>

      <Container as="section" className="grid gap-12 py-16 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-20 lg:py-24">
        <div className="max-w-2xl text-lg leading-relaxed">
          <h2 className="font-display text-[28px] leading-tight sm:text-[34px]">Made by a student who competes</h2>
          <p className="mt-5">
            Lemmory is made by Ryan Cho, a student who competes in math contests. Classes teach a formula, then move on to the next topic, and nothing makes reviewing it part of
            the course. The students who remember are the ones with perfect study habits.
          </p>
          <p className="mt-4">
            So Lemmory gives every student a deck that grows with their course. Each formula comes back right before it would be forgotten, first to recall, then to use on real
            problems.
          </p>
        </div>
        <dl className="self-start">
          {FACTS.map((f, i) => (
            <div key={f.label} className="flex items-baseline gap-4 border-t-4 py-4" style={{ borderColor: ACCENT_CYCLE[i] }}>
              <dt className="w-24 shrink-0 font-display text-4xl tabular-nums">{f.value}</dt>
              <dd className="leading-snug">{f.label}</dd>
            </div>
          ))}
        </dl>
      </Container>

      <section className="bg-ink text-white">
        <Container className="py-16 lg:py-24">
          <h2 className="font-display text-[28px] leading-tight sm:text-[34px]">What we think matters</h2>
          <ol className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {BELIEFS.map((b, i) => (
              <li key={b.title} className="border-t border-white/25 pt-5">
                <span className="font-display text-xl text-lemon">{i + 1}</span>
                <h3 className="mt-2 text-lg font-semibold">{b.title}</h3>
                <p className="mt-1.5 leading-relaxed text-white/75">{b.body}</p>
              </li>
            ))}
          </ol>
          <Link href="/#research" className="mt-10 inline-flex items-center gap-1.5 font-semibold text-lemon hover:underline">
            The research behind it <ArrowRight size={16} />
          </Link>
        </Container>
      </section>

      <Container as="section" className="py-16 lg:py-20">
        <h2 className="font-display text-[28px] leading-tight sm:text-[34px]">Say hello</h2>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2">
          Questions, ideas or a mistake in a problem? Email <ContactLink />. Every message gets read.
        </p>
      </Container>

      <DemoCTA />
    </div>
  );
}
