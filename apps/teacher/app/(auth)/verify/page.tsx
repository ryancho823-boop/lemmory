import { redirect } from "next/navigation";
import { AuthFrame } from "@lemmory/ui/Shell";
import { requireSignedIn } from "@/lib/session";
import { logout } from "../../actions";
import { ResendButton } from "./ResendButton";

export const metadata = { title: "Confirm your email · Lemmory" };

/** New teachers land here until they click the link in their confirmation email. */
export default async function VerifyPage({ searchParams }: PageProps<"/verify">) {
  const user = await requireSignedIn();
  if (user.emailVerified) redirect("/");
  const expired = (await searchParams).expired === "1";
  return (
    <AuthFrame
      tag="Teacher"
      title={expired ? "That link doesn't work anymore" : "Check your email"}
      sub={
        expired
          ? "Confirmation links work once, for 24 hours. Send yourself a new one."
          : `We sent a link to ${user.email}. Click it to finish setting up your account.`
      }
      foot={
        <form action={logout}>
          Wrong email?{" "}
          <button className="font-semibold text-ink underline">Log out and sign up again</button>
        </form>
      }
    >
      <ResendButton />
    </AuthFrame>
  );
}
