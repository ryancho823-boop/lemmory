import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { currentUser } from "@lemmory/db/auth";
import { AuthFrame, RoleToggle } from "@lemmory/ui/Shell";
import { studentUrl } from "@/lib/session";
import { SignupForm } from "./SignupForm";

export const metadata = { title: "Sign up · Lemmory" };

export default async function SignupPage({ searchParams }: PageProps<"/signup">) {
  if (await currentUser("teacher")) redirect("/");
  const fromLogin = (await searchParams).new === "1";
  const email = fromLogin ? ((await cookies()).get("lemmory_signup_email")?.value ?? "") : "";
  return (
    <AuthFrame
      title="Sign up"
      sub={fromLogin ? "No account with that email yet, so let's make one." : undefined}
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
      <SignupForm email={email} />
    </AuthFrame>
  );
}
