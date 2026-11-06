import { pendingEmail } from "@lemmory/db/accounts";
import { ChangeEmailForm } from "@lemmory/ui/ChangeEmailForm";
import { ChangePasswordForm } from "@lemmory/ui/ChangePasswordForm";
import { ConfirmForm } from "@lemmory/ui/ConfirmForm";
import { PageHeader } from "@lemmory/ui/ui";
import { changeMyEmail, changeMyPassword, deleteMyAccount } from "../../actions";
import { getView, requireStudent } from "@/lib/session";
import { RenameForm } from "./RenameForm";

export const metadata = { title: "Account · Lemmory" };

// Open even when nothing covers the student, like Plan & classes: they can always change or delete their account.
export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  const [v, user, { confirmed, expired }] = await Promise.all([getView(), requireStudent(), searchParams]);
  const waiting = await pendingEmail(user.id, user.contactEmail);
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader title="Account" />
      {confirmed && <p role="status" className="font-semibold text-good">Your email is confirmed.</p>}
      {expired && !user.emailConfirmed && <p role="status" className="font-semibold text-bad">That link doesn&apos;t work anymore. Send a new one below.</p>}
      {user.emailOverdue && <p className="font-semibold">{user.contactEmail ? "Confirm your email to keep using Lemmory." : "Add an email to keep using Lemmory. It's how you get back in if you forget your password."}</p>}
      <RenameForm name={v.me.name} username={v.me.username} />
      <ChangeEmailForm
        email={user.contactEmail}
        confirmed={user.emailConfirmed}
        pending={waiting}
        hint="Yours or a parent's. We use it to confirm your account and reset your password."
        action={changeMyEmail}
      />
      <ChangePasswordForm action={changeMyPassword} />
      <ConfirmForm
        title="Delete your account"
        body="This deletes your account, your cards and all your progress, and takes you out of your classes. It can't be undone."
        label="Your password"
        type="password"
        submit="Delete account"
        action={deleteMyAccount}
      />
    </div>
  );
}
