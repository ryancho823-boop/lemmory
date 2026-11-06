import { AuthFrame } from "@lemmory/ui/Shell";
import { UnsubscribeButton } from "./UnsubscribeButton";

export const metadata = { title: "Unsubscribe · Lemmory" };

// A button, not an instant change: mail scanners open every link, and that shouldn't unsubscribe anyone.
export default async function UnsubscribePage({ searchParams }: PageProps<"/unsubscribe">) {
  const { token } = await searchParams;
  return (
    <AuthFrame tag="Teacher" title="Stop the weekly report?" sub="You'll still get account emails, like password resets. You can turn it back on from your Account page.">
      <UnsubscribeButton token={typeof token === "string" ? token.slice(0, 100) : ""} />
    </AuthFrame>
  );
}
