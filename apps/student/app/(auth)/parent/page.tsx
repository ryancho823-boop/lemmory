import { parentRequest } from "@lemmory/db/accounts";
import { AuthFrame } from "@lemmory/ui/Shell";
import { ParentForm } from "./ParentForm";

export const metadata = { title: "Parent permission · Lemmory" };

// The link in the email to a parent of a child under 13.
export default async function ParentPage({ searchParams }: PageProps<"/parent">) {
  const { token } = await searchParams;
  const request = typeof token === "string" && token.length <= 100 ? await parentRequest(token) : null;
  if (!request) {
    return (
      <AuthFrame title="This link has expired">
        <p className="text-center text-[15px]">It may already have been used. Otherwise, your child can sign up again and we&apos;ll send a new one.</p>
      </AuthFrame>
    );
  }
  return (
    <AuthFrame title={`Set up ${request.firstName}'s account`}>
      <ParentForm token={token as string} firstName={request.firstName} />
    </AuthFrame>
  );
}
