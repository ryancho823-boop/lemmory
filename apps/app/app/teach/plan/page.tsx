import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FORMULAS } from "@lemmory/core/formulas";
import { PILOT_DAYS, PRICES, getPlan, monthlyCost } from "@lemmory/db/billing";
import { Logo } from "@lemmory/ui/Shell";
import { uniqueStudents } from "@lemmory/db/teacher";
import { getClasses, requireTeacher } from "@/lib/teacher";
import { LogoutButton } from "../LogoutButton";
import { PlanPicker } from "./PlanPicker";

export const metadata = { title: "Plan & billing · Lemmory for teachers" };

const fmt = (d: Date | null) => d?.toLocaleDateString("en-US", { month: "long", day: "numeric" }) ?? "";

export default async function PlanPage() {
  const me = await requireTeacher();
  const [plan, classes, students] = await Promise.all([getPlan(me.id), getClasses(), uniqueStudents(me.id)]);
  const sizes = classes.map((c) => c.students);
  const cost = plan ? monthlyCost(plan.kind, plan.clubStatus === "verified", sizes, students) : null;

  const status = !plan
    ? null
    : plan.kind === "pilot"
      ? `Free pilot until ${fmt(plan.pilotEndsAt)}.`
      : plan.kind === "academy"
        ? `Academy plan for ${plan.orgName}. ${students} students right now: $${cost} a month.`
        : plan.clubStatus === "verified"
          ? `School club plan for ${plan.orgName}, verified. ${students} students right now: $${cost} a month.`
          : plan.clubStatus === "rejected"
            ? `We couldn't confirm ${plan.orgName} as a school club. Choose the academy plan to keep going.`
            : `Club pricing for ${plan.orgName} is waiting on verification. We'll confirm with ${plan.schoolEmail}. You're on a free pilot until ${fmt(plan.pilotEndsAt)}.`;

  return (
    <div className="min-h-screen bg-canvas">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6">
        <Logo tag="Teacher" />
        <LogoutButton />
      </header>
      <main className="mx-auto max-w-5xl px-5 pb-20">
        {plan && (
          <Link href="/teach" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 hover:text-ink">
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
          students={students}
        />
      </main>
    </div>
  );
}
