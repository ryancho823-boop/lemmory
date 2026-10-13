// Applies the SQL migrations in packages/db/drizzle to DATABASE_URL.
//   npm run db:migrate
import { migrate } from "drizzle-orm/libsql/migrator";
import { DATABASE_URL, db } from "../src/client";

migrate(db, { migrationsFolder: new URL("../drizzle", import.meta.url).pathname }).then(
  () => {
    console.log(`Migrated ${DATABASE_URL}`);
    process.exit(0);
  },
  (e) => {
    console.error(e);
    process.exit(1);
  },
);
