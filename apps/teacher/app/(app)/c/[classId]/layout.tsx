import { getClass, getClasses, requirePlan } from "@/lib/session";
import { TeacherShell } from "./TeacherShell";

export default async function ClassLayout({ children, params }: LayoutProps<"/c/[classId]">) {
  const { classId } = await params;
  const me = await requirePlan();
  const [classes, view] = await Promise.all([getClasses(), getClass(classId)]);
  return (
    <TeacherShell classId={classId} className={view.klass.name} classes={classes.map((c) => ({ id: c.id, name: c.name }))} teacher={me.name}>
      {children}
    </TeacherShell>
  );
}
