import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@lemmory/db/auth";
import { AuthFrame } from "@lemmory/ui/Shell";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Log in · Lemmory for teachers" };

export default async function LoginPage() {
  if (await currentUser("teacher")) redirect("/");
  return (
    <AuthFrame
      tag="Teacher"
      title="Log in"
      sub="Assign formulas and see what your class is forgetting."
      foot={
        <>
          New to Lemmory?{" "}
          <Link href="/signup" className="font-semibold text-ink underline">
            Create a teacher account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthFrame>
  );
}
