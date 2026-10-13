import { defineConfig } from "drizzle-kit";

// `npm run db:generate` writes a new SQL migration after you change src/schema.ts.
export default defineConfig({
  dialect: "turso",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL ?? "file:../../data/lemmory.db", authToken: process.env.DATABASE_AUTH_TOKEN },
});
