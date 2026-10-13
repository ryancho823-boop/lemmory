import { getClass, getClasses, requireTeacher } from "@/lib/teacher";
import { TeacherShell } from "./TeacherShell";

export default async function ClassLayout({ children, params }: LayoutProps<"/teach/c/[classId]">) {
  const { classId } = await params;
  const [me, classes, view] = await Promise.all([requireTeacher(), getClasses(), getClass(classId)]);
  return (
    <TeacherShell classId={classId} className={view.klass.name} classes={classes.map((c) => ({ id: c.id, name: c.name }))} teacher={me.name}>
      {children}
    </TeacherShell>
  );
}
