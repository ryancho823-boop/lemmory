import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@lemmory/db/auth";
import { AuthFrame } from "@lemmory/ui/Shell";
import { JoinForm } from "./JoinForm";

export const metadata = { title: "Join your class · Lemmory" };

export default async function JoinPage({ searchParams }: PageProps<"/join">) {
  if (await currentUser("student")) redirect("/learn/class");
  const { code } = await searchParams;
  return (
    <AuthFrame
      tag="Student"
      title="Join your class"
      sub="Your teacher gives you the class code."
      foot={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-ink underline">
            Log in
          </Link>
        </>
      }
    >
      <JoinForm code={typeof code === "string" ? code : ""} />
    </AuthFrame>
  );
}
