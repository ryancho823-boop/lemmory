import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@lemmory/db/auth";
import { AuthFrame } from "@lemmory/ui/Shell";
import { studentUrl } from "@/lib/session";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Teacher log in · Lemmory" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const deleted = (await searchParams).deleted === "1";
  if (await currentUser("teacher")) redirect("/");
  return (
    <AuthFrame
      tag="Teacher"
      title="Teacher log in"
      sub={deleted ? "Your account and everything in it were deleted." : "Log in with the email you signed up with."}
      foot={
        <>
          <p>
            New?{" "}
            <Link href="/signup" className="font-semibold text-ink underline">
              Sign up
            </Link>
          </p>
          <p>
            A student?{" "}
            <a href={`${studentUrl}/login`} className="font-semibold text-ink underline">
              Student log in
            </a>
          </p>
        </>
      }
    >
      <LoginForm />
    </AuthFrame>
  );
}
