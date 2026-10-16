import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { currentUser } from "@lemmory/db/auth";
import { AuthFrame, RoleToggle } from "@lemmory/ui/Shell";
import { teacherUrl } from "@/lib/links";
import { JoinForm } from "./JoinForm";

export const metadata = { title: "Sign up · Lemmory" };

export default async function JoinPage({ searchParams }: PageProps<"/join">) {
  if (await currentUser("student")) redirect("/class");
  const params = await searchParams;
  const code = params.code;
  const fromLogin = params.new === "1";
  const username = fromLogin ? ((await cookies()).get("lemmory_signup_username")?.value ?? "") : "";
  return (
    <AuthFrame
      title="Sign up"
      sub={fromLogin ? "No account with that username yet, so let's make one." : undefined}
      top={<RoleToggle current="student" teacherHref={`${teacherUrl}/signup`} studentHref="/join" />}
      foot={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-ink underline">
            Student log in
          </Link>
        </>
      }
    >
      <JoinForm code={typeof code === "string" ? code : ""} username={username} />
    </AuthFrame>
  );
}
