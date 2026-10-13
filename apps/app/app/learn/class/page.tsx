import { PRICES, getStudentPlan } from "@lemmory/db/billing";
import { PageHeader, Panel } from "@lemmory/ui/ui";
import { getView } from "@/lib/student";
import { ClassList } from "./ClassList";
import { JoinClassForm } from "./JoinClassForm";
import { StudentPlan } from "./StudentPlan";

export const metadata = { title: "Your classes · Lemmory" };

export default async function ClassPage() {
  const v = await getView();
  const plan = await getStudentPlan(v.me.id);
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader title={v.classes.length > 1 ? "Your classes" : "Your class"} />
      {v.classes.length > 0 && <ClassList classes={v.classes} current={v.klass?.id ?? null} />}
      <Panel className="p-5">
        <h2 className="text-[17px] font-semibold">{v.classes.length ? "Join another class" : "Join a class"}</h2>
        <p className="mt-1 text-ink/75">Enter the code your teacher gave you. Your deck is shared across all your classes.</p>
        <JoinClassForm />
      </Panel>
      <Panel className="p-5">
        <h2 className="text-[17px] font-semibold">Your plan</h2>
        {v.classes.length > 0 ? (
          <p className="mt-1 text-ink/75">Your class covers you, so there&apos;s nothing to pay.</p>
        ) : (
          <StudentPlan price={PRICES.student.monthly} body={PRICES.student.body} paid={!!plan} />
        )}
      </Panel>
    </div>
  );
}
