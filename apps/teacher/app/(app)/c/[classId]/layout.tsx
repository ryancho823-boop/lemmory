import { getClass, getClasses, requirePlan } from "@/lib/session";
import { getPlan, planState, trialDaysLeft } from "@lemmory/db/billing";
import { TeacherShell } from "./TeacherShell";

export default async function ClassLayout({ children, params }: LayoutProps<"/c/[classId]">) {
  const { classId } = await params;
  const me = await requirePlan();
  const [classes, view, plan] = await Promise.all([getClasses(), getClass(classId), getPlan(me.id)]);
  return (
    <TeacherShell classId={classId} className={view.klass.name} classes={classes.map((c) => ({ id: c.id, name: c.name }))} teacher={me.name} trialDaysLeft={trialDaysLeft(planState(plan))}>
      {children}
    </TeacherShell>
  );
}
