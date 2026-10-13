import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@lemmory/db/auth";
import { AuthFrame } from "@lemmory/ui/Shell";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Log in · Lemmory" };

export default async function LoginPage() {
  if (await currentUser("student")) redirect("/");
  return (
    <AuthFrame
      tag="Student"
      title="Log in"
      sub="Do today's cards and keep your streak going."
      foot={
        <>
          New here?{" "}
          <Link href="/join" className="font-semibold text-ink underline">
            Join your class
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthFrame>
  );
}
