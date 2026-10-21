import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@lemmory/db/auth";
import { AuthFrame, RoleToggle } from "@lemmory/ui/Shell";
import { PRICES, TRIAL_DAYS } from "@lemmory/db/billing";
import { teacherUrl } from "@/lib/links";
import { JoinForm } from "./JoinForm";

export const metadata = { title: "Sign up · Lemmory" };

export default async function JoinPage({ searchParams }: PageProps<"/join">) {
  if (await currentUser("student")) redirect("/class");
  const params = await searchParams;
  const code = params.code;
  // Students without a class sign up "on their own" and get the individual plan.
  const onOwn = params.own === "1";
  return (
    <AuthFrame
      title="Sign up"
      sub={
        onOwn
          ? `For studying on your own: free for ${TRIAL_DAYS} days, then $${PRICES.student.monthly} a month. No class code needed.`
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
      <JoinForm code={typeof code === "string" ? code : ""} onOwn={onOwn} />
    </AuthFrame>
  );
}
