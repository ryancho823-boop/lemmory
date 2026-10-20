import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { currentUser } from "@lemmory/db/auth";
import { AuthFrame, RoleToggle } from "@lemmory/ui/Shell";
import { PRICES } from "@lemmory/db/billing";
import { teacherUrl } from "@/lib/links";
import { JoinForm } from "./JoinForm";

export const metadata = { title: "Sign up · Lemmory" };

export default async function JoinPage({ searchParams }: PageProps<"/join">) {
  if (await currentUser("student")) redirect("/class");
  const params = await searchParams;
  const code = params.code;
  const fromLogin = params.new === "1";
  // Students without a class sign up "on their own" and get the individual plan.
  const onOwn = params.own === "1";
  const username = fromLogin ? ((await cookies()).get("lemmory_signup_username")?.value ?? "") : "";
  return (
    <AuthFrame
      title="Sign up"
      sub={
        onOwn
          ? `For studying on your own: $${PRICES.student.monthly} a month, no class code needed.`
          : fromLogin
            ? "No account with that username yet, so let's make one."
            : undefined
      }
      top={<RoleToggle current="student" teacherHref={`${teacherUrl}/signup`} studentHref="/join" />}
      foot={
        <>
          <p>
            {onOwn ? (
              <Link href="/join" className="font-semibold text-ink underline">
                Have a class code? Sign up with it
              </Link>
            ) : (
              <Link href="/join?own=1" className="font-semibold text-ink underline">
                No class code? Sign up on your own
              </Link>
            )}
          </p>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-ink underline">
            Student log in
          </Link>
        </>
      }
    >
      <JoinForm code={typeof code === "string" ? code : ""} username={username} onOwn={onOwn} />
    </AuthFrame>
  );
}
