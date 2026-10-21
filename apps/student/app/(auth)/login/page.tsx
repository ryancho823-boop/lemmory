import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@lemmory/db/auth";
import { AuthFrame } from "@lemmory/ui/Shell";
import { teacherUrl } from "@/lib/links";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Student log in · Lemmory" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const deleted = (await searchParams).deleted === "1";
  if (await currentUser("student")) redirect("/");
  return (
    <AuthFrame
      tag="Student"
      title="Student log in"
      sub={deleted ? "Your account and everything in it were deleted." : "Log in with your username."}
      foot={
        <>
          <p>
            New?{" "}
            <Link href="/join" className="font-semibold text-ink underline">
              Sign up
            </Link>
          </p>
          <p>
            A teacher?{" "}
            <a href={`${teacherUrl}/login`} className="font-semibold text-ink underline">
              Teacher log in
            </a>
          </p>
        </>
      }
    >
      <LoginForm />
    </AuthFrame>
  );
}
