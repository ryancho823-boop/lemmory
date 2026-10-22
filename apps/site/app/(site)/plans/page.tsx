import Link from "next/link";
import { Container, PageIntro } from "@/components/site/blocks";
import { PlanTabs } from "@/components/site/PlanTabs";
import { TEACHER_PLAN_RULES, TIERS } from "@/lib/pricing";

export const metadata = { title: "Plan details · Lemmory" };

export default function PlanDetails() {
  return (
    <div>
      <section className="bg-lemon">
        <Container className="pb-14 pt-14 sm:pt-20">
          <Link href="/pricing" className="text-sm font-semibold underline underline-offset-2">
            Back to plans and pricing
          </Link>
          <div className="mt-6">
            <PageIntro title="Plan details" sub="Choose a plan to see what's included and what it costs." />
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <PlanTabs tiers={TIERS} teacherRules={TEACHER_PLAN_RULES} />
      </Container>
    </div>
  );
}
