import Link from "next/link";
import { Container, PageIntro } from "@/components/site/blocks";
import { JOIN_URL, SIGNUP_URL } from "@/lib/links";
import { PILOT_DAYS, TIERS } from "@/lib/pricing";

export const metadata = { title: "Plan details · Lemmory" };

// Rules that apply to every teacher plan.
const EVERY_PLAN = [
  `Every teacher plan starts with a free ${PILOT_DAYS}-day pilot, once per teacher.`,
  "When the pilot ends, pick a plan to keep going. Until then students can't start new reviews, but nothing is lost.",
  "Students in a class their teacher pays for never pay anything.",
  "You can run as many classes as you like on one plan.",
];

export default function PlanDetails() {
  return (
    <div>
      <section className="bg-lemon">
        <Container className="pb-14 pt-14 sm:pt-20">
          <Link href="/users" className="text-sm font-semibold underline underline-offset-2">
            Back to plans and pricing
          </Link>
          <div className="mt-6">
            <PageIntro title="Plan details" sub="What each plan includes, what it costs, and how we check who it's for." />
          </div>
        </Container>
      </section>

      <Container className="space-y-12 py-16">
        {TIERS.map((t) => (
          <section key={t.id} id={t.id} className="scroll-mt-24 border-t-2 border-ink pt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h2 className="text-3xl font-extrabold">{t.who}</h2>
              <p className="text-lg">
                <b>{t.price}</b> {t.per}
                {t.note && <span className="font-semibold">. {t.note}</span>}
              </p>
            </div>
            <ul className="mt-5 max-w-3xl list-disc space-y-2 pl-5 leading-relaxed text-ink/85 marker:text-ink/40">
              <li>
                <b className="text-ink">Best for:</b> {t.bestFor}
              </li>
              {t.included.map((x) => (
                <li key={x}>{x}</li>
              ))}
              <li>
                <b className="text-ink">Cost:</b> {t.example}
              </li>
              <li>
                <b className="text-ink">How we check:</b> {t.verify}
              </li>
            </ul>
            <a
              href={t.id === "student" ? JOIN_URL : SIGNUP_URL}
              className="mt-6 inline-flex h-11 items-center rounded-lg bg-ink px-5 font-semibold text-white hover:bg-ink/85"
            >
              {t.id === "student" ? "Sign up as a student" : "Start a free pilot"}
            </a>
          </section>
        ))}

        <section className="border-t-2 border-ink pt-6">
          <h2 className="text-3xl font-extrabold">For every plan</h2>
          <ul className="mt-5 max-w-3xl list-disc space-y-2 pl-5 leading-relaxed text-ink/85 marker:text-ink/40">
            {EVERY_PLAN.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
      </Container>
    </div>
  );
}
