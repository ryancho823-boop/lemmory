import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * Local development uses a SQLite file shared by both apps. In production, point
 * DATABASE_URL at a hosted libSQL database (e.g. Turso) and set DATABASE_AUTH_TOKEN.
 * The default path is relative to the working directory, which is apps/<app> or
 * packages/<pkg> when run through npm workspaces.
 */
export const DATABASE_URL = process.env.DATABASE_URL ?? "file:../../data/lemmory.db";

function connect() {
  if (DATABASE_URL.startsWith("file:")) {
    try {
      mkdirSync(dirname(DATABASE_URL.slice("file:".length)), { recursive: true });
    } catch (e) {
      // Hosts like Netlify have a read-only disk, so a local file can't work there.
      throw new Error(`Can't create the local database at ${DATABASE_URL}. In production, set DATABASE_URL to a hosted database (see README).`, { cause: e });
    }
  }
  const client = createClient({ url: DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN });
  return drizzle(client, { schema });
}

// Reuse one connection across dev-server hot reloads.
const g = globalThis as unknown as { lemmoryDb?: ReturnType<typeof connect> };
export const db = (g.lemmoryDb ??= connect());
export type Db = typeof db;
export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];
export { schema };
