import { FORMULAS } from "@lemmory/core/formulas";
import { PRICES, TRIAL_DAYS, getPlan, monthlyCost, planState } from "@lemmory/db/billing";
import { uniqueStudents } from "@lemmory/db/teacher";
import { getClasses, requireTeacher } from "@/lib/session";
import { SettingsFrame } from "../SettingsFrame";
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

  const count = `${students} ${students === 1 ? "student" : "students"}`;
  const paying = state === "active";
  const confirming = paying && kind === "club" && plan?.clubStatus !== "verified" && plan?.clubStatus !== "rejected";
  const status =
    state === "trial" ? `Free trial until ${fmt(endsAt)}` : state === "expired" ? `Trial ended ${fmt(endsAt)}` : confirming ? "Active, confirming your club" : "Active";
  const note =
    state === "expired"
      ? "Your classes are paused. Enter your academy's or school's details below to keep going. Your classes and your students' progress are saved."
      : kind === "club" && plan?.clubStatus === "rejected"
        ? `We couldn't confirm ${plan.orgName} as a school club, so the academy price applies.`
        : confirming
          ? `We're confirming ${plan?.orgName} with ${plan?.schoolEmail}. Until then the academy price applies.`
          : null;

  return (
    <SettingsFrame
      active="/plan"
      title={state === "none" ? `Welcome, ${me.name}` : "Plan & billing"}
      sub={state === "none" ? `Pick the plan that fits how you teach. Both start with a free ${TRIAL_DAYS}-day trial.` : undefined}
      back={state === "trial" || state === "active" ? (classes.length ? "Back to your classes" : "Continue") : undefined}
    >
      {state !== "none" && (
        <section aria-label="Your plan" className="rounded-lg border-2 border-ink bg-white">
          <dl className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <Fact label="Your plan" value={kind ? name : "None yet"} />
            <Fact label="Status" value={status} detail={paying && endsAt && endsAt > new Date() ? `Free trial runs until ${fmt(endsAt)}` : undefined} />
            <Fact label={paying ? "Monthly cost" : "After the trial"} value={cost === null ? "Pick a plan" : `$${cost} a month`} detail={`For ${count}`} />
          </dl>
          {note && <p className="border-t border-line px-5 py-3">{note}</p>}
          <p className="border-t border-line bg-lemon-soft px-5 py-3 text-sm">Test mode: payments aren&apos;t connected yet, so nothing is being charged.</p>
        </section>
      )}
      {state !== "none" && <h2 className="mt-10 text-xl font-extrabold">{paying ? "Your options" : "Choose how to continue"}</h2>}
      <PlanPicker
        formulaCount={FORMULAS.length}
        trialDays={TRIAL_DAYS}
        academy={PRICES.academy}
        club={PRICES.club}
        current={kind}
        state={state}
        students={students}
      />
    </SettingsFrame>
  );
}

function Fact({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="px-5 py-4">
      <dt className="text-sm text-ink/60">{label}</dt>
      <dd className="mt-0.5 text-lg font-bold">{value}</dd>
      {detail && <dd className="text-sm text-ink/60">{detail}</dd>}
    </div>
  );
}
