import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import type { Client } from "@libsql/client";
import { createClient as createWebClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * Local development uses a SQLite file shared by the student and teacher sites. In
 * production, point DATABASE_URL at a hosted libSQL database (Turso) and set
 * DATABASE_AUTH_TOKEN. The default path is relative to the working directory, which is
 * apps/<app> or packages/<pkg> when run through npm workspaces.
 */
export const DATABASE_URL = process.env.DATABASE_URL ?? "file:../../data/lemmory.db";

function localClient(): Client {
  try {
    mkdirSync(dirname(DATABASE_URL.slice("file:".length)), { recursive: true });
  } catch (e) {
    // Hosts like Netlify have a read-only disk, so a local file can't work there.
    throw new Error(`Can't create the local database at ${DATABASE_URL}. In production, set DATABASE_URL to a hosted database (see DEPLOY.md).`, { cause: e });
  }
  // Loaded only for local files: it needs a native SQLite build, which serverless hosts
  // often don't ship. Hosted databases use the web client below, which is plain fetch.
  const { createClient } = createRequire(import.meta.url)("@libsql/client") as typeof import("@libsql/client");
  return createClient({ url: DATABASE_URL });
}

function connect() {
  const client = DATABASE_URL.startsWith("file:")
    ? localClient()
    : createWebClient({ url: DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN });
  return drizzle(client, { schema });
}

// Reuse one connection across dev-server hot reloads.
const g = globalThis as unknown as { lemmoryDb?: ReturnType<typeof connect> };
export const db = (g.lemmoryDb ??= connect());
export type Db = typeof db;
export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];
export { schema };
