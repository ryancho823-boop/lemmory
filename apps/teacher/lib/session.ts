import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@lemmory/db/auth";
import { NotFound, listClasses, loadTeacherClass } from "@lemmory/db/teacher";
import { getPlan, planState } from "@lemmory/db/billing";

/** The signed-in teacher, or a redirect to the login page. */
export const requireTeacher = cache(async () => {
  const user = await currentUser("teacher");
  if (!user) redirect("/login");
  return user;
});

/**
 * The signed-in teacher, if their plan lets them use Lemmory right now. New teachers and
 * teachers whose free pilot ended are sent to the plan page.
 */
export const requirePlan = cache(async () => {
  const user = await requireTeacher();
  const { state } = planState(await getPlan(user.id));
  if (state === "none" || state === "expired") redirect("/plan");
  return user;
});

export const getClasses = cache(async () => listClasses((await requireTeacher()).id));

/** One of this teacher's classes with every student's record, or a 404. Loaded once per request. */
export const getClass = cache(async (classId: string) => {
  const user = await requireTeacher();
  try {
    return await loadTeacherClass(user.id, classId);
  } catch (e) {
    if (e instanceof NotFound) notFound();
    throw e;
  }
});

/** The student site, for the join link teachers share. Override with NEXT_PUBLIC_STUDENT_URL. */
export const studentUrl = (
  process.env.NEXT_PUBLIC_STUDENT_URL ?? (process.env.NODE_ENV === "development" ? "http://localhost:3001" : "https://lemmory-student.vercel.app")
).replace(/\/$/, "");

/** This site, for links in emails. Override with NEXT_PUBLIC_TEACHER_URL. */
export const teacherUrl = (
  process.env.NEXT_PUBLIC_TEACHER_URL ?? (process.env.NODE_ENV === "development" ? "http://localhost:3002" : "https://lemmory-teacher.vercel.app")
).replace(/\/$/, "");
