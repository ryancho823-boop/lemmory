import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import type { Client } from "@libsql/client";
import { createClient as createWebClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/** Values pasted into a host's dashboard often pick up spaces, line breaks or quotes. */
export const cleanEnv = (v: string | undefined) => v?.trim().replace(/^["']+|["']+$/g, "").trim() || undefined;

/**
 * Pull-request previews on Vercel run code that isn't merged yet, so they never use the live
 * database, even if DATABASE_URL is set for them: they read PREVIEW_DATABASE_URL and
 * PREVIEW_DATABASE_AUTH_TOKEN (a separate Turso database) and have no database without them.
 */
export const IS_PREVIEW = process.env.VERCEL_ENV === "preview";
const env = (name: string) => cleanEnv(process.env[IS_PREVIEW ? `PREVIEW_${name}` : name]);

/**
 * Local development uses a SQLite file shared by the student and teacher sites. In
 * production, point DATABASE_URL at a hosted libSQL database (Turso) and set
 * DATABASE_AUTH_TOKEN. The default path is relative to the working directory, which is
 * apps/<app> or packages/<pkg> when run through npm workspaces.
 */
export const DATABASE_URL = env("DATABASE_URL") ?? (IS_PREVIEW ? "" : "file:../../data/lemmory.db");
// Tokens never contain whitespace, so drop any that came along with a paste (a space or
// line break inside the token makes Turso answer "HTTP status 400").
export const DATABASE_AUTH_TOKEN = env("DATABASE_AUTH_TOKEN")?.replace(/\s+/g, "");

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
    : createWebClient({ url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN });
  return drizzle(client, { schema });
}

/** A preview with no database of its own: the site builds, and anything that needs the database says why it can't. */
function noDatabase(): ReturnType<typeof connect> {
  return new Proxy({} as ReturnType<typeof connect>, {
    get() {
      throw new Error("This preview has no database. Previews never use the live one: set PREVIEW_DATABASE_URL and PREVIEW_DATABASE_AUTH_TOKEN (see DEPLOY.md).");
    },
  });
}

// Reuse one connection across dev-server hot reloads.
const g = globalThis as unknown as { lemmoryDb?: ReturnType<typeof connect> };
export const db = (g.lemmoryDb ??= DATABASE_URL ? connect() : noDatabase());
export type Db = typeof db;
export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];
export { schema };
