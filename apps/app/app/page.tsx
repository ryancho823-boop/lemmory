import { redirect } from "next/navigation";
import { currentUser } from "@lemmory/db/auth";

/** Send people to their side of the app. */
export default async function Home() {
  if (await currentUser("teacher")) redirect("/teach");
  if (await currentUser("student")) redirect("/learn");
  redirect("/login");
}
