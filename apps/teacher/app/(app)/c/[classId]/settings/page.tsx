import { isoDate } from "@lemmory/core/days";
import { PageHeader, Panel } from "@lemmory/ui/ui";
import { getClass, studentUrl } from "@/lib/session";
import { ConfirmForm } from "@lemmory/ui/ConfirmForm";
import { deleteClassAction, updateClassAction } from "../../../../actions";
import { ClassForm } from "../../../ClassForm";
import { JoinCode } from "../JoinCode";
import { NewCodeButton } from "./NewCodeButton";

export const metadata = { title: "Class settings · Lemmory for teachers" };

export default async function Settings({ params }: PageProps<"/c/[classId]/settings">) {
  const { classId } = await params;
  const { klass } = await getClass(classId);
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Class settings" />
      <Panel className="p-6">
        <ClassForm
          action={updateClassAction.bind(null, classId)}
          submit="Save"
          initial={{
            name: klass.name,
            contestName: klass.contestName ?? "",
            contestDate: klass.contestDay === null ? "" : isoDate(klass.contestDay),
            timezone: klass.timezone,
          }}
        />
      </Panel>
      <Panel className="p-6">
        <h2 className="mb-4 text-[15px] font-bold">Joining</h2>
        <JoinCode code={klass.joinCode} url={studentUrl} />
        <div className="mt-5 border-t border-line pt-4">
          <p className="mb-3 text-sm text-ink/55">A new code stops the old one from working. Students already in the class stay.</p>
          <NewCodeButton classId={classId} />
        </div>
      </Panel>
      <ConfirmForm
        title="Delete this class"
        body={<>The roster, assignments and leaderboard go away. Students keep their accounts and cards. Type <strong>{klass.name}</strong> to confirm.</>}
        label="Class name"
        submit="Delete class"
        action={deleteClassAction.bind(null, classId)}
      />
    </div>
  );
}
