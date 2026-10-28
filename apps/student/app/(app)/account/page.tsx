import { ChangePasswordForm } from "@lemmory/ui/ChangePasswordForm";
import { ConfirmForm } from "@lemmory/ui/ConfirmForm";
import { PageHeader } from "@lemmory/ui/ui";
import { changeMyPassword, deleteMyAccount } from "../../actions";
import { getView } from "@/lib/session";

export const metadata = { title: "Account · Lemmory" };

// Open even when nothing covers the student, like Plan & classes: they can always change or delete their account.
export default async function AccountPage() {
  await getView();
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader title="Account" />
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
