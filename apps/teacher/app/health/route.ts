import { databaseHealth } from "@lemmory/db/health";

// Visit /health to check the database setup on a deployed site. Shows no secrets.
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await databaseHealth(), { headers: { "Cache-Control": "no-store" } });
}
