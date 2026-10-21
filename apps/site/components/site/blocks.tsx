// Small building blocks shared by the main site's pages.
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cx } from "@lemmory/ui/ui";
import { SIGNUP_URL } from "@/lib/links";

/** The page's content width, centered with side padding. Every section lines up on it. */
export function Container({ as: Tag = "div", className, children, ...rest }: { as?: "div" | "section"; className?: string; children: React.ReactNode; id?: string }) {
  return (
    <Tag className={cx("mx-auto max-w-6xl px-5", className)} {...rest}>
      {children}
    </Tag>
  );
}

/** A section's main heading. `reveal` fades it in on scroll. */
export function SectionTitle({ reveal, className, children }: { reveal?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <h2 data-reveal={reveal || undefined} className={cx("text-3xl font-extrabold leading-tight sm:text-4xl", className)}>
      {children}
    </h2>
  );
}

/** The big black button with an arrow. */
export function CtaLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex h-12 items-center gap-2 rounded-lg bg-ink px-6 font-bold text-white hover:bg-ink/85">
      {children} <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export function PageIntro({ title, sub }: { title: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">{title}</h1>
      {sub && <p className="mt-5 max-w-2xl text-lg leading-relaxed">{sub}</p>}
    </div>
  );
}

/** The closing band on a page: one line of pitch and the demo button. */
export function DemoCTA({ title = "See it for yourself", sub = "Do a review as a student, then switch to the teacher view and watch your results show up." }) {
  return (
    <section className="bg-lemon-soft">
      <Container className="flex flex-wrap items-end justify-between gap-8 py-20">
        <div className="max-w-xl">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-3 text-lg text-ink/80">{sub}</p>
          <p className="mt-4 text-ink/80">
            Ready for your own class?{" "}
            <a href={SIGNUP_URL} className="font-semibold text-ink underline underline-offset-2">
              Start a free trial
            </a>
          </p>
        </div>
        <CtaLink href="/demo">Open the live demo</CtaLink>
      </Container>
    </section>
  );
}
