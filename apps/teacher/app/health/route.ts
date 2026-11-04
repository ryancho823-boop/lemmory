import { databaseHealth } from "@lemmory/db/health";

// Visit /health to check the database setup on a deployed site. Shows no secrets.
export const dynamic = "force-dynamic";

export async function GET() {
  const health = await databaseHealth();
  // A broken setup answers 503, so an uptime monitor notices it.
  const ok = health.database === "connected" && health.schema === "up to date";
  return Response.json(health, { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
