import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@lemmory/db/auth";
import { AuthFrame } from "@lemmory/ui/Shell";
import { SignupForm } from "./SignupForm";

export const metadata = { title: "Create an account · Lemmory for teachers" };

export default async function SignupPage() {
  if (await currentUser("teacher")) redirect("/");
  return (
    <AuthFrame
      tag="Teacher"
      title="Create a teacher account"
      sub="Then make a class and share its code with students."
      foot={
        <>
          Have an account?{" "}
          <Link href="/login" className="font-semibold text-ink underline">
            Log in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthFrame>
  );
}
