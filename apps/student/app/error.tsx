"use client";

import { ErrorPage } from "@lemmory/ui/ErrorPage";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorPage reset={reset} />;
}
