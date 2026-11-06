import { streak } from "@lemmory/core/analytics";
import { EmailNotice } from "@lemmory/ui/EmailNotice";
import { resendConfirmation } from "../actions";
import { getView, requireStudent } from "@/lib/session";
import { DayWatcher } from "./DayWatcher";
import { StudentShell } from "./StudentShell";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const [v, user] = await Promise.all([getView(), requireStudent()]);
  return (
    <>
    {user.contactEmail && !user.emailConfirmed && <EmailNotice email={user.contactEmail} action={resendConfirmation} />}
    <StudentShell
      name={v.me.name}
      classId={v.klass?.id ?? null}
      classes={v.classes}
      streak={streak(v.record.doneDays, v.today)}
      doneToday={v.doneToday}
      locked={!v.canReview}
    >
      <DayWatcher today={v.today} zone={v.zone} />
      {children}
    </StudentShell>
    </>
  );
}
