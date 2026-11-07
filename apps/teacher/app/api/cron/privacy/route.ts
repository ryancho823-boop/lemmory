import { runPrivacyChores } from "@lemmory/db/accounts";
import { cleanEnv } from "@lemmory/db/client";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** The daily privacy job (see runPrivacyChores). Vercel Cron calls it with `Authorization: Bearer $CRON_SECRET`. */
export async function GET(req: Request) {
  const secret = cleanEnv(process.env.CRON_SECRET);
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Unauthorized", { status: 401 });
  return Response.json(await runPrivacyChores());
}
