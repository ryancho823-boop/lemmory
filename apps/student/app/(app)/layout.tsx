import { streak } from "@lemmory/core/analytics";
import { getView } from "@/lib/session";
import { StudentShell } from "./StudentShell";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const v = await getView();
  return (
    <StudentShell
      name={v.me.name}
      classId={v.klass?.id ?? null}
      classes={v.classes}
      streak={streak(v.record.doneDays, v.today)}
      doneToday={v.doneToday}
    >
      {children}
    </StudentShell>
  );
}
