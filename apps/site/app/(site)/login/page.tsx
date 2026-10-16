import { ArrowRight } from "lucide-react";
import { SIGNUP_URL, STUDENT_URL, TEACHER_URL } from "@/lib/links";

export const metadata = { title: "Log in · Lemmory" };

const CHOICES = [
  { href: `${TEACHER_URL}/login`, title: "I'm a teacher", body: "Assign formulas and see your class's progress." },
  { href: `${STUDENT_URL}/login`, title: "I'm a student", body: "Do today's cards." },
];

export default function LoginChooser() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-20">
      <h1 className="text-center text-4xl font-extrabold">Log in</h1>
      <p className="mt-2 text-center text-ink/75">Are you a teacher or a student?</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {CHOICES.map((c) => (
          <a key={c.title} href={c.href} className="group rounded-lg border border-ink/15 bg-white p-6 hover:border-ink/40">
            <p className="flex items-center gap-1.5 font-display text-xl">
              {c.title} <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </p>
            <p className="mt-1 text-ink/70">{c.body}</p>
          </a>
        ))}
      </div>
      <p className="mt-8 text-center text-ink/75">
        New?{" "}
        <a href={SIGNUP_URL} className="font-semibold text-ink underline">
          Sign up
        </a>
      </p>
    </section>
  );
}
