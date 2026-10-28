import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FORMULAS } from "@lemmory/core/formulas";
import { PRICES, TRIAL_DAYS, getPlan, monthlyCost, planState } from "@lemmory/db/billing";
import { TopBar } from "@lemmory/ui/Shell";
import { uniqueStudents } from "@lemmory/db/teacher";
import { getClasses, requireTeacher } from "@/lib/session";
import { LogoutButton } from "../LogoutButton";
import { PlanPicker } from "./PlanPicker";

export const metadata = { title: "Plan & billing · Lemmory for teachers" };

const fmt = (d: Date | null) => d?.toLocaleDateString("en-US", { month: "long", day: "numeric" }) ?? "";

// The one teacher page that stays open when the trial has ended: everything else sends them here.
export default async function PlanPage() {
  const me = await requireTeacher();
  const [plan, classes, students] = await Promise.all([getPlan(me.id), getClasses(), uniqueStudents(me.id)]);
  const { state, endsAt } = planState(plan);
  // Teachers from before plans were picked up front have "pilot"; they pick one when they pay.
  const kind = plan?.kind === "academy" || plan?.kind === "club" ? plan.kind : null;
  const name = kind === "club" ? "School math club" : "Academy";
  const cost = kind ? monthlyCost(kind, plan?.clubStatus === "verified", classes.map((c) => c.students), students) : null;

  const status =
    state === "none"
      ? `Pick the plan that fits how you teach. Both start with a free ${TRIAL_DAYS}-day trial.`
      : state === "trial"
        ? `Free trial${kind ? ` of the ${name} plan` : ""} until ${fmt(endsAt)}. Pay any time to keep going after that.`
        : state === "expired"
          ? `Your free trial ended on ${fmt(endsAt)}. To keep using Lemmory, enter your academy's or school's details and pay. Your classes and your students' progress are saved.`
          : kind === "club" && plan?.clubStatus === "verified"
            ? `School math club plan for ${plan.orgName}, confirmed. ${students} students right now: $${cost} a month.`
            : kind === "club" && plan?.clubStatus === "rejected"
              ? `We couldn't confirm ${plan.orgName} as a school club, so you pay the academy price: $${cost} a month for ${students} students.`
              : kind === "club"
                ? `School math club plan for ${plan?.orgName}. We're confirming it with ${plan?.schoolEmail}; until then it's $${cost} a month for ${students} students.`
                : `Academy plan for ${plan?.orgName}. ${students} students right now: $${cost} a month.`;

  return (
    <div className="product min-h-screen bg-canvas">
      <TopBar tag="Teacher" width="max-w-5xl">
        <LogoutButton />
      </TopBar>
      <main className="mx-auto max-w-5xl px-5 pb-20 pt-8">
        {(state === "trial" || state === "active") && (
          <Link href="/" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 hover:text-ink">
            <ArrowLeft size={15} /> {classes.length ? "Back to your classes" : "Continue"}
          </Link>
        )}
        <h1 className="text-[32px] font-extrabold">{state === "none" ? `Welcome, ${me.name}` : "Plan & billing"}</h1>
        <p className="mt-1 max-w-2xl text-ink/75">{status}</p>
        <PlanPicker
          formulaCount={FORMULAS.length}
          trialDays={TRIAL_DAYS}
          academy={PRICES.academy}
          club={PRICES.club}
          current={kind}
          state={state}
          students={students}
        />
        <p className="mt-12 text-ink/75">
          To change your password or delete your account, go to{" "}
          <Link href="/account" className="font-semibold text-ink underline underline-offset-2">
            Account
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
