import { pendingEmail } from "@lemmory/db/accounts";
import { getWeeklyReport } from "@lemmory/db/report";
import { ChangeEmailForm } from "@lemmory/ui/ChangeEmailForm";
import { ChangePasswordForm } from "@lemmory/ui/ChangePasswordForm";
import { ConfirmForm } from "@lemmory/ui/ConfirmForm";
import { changeMyEmail, changeMyPassword, deleteMyAccount } from "../../actions";
import { requireTeacher } from "@/lib/session";
import { SettingsFrame } from "../SettingsFrame";
import { RenameForm } from "./RenameForm";
import { WeeklyReportSwitch } from "./WeeklyReportSwitch";

export const metadata = { title: "Account · Lemmory for teachers" };

// Open even when the trial has ended, like Plan & billing: a teacher can always change or delete their account.
export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  const [user, { confirmed, expired }] = await Promise.all([requireTeacher(), searchParams]);
  const [waiting, weekly] = await Promise.all([pendingEmail(user.id, user.contactEmail), getWeeklyReport(user.id)]);
  return (
    <SettingsFrame active="/account" title="Account" back="Back to your classes">
      <div className="max-w-2xl space-y-6">
        {confirmed && <p role="status" className="font-semibold text-good">Your email is confirmed.</p>}
        {expired && !user.emailConfirmed && <p role="status" className="font-semibold text-bad">That link doesn&apos;t work anymore. Send a new one below.</p>}
        {user.emailOverdue && <p className="font-semibold">Confirm your email to keep using Lemmory.</p>}
        <RenameForm name={user.name} />
        <ChangeEmailForm email={user.contactEmail} confirmed={user.emailConfirmed} pending={waiting} hint="This is also how you log in." action={changeMyEmail} />
        <WeeklyReportSwitch on={weekly} />
        <ChangePasswordForm action={changeMyPassword} />
        <ConfirmForm
          title="Delete your account"
          body="This deletes your account and your classes, with their rosters and assignments. Your students keep their own accounts and decks. It can't be undone."
          label="Your password"
          type="password"
          submit="Delete account"
          action={deleteMyAccount}
        />
      </div>
    </SettingsFrame>
  );
}
