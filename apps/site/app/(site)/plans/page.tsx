import Link from "next/link";
import { Container, PageIntro } from "@/components/site/blocks";
import { PlanTabs } from "@/components/site/PlanTabs";
import { EVERY_PLAN, TIERS } from "@/lib/pricing";

export const metadata = { title: "Plan details · Lemmory" };

export default function PlanDetails() {
  return (
    <div>
      <section className="bg-lemon">
        <Container className="pb-14 pt-14 sm:pt-20">
          <Link href="/users" className="text-sm font-semibold underline underline-offset-2">
            Back to plans and pricing
          </Link>
          <div className="mt-6">
            <PageIntro title="Plan details" sub="Choose a plan to see what's included and what it costs." />
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <PlanTabs tiers={TIERS} />

        <section className="mt-14">
          <h2 className="text-2xl font-extrabold">On every teacher plan</h2>
          <ul className="mt-3 max-w-3xl list-disc space-y-1.5 pl-5 leading-relaxed text-ink/85 marker:text-ink/40">
            {EVERY_PLAN.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
      </Container>
    </div>
  );
}
