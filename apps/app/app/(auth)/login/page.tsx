import Link from "next/link";
import { currentUser } from "@lemmory/db/auth";
import { AuthFrame } from "@lemmory/ui/Shell";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Log in · Lemmory" };

export default async function LoginPage() {
  // Already signed in? Offer a way back, but still allow signing in as someone else
  // (say, a teacher checking a student account on the same computer).
  const [teacher, student] = await Promise.all([currentUser("teacher"), currentUser("student")]);
  const signedIn = teacher ? { name: teacher.name, href: "/teach" } : student ? { name: student.name, href: "/learn" } : null;
  return (
    <AuthFrame
      title="Log in"
      foot={
        <>
          New teacher?{" "}
          <Link href="/signup" className="font-semibold text-ink underline">
            Create an account
          </Link>
          <br />
          Student?{" "}
          <Link href="/join" className="font-semibold text-ink underline">
            Join your class
          </Link>
        </>
      }
    >
      {signedIn && (
        <p className="mb-5 rounded-xl bg-lemon-soft p-3 text-sm">
          You&apos;re logged in as {signedIn.name}.{" "}
          <Link href={signedIn.href} className="font-semibold underline">
            Continue
          </Link>
        </p>
      )}
      <LoginForm />
    </AuthFrame>
  );
}
