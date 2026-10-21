import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@lemmory/db/auth";
import { AuthFrame, RoleToggle } from "@lemmory/ui/Shell";
import { studentUrl } from "@/lib/session";
import { SignupForm } from "./SignupForm";

export const metadata = { title: "Sign up · Lemmory" };

export default async function SignupPage() {
  if (await currentUser("teacher")) redirect("/");
  return (
    <AuthFrame
      title="Sign up"
      top={<RoleToggle current="teacher" teacherHref="/signup" studentHref={`${studentUrl}/join`} />}
      foot={
        <>
          Have an account?{" "}
          <Link href="/login" className="font-semibold text-ink underline">
            Teacher log in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthFrame>
  );
}
