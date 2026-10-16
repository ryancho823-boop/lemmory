import { NextResponse, type NextRequest } from "next/server";
import { confirmEmail } from "@lemmory/db/accounts";

// The link that confirms a student's recovery email.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const done = token.length > 0 && token.length <= 100 ? await confirmEmail(token) : null;
  const to = done?.role === "student" ? "/class?email=confirmed" : "/class?email=expired";
  return NextResponse.redirect(new URL(to, req.url), 303);
}
