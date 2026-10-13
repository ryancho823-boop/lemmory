import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { currentUser } from "@lemmory/db/auth";
import { AuthFrame } from "@lemmory/ui/Shell";
import { SignupForm } from "./SignupForm";

export const metadata = { title: "Create an account · Lemmory for teachers" };

export default async function SignupPage({ searchParams }: PageProps<"/signup">) {
  if (await currentUser("teacher")) redirect("/");
  const fromLogin = (await searchParams).new === "1";
  const email = fromLogin ? ((await cookies()).get("lemmory_signup_email")?.value ?? "") : "";
  return (
    <AuthFrame
      tag="Teacher"
      title="Create a teacher account"
      sub={
        fromLogin
          ? "We couldn't find an account with that email, so let's make one."
          : "Then make a class and share its code with students."
      }
      foot={
        <>
          Have an account?{" "}
          <Link href="/login" className="font-semibold text-ink underline">
            Log in
          </Link>
        </>
      }
    >
      <SignupForm email={email} />
    </AuthFrame>
  );
}
