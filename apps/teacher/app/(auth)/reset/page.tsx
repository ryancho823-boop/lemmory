import Link from "next/link";
import { resetLinkWorks } from "@lemmory/db/accounts";
import { AuthFrame } from "@lemmory/ui/Shell";
import { Button } from "@lemmory/ui/ui";
import { ResetForm } from "./ResetForm";

export const metadata = { title: "Set a new password · Lemmory for teachers" };

export default async function ResetPage({ searchParams }: PageProps<"/reset">) {
  const { token } = await searchParams;
  const works = typeof token === "string" && token.length <= 100 && (await resetLinkWorks(token));
  if (!works)
    return (
      <AuthFrame tag="Teacher" title="This link doesn't work anymore" sub="Reset links work once, for an hour. Ask for a new one.">
        <Button href="/forgot" size="lg" className="w-full">
          Send a new link
        </Button>
      </AuthFrame>
    );
  return (
    <AuthFrame
      tag="Teacher"
      title="Set a new password"
      sub="You'll be signed out on every other device."
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
