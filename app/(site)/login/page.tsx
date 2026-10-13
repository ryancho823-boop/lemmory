import { ArrowRight, GraduationCap, UserRound } from "lucide-react";
import { STUDENT_URL, TEACHER_URL } from "@/lib/links";

export const metadata = { title: "Log in · Lemmory" };

const CHOICES = [
  { href: `${TEACHER_URL}/login`, icon: GraduationCap, title: "I'm a teacher", body: "Assign formulas and see your class's progress." },
  { href: `${STUDENT_URL}/login`, icon: UserRound, title: "I'm a student", body: "Do today's cards." },
];

export default function LoginChooser() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-20">
      <h1 className="text-center text-4xl font-extrabold">Log in</h1>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {CHOICES.map((c) => (
          <a key={c.title} href={c.href} className="group rounded-2xl border border-line bg-white p-6 hover:border-ink/30">
            <c.icon size={22} />
            <p className="mt-4 flex items-center gap-1.5 text-lg font-semibold">
              {c.title} <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </p>
            <p className="mt-1 text-ink/70">{c.body}</p>
          </a>
        ))}
      </div>
      <p className="mt-8 text-center text-ink/70">
        Students without an account: ask your teacher for the class code, then{" "}
        <a href={`${STUDENT_URL}/join`} className="font-semibold text-ink underline">
          join your class
        </a>
        .
      </p>
    </section>
  );
}
