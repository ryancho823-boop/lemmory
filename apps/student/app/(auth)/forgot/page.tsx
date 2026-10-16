import Link from "next/link";
import { AuthFrame } from "@lemmory/ui/Shell";
import { CodeForm, EmailForm } from "./ForgotForms";

export const metadata = { title: "Forgot your password · Lemmory" };

export default function ForgotPage() {
  return (
    <AuthFrame
      tag="Student"
      title="Forgot your password?"
      sub="Ask your teacher for a reset code, then choose a new password here. Your teacher never sees it."
      foot={
        <p>
          <Link href="/login" className="font-semibold text-ink underline">
            Back to log in
          </Link>
        </p>
      }
    >
      <CodeForm />
      <div className="mt-8 border-t border-line pt-6">
        <h2 className="font-semibold">Added an email to your account?</h2>
        <p className="mb-4 mt-1 text-sm text-ink/70">We can email you a link instead.</p>
        <EmailForm />
      </div>
    </AuthFrame>
  );
}
