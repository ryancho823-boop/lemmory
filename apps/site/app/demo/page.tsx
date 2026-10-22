import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Logo } from "@/components/shell/AppShell";
import { CLASSMATES } from "@/lib/sim";

const SIDES = [
  {
    href: "/student",
    title: "Student",
    who: "Alex, in a Long-Term AMC 10 Course",
    body: "Do today's review, browse the formula bank, and see your stats and the class leaderboard.",
    features: ["Daily review: recall, then application", "A personal deck scheduled with FSRS", "Stats on what you're getting wrong", "The class leaderboard"],
    cta: "Open the student demo",
    accent: "border-t-lemon-deep",
  },
  {
    href: "/teacher",
    title: "Teacher",
    who: `Ms. Chen, with ${CLASSMATES.length + 1} students`,
    body: "Assign formulas, see what the class is forgetting, and look into any formula or student.",
    features: ["Assign from the bank in one click", "Results for every formula", "Results for every student", "Mix-ups between look-alike formulas"],
    cta: "Open the teacher demo",
    accent: "border-t-ink",
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6">
        <Link href="/">
          <Logo />
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-sm font-semibold text-ink/60 hover:text-ink">
          <ArrowLeft size={15} /> Back
        </Link>
      </header>
      <main className="mx-auto max-w-5xl px-5 pb-20 pt-8">
        <h1 className="font-display text-4xl sm:text-5xl">Try the demo</h1>
        <p className="mt-3 max-w-xl text-lg">A sample class with a few weeks of history. It runs in your browser, so click anything.</p>
        <div className="mt-10 grid gap-x-10 gap-y-12 md:grid-cols-2">
          {SIDES.map((s) => (
            <section key={s.href} className={`flex flex-col border-t-4 pt-5 ${s.accent}`}>
              <h2 className="font-display text-3xl">{s.title}</h2>
              <p className="mt-1 font-semibold">{s.who}</p>
              <p className="mt-3 leading-relaxed">{s.body}</p>
              <ul className="mt-5 border-t border-line">
                {s.features.map((f) => (
                  <li key={f} className="border-b border-line py-2.5">
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={s.href}
                className="group mt-7 inline-flex h-12 items-center justify-center gap-2 self-start rounded-lg bg-ink px-6 font-bold text-white hover:bg-ink/90"
              >
                {s.cta} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
