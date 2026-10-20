import { PRICES, getStudentPlan } from "@lemmory/db/billing";
import { PageHeader, Panel } from "@lemmory/ui/ui";
import { getView } from "@/lib/session";
import { ClassList } from "./ClassList";
import { JoinClassForm } from "./JoinClassForm";
import { StudentPlan } from "./StudentPlan";

export const metadata = { title: "Your classes · Lemmory" };

export default async function ClassPage() {
  const v = await getView();
  const plan = await getStudentPlan(v.me.id);
  const inClass = v.classes.length > 0;
  const planPanel = (
    <Panel className="p-5">
      <h2 className="text-[17px] font-semibold">{inClass ? "Your plan" : "Individual plan"}</h2>
      {inClass ? (
        <p className="mt-1 text-ink/75">Your class covers you, so there&apos;s nothing to pay.</p>
      ) : (
        <StudentPlan price={PRICES.student.monthly} body={PRICES.student.body} paid={!!plan} />
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
  // Students on their own see the plan first; students in a class see their classes first.
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader title={inClass ? (v.classes.length > 1 ? "Your classes" : "Your class") : "Plan & classes"} />
      {inClass && <ClassList classes={v.classes} current={v.klass?.id ?? null} />}
      {inClass ? joinPanel : planPanel}
      {inClass ? planPanel : joinPanel}
    </div>
  );
}
