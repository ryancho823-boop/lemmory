import Link from "next/link";
import { resetLinkRole } from "@lemmory/db/accounts";
import { AuthFrame } from "@lemmory/ui/Shell";
import { Button } from "@lemmory/ui/ui";
import { ResetForm } from "./ResetForm";

export const metadata = { title: "Choose a new password · Lemmory" };

/** The link from a student's "Email me a link". */
export default async function ResetPage({ searchParams }: PageProps<"/reset">) {
  const { token } = await searchParams;
  const works = typeof token === "string" && token.length <= 100 && (await resetLinkRole(token)) === "student";
  if (!works)
    return (
      <AuthFrame tag="Student" title="This link doesn't work anymore" sub="Reset links work once, for an hour.">
        <Button href="/forgot" size="lg" className="w-full">
          Get a new one
        </Button>
      </AuthFrame>
    );
  return (
    <AuthFrame
      tag="Student"
      title="Choose a new password"
      sub="You'll be logged out on every other device."
      foot={
        <p>
          <Link href="/login" className="font-semibold text-ink underline">
            Back to log in
          </Link>
        </p>
      }
    >
      <ResetForm token={token} />
    </AuthFrame>
  );
}
