import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@lemmory/db/auth";
import { NotFound, listClasses, loadTeacherClass } from "@lemmory/db/teacher";

/** The signed-in teacher, or a redirect to the login page. */
export const requireTeacher = cache(async () => {
  const user = await currentUser("teacher");
  if (!user) redirect("/login");
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
  process.env.NEXT_PUBLIC_STUDENT_URL ?? (process.env.NODE_ENV === "development" ? "http://localhost:3001" : "https://lemmory-student.netlify.app")
).replace(/\/$/, "");
