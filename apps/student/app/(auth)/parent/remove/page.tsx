import { removalTarget } from "@lemmory/db/accounts";
import { AuthFrame } from "@lemmory/ui/Shell";
import { Button } from "@lemmory/ui/ui";
import { removeChild } from "../../../actions";

export const metadata = { title: "Delete account · Lemmory" };

// Opening the link deletes nothing, because mail scanners open links too. The button does it.
export default async function RemovePage({ searchParams }: PageProps<"/parent/remove">) {
  const { token, done } = await searchParams;
  if (done) {
    return (
      <AuthFrame title="Account deleted">
        <p className="text-center text-[15px]">The account and everything in it are gone.</p>
      </AuthFrame>
    );
  }
  const child = typeof token === "string" && token.length <= 100 ? await removalTarget(token) : null;
  if (!child) {
    return (
      <AuthFrame title="This link doesn't work">
        <p className="text-center text-[15px]">The account may already be deleted. Email support@lemmory.com if you need help.</p>
      </AuthFrame>
    );
  }
  return (
    <AuthFrame title={`Delete ${child.name}'s account?`}>
      <form action={removeChild.bind(null, token as string)} className="space-y-4">
        <p className="text-center text-[15px]">This removes the account for {child.username} and all of their practice. It can&apos;t be undone.</p>
        <Button type="submit" variant="danger" size="lg" className="w-full">
          Delete the account
        </Button>
      </form>
    </AuthFrame>
  );
}
