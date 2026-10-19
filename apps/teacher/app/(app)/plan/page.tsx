import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FORMULAS } from "@lemmory/core/formulas";
import { PILOT_DAYS, PRICES, getPlan, monthlyCost, pilotUsed, planState } from "@lemmory/db/billing";
import { TopBar } from "@lemmory/ui/Shell";
import { uniqueStudents } from "@lemmory/db/teacher";
import { getClasses, requireTeacher } from "@/lib/session";
import { LogoutButton } from "../LogoutButton";
import { PlanPicker } from "./PlanPicker";

export const metadata = { title: "Plan & billing · Lemmory for teachers" };

const fmt = (d: Date | null) => d?.toLocaleDateString("en-US", { month: "long", day: "numeric" }) ?? "";

export default async function PlanPage() {
  const me = await requireTeacher();
  const [plan, classes, students] = await Promise.all([getPlan(me.id), getClasses(), uniqueStudents(me.id)]);
  const sizes = classes.map((c) => c.students);
  const cost = plan ? monthlyCost(plan.kind, plan.clubStatus === "verified", sizes, students) : null;
  const { state } = planState(plan);

  const status = !plan
    ? null
    : state === "expired" && plan.kind !== "club"
      ? `Your free pilot ended on ${fmt(plan.pilotEndsAt)}. Pick a plan to keep going. Your classes and your students' progress are saved.`
      : plan.kind === "pilot"
      ? `Free pilot until ${fmt(plan.pilotEndsAt)}.`
      : plan.kind === "academy"
        ? `Academy plan for ${plan.orgName}. ${students} students right now: $${cost} a month.`
        : plan.clubStatus === "verified"
          ? `School club plan for ${plan.orgName}, verified. ${students} students right now: $${cost} a month.`
          : plan.clubStatus === "rejected"
            ? `We couldn't confirm ${plan.orgName} as a school club. Choose the academy plan to keep going.`
            : state === "expired"
              ? `Club pricing for ${plan.orgName} is still waiting on verification, and your free pilot ended on ${fmt(plan.pilotEndsAt)}. Choose the academy plan to keep going for now.`
              : `Club pricing for ${plan.orgName} is waiting on verification. We'll confirm with ${plan.schoolEmail}. You're on a free pilot until ${fmt(plan.pilotEndsAt)}.`;

  return (
    <div className="product min-h-screen bg-canvas">
      <TopBar tag="Teacher" width="max-w-5xl">
        <LogoutButton />
      </TopBar>
      <main className="mx-auto max-w-5xl px-5 pb-20 pt-8">
        {plan && state !== "expired" && (
          <Link href="/" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 hover:text-ink">
            <ArrowLeft size={15} /> {classes.length ? "Back to your classes" : "Continue"}
          </Link>
        )}
        <h1 className="text-[32px] font-extrabold">{plan ? "Plan & billing" : `Welcome, ${me.name}`}</h1>
        <p className="mt-1 max-w-2xl text-ink/75">{status ?? "Start with a free pilot, or pick a plan now. Students never pay."}</p>
        <PlanPicker
          formulaCount={FORMULAS.length}
          pilotDays={PILOT_DAYS}
          academy={PRICES.academy}
          club={PRICES.club}
          current={plan?.kind ?? null}
          pilot={state === "pilot" && plan?.kind === "pilot" ? "current" : pilotUsed(plan) ? "used" : "available"}
          students={students}
        />
      </main>
    </div>
  );
}
