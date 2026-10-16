import { NextResponse, type NextRequest } from "next/server";
import { confirmEmail } from "@lemmory/db/accounts";

// The link in a teacher's confirmation email. It works once; then the account is usable.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const done = token.length > 0 && token.length <= 100 ? await confirmEmail(token) : null;
  const to = done?.role === "teacher" ? "/" : "/verify?expired=1";
  return NextResponse.redirect(new URL(to, req.url), 303);
}
