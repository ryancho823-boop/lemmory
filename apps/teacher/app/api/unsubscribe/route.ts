import type { NextRequest } from "next/server";
import { unsubscribe } from "@lemmory/db/report";

// One-click unsubscribe from a mail app's own button (the List-Unsubscribe-Post header). POST only.
export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const done = token.length > 0 && token.length <= 100 && (await unsubscribe(token));
  return new Response(null, { status: done ? 200 : 404 });
}
