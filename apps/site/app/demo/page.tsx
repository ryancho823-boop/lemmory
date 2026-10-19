import Link from "next/link";
import { ArrowLeft, ArrowRight, BarChart3, BookOpen, GraduationCap, Layers, Play, Trophy, UserRound, Users } from "lucide-react";
import { Logo } from "@/components/shell/AppShell";

const SIDES = [
  {
    href: "/student",
    icon: UserRound,
    title: "Student view",
    who: "Alex, Long-Term AMC 10 Course",
    body: "Do today's review, browse the formula bank, and see your stats and the class leaderboard.",
    features: [
      { icon: Play, text: "Daily review: recall + application" },
      { icon: Layers, text: "Personal deck with FSRS scheduling" },
      { icon: BarChart3, text: "Stats on what you're getting wrong" },
      { icon: Trophy, text: "Class leaderboard" },
    ],
    cta: "Open student demo",
    dark: false,
  },
  {
    href: "/teacher",
    icon: GraduationCap,
    title: "Teacher view",
    who: "Ms. Chen, 13 students",
    body: "Assign formulas, see what the class is forgetting, and drill into any formula or student.",
    features: [
      { icon: BookOpen, text: "One-click assign from the bank" },
      { icon: BarChart3, text: "Analytics for every formula" },
      { icon: Users, text: "Analytics for every student" },
      { icon: Layers, text: "Mix-ups between look-alike formulas" },
    ],
    cta: "Open teacher demo",
    dark: false,
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6">
        <Link href="/">
          <Logo />
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-sm font-semibold text-ink/50 hover:text-ink">
          <ArrowLeft size={15} /> Back
        </Link>
      </header>
      <main className="mx-auto max-w-5xl px-5 pb-20 pt-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Pick a side</h1>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {SIDES.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={`group flex flex-col rounded-3xl p-7 transition-transform hover:-translate-y-1 ${
                s.dark ? "bg-ink text-white" : "border border-line bg-white"
              }`}
            >
              <span className={`grid size-12 place-items-center rounded-2xl ${s.dark ? "bg-white/10" : "bg-lemon"}`}>
                <s.icon size={24} />
              </span>
              <h2 className="mt-6 text-2xl font-extrabold tracking-tight">{s.title}</h2>
              <p className={`text-sm font-semibold ${s.dark ? "text-white/45" : "text-ink/45"}`}>{s.who}</p>
              <p className={`mt-3 leading-relaxed ${s.dark ? "text-white/70" : "text-ink/65"}`}>{s.body}</p>
              <ul className="mt-6 space-y-2.5">
                {s.features.map((f) => (
                  <li key={f.text} className="flex items-center gap-3 text-sm font-medium">
                    <f.icon size={16} className={s.dark ? "text-lemon" : "text-ink/50"} />
                    {f.text}
                  </li>
                ))}
              </ul>
              <span
                className={`mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl font-bold ${
                  s.dark ? "bg-lemon text-ink" : "bg-ink text-white"
                }`}
              >
                {s.cta} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
