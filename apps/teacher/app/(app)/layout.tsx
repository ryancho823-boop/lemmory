import { EmailNotice } from "@lemmory/ui/EmailNotice";
import { resendConfirmation } from "../actions";
import { requireTeacher } from "@/lib/session";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await requireTeacher();
  return (
    <>
      {user.contactEmail && !user.emailConfirmed && <EmailNotice email={user.contactEmail} action={resendConfirmation} />}
      {children}
    </>
  );
}
