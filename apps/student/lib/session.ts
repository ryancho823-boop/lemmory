import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { currentUser } from "@lemmory/db/auth";
import { loadStudentView } from "@lemmory/db/student";

/** The signed-in student, or a redirect to the login page. */
export const requireStudent = cache(async () => {
  const user = await currentUser("student");
  if (!user) redirect("/login");
  return user;
});

/** Which of the student's classes the app is showing. */
export const CLASS_COOKIE = "lemmory_class";

/** Everything the app shows about the signed-in student. Loaded once per request. */
export const getView = cache(async () => loadStudentView(await requireStudent(), (await cookies()).get(CLASS_COOKIE)?.value));

/**
 * The same, for every page but Plan & classes. Without a trial, a payment or a class that
 * covers them, students can't see anything else, so they're sent there.
 */
export const getUnlockedView = cache(async () => {
  const v = await getView();
  if (!v.canReview) redirect("/class");
  return v;
});
