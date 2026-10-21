import { PRICES, TRIAL_DAYS, getStudentPlan, studentPlanState } from "@lemmory/db/billing";
import { classCovers } from "@lemmory/db/student";
import { ConfirmForm } from "@lemmory/ui/ConfirmForm";
import { PageHeader, Panel } from "@lemmory/ui/ui";
import { deleteMyAccount } from "../../actions";
import { getView } from "@/lib/session";
import { ClassList } from "./ClassList";
import { JoinClassForm } from "./JoinClassForm";
import { StudentPlan } from "./StudentPlan";

export const metadata = { title: "Your classes · Lemmory" };

const fmt = (d: Date | null) => d?.toLocaleDateString("en-US", { month: "long", day: "numeric" }) ?? null;

// The one page a student can always open: when nothing covers them, every other page sends them here.
export default async function ClassPage() {
  const v = await getView();
  const [plan, covered] = await Promise.all([getStudentPlan(v.me.id), classCovers(v.me.id)]);
  const { state, endsAt } = studentPlanState(plan);
  const inClass = v.classes.length > 0;
  // A class covers the student unless its teacher's trial ended unpaid.
  const classEnded = inClass && !covered;
  const planPanel = (
    <Panel className="p-5">
      <h2 className="text-[17px] font-semibold">{covered ? "Your plan" : "Individual plan"}</h2>
      {covered && state !== "active" && state !== "trial" ? (
        <p className="mt-1 text-ink/75">Your class covers you, so there&apos;s nothing to pay.</p>
      ) : (
        <StudentPlan price={PRICES.student.monthly} body={PRICES.student.body} trialDays={TRIAL_DAYS} state={state} endsOn={fmt(endsAt)} />
      )}
    </Panel>
  );
  const joinPanel = (
    <Panel className="p-5">
      <h2 className="text-[17px] font-semibold">{inClass ? "Join another class" : "Have a class code?"}</h2>
      <p className="mt-1 text-ink/75">Enter the code your teacher gave you. Your deck is shared across all your classes.</p>
      <JoinClassForm />
    </Panel>
  );
  // Students covered by a class see their classes first; everyone else sees the plan first.
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader title={inClass ? (v.classes.length > 1 ? "Your classes" : "Your class") : "Plan & classes"} />
      {classEnded && !v.canReview && (
        <Panel className="border-2 border-lemon p-5">
          <p className="font-semibold">Your class&apos;s free trial has ended</p>
          <p className="mt-1 text-ink/75">Ask your teacher to pick a plan, or get the individual plan below. Your cards and progress are saved.</p>
        </Panel>
      )}
      {inClass && <ClassList classes={v.classes} current={v.klass?.id ?? null} />}
      {covered ? joinPanel : planPanel}
      {covered ? planPanel : joinPanel}
      <ConfirmForm
        title="Delete your account"
        body="This deletes your account, your cards and all your progress, and takes you out of your classes. It can't be undone."
        label="Your password"
        type="password"
        submit="Delete account"
        action={deleteMyAccount}
      />
    </div>
  );
}
