import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@lemmory/db/auth";
import { AuthFrame } from "@lemmory/ui/Shell";
import { ForgotForm } from "./ForgotForm";

export const metadata = { title: "Forgot password · Lemmory for teachers" };

export default async function ForgotPage() {
  if (await currentUser("teacher")) redirect("/");
  return (
    <AuthFrame
      tag="Teacher"
      title="Forgot your password?"
      sub="Enter the email you signed up with and we'll send you a link to set a new one."
      foot={
        <p>
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-ink underline">
            Log in
          </Link>
        </p>
      }
    >
      <ForgotForm />
    </AuthFrame>
  );
}
