import { pendingEmail, recoveryEmail } from "@lemmory/db/accounts";
import { PRICES, getStudentPlan } from "@lemmory/db/billing";
import { PageHeader, Panel } from "@lemmory/ui/ui";
import { getView } from "@/lib/session";
import { ClassList } from "./ClassList";
import { JoinClassForm } from "./JoinClassForm";
import { RecoveryEmail } from "./RecoveryEmail";
import { StudentPlan } from "./StudentPlan";

export const metadata = { title: "Your classes · Lemmory" };

export default async function ClassPage({ searchParams }: PageProps<"/class">) {
  const v = await getView();
  const [plan, email, pending, params] = await Promise.all([getStudentPlan(v.me.id), recoveryEmail(v.me.id), pendingEmail(v.me.id), searchParams]);
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
        <h2 className="text-[17px] font-semibold">Password recovery email</h2>
        {params.email === "confirmed" && <p className="mt-1 font-semibold text-good">Email confirmed.</p>}
        {params.email === "expired" && <p className="mt-1 font-semibold text-bad">That link doesn&apos;t work anymore. Send a new one below.</p>}
        <RecoveryEmail email={email} pending={pending} />
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
