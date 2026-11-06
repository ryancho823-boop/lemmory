import { NextResponse, type NextRequest } from "next/server";
import { confirmEmail } from "@lemmory/db/accounts";

// The link in a confirmation email. It works once.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const done = token.length > 0 && token.length <= 100 ? await confirmEmail(token) : null;
  return NextResponse.redirect(new URL(done?.role === "student" ? "/account?confirmed=1" : "/account?expired=1", req.url), 303);
}
