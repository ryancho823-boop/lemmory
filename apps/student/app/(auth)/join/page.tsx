import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { currentUser } from "@lemmory/db/auth";
import { AuthFrame } from "@lemmory/ui/Shell";
import { JoinForm } from "./JoinForm";

export const metadata = { title: "Join your class · Lemmory" };

export default async function JoinPage({ searchParams }: PageProps<"/join">) {
  if (await currentUser("student")) redirect("/class");
  const params = await searchParams;
  const code = params.code;
  const fromLogin = params.new === "1";
  const username = fromLogin ? ((await cookies()).get("lemmory_signup_username")?.value ?? "") : "";
  return (
    <AuthFrame
      tag="Student"
      title="Join your class"
      sub={fromLogin ? "We couldn't find that username, so let's make your account. Your teacher gives you the class code." : "Your teacher gives you the class code."}
      foot={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-ink underline">
            Log in
          </Link>
        </>
      }
    >
      <JoinForm code={typeof code === "string" ? code : ""} username={username} />
    </AuthFrame>
  );
}
