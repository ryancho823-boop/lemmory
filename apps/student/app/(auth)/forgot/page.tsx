import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@lemmory/db/auth";
import { AuthFrame } from "@lemmory/ui/Shell";
import { ForgotForm } from "./ForgotForm";

export const metadata = { title: "Forgot password · Lemmory" };

export default async function ForgotPage() {
  if (await currentUser("student")) redirect("/");
  return (
    <AuthFrame
      tag="Student"
      title="Forgot your password?"
      sub="Enter your username or the email on your account, which may be a parent's. We'll send a link to set a new password."
      foot={
        <>
          <p>
            Remembered it?{" "}
            <Link href="/login" className="font-semibold text-ink underline">
              Log in
            </Link>
          </p>
          <p>
            No access to that email?{" "}
            <a href="mailto:support@lemmory.com" className="font-semibold text-ink underline">
              Contact support
            </a>
          </p>
        </>
      }
    >
      <ForgotForm />
    </AuthFrame>
  );
}
