import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TopBar } from "@lemmory/ui/Shell";
import { ChangePasswordForm } from "@lemmory/ui/ChangePasswordForm";
import { ConfirmForm } from "@lemmory/ui/ConfirmForm";
import { changeMyPassword, deleteMyAccount } from "../../actions";
import { requireTeacher } from "@/lib/session";
import { LogoutButton } from "../LogoutButton";

export const metadata = { title: "Account · Lemmory for teachers" };

// Open even when the trial has ended, like Plan & billing: a teacher can always change or delete their account.
export default async function AccountPage() {
  await requireTeacher();
  return (
    <div className="product min-h-screen bg-canvas">
      <TopBar tag="Teacher" width="max-w-5xl">
        <LogoutButton />
      </TopBar>
      <main className="mx-auto max-w-2xl px-5 pb-20 pt-8">
        <Link href="/" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 hover:text-ink">
          <ArrowLeft size={15} /> Back to your classes
        </Link>
        <h1 className="text-[32px] font-extrabold">Account</h1>
        <div className="mt-6 space-y-6">
          <ChangePasswordForm action={changeMyPassword} />
          <ConfirmForm
            title="Delete your account"
            body="This deletes your account and your classes, with their rosters and assignments. Your students keep their own accounts and cards. It can't be undone."
            label="Your password"
            type="password"
            submit="Delete account"
            action={deleteMyAccount}
          />
        </div>
      </main>
    </div>
  );
}
