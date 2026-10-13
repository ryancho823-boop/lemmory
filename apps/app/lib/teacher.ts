import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
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

/** This site's own address (for the join link teachers share), from the incoming request. */
export async function siteUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3001";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
