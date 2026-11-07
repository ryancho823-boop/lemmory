// A signed parent form came in: send that parent the link to set up their child's account.
//   npm run parent:invite -- Mia parent@example.com            (studying on their own)
//   npm run parent:invite -- Mia parent@example.com ABC123     (joining the class with this code)
// With no email key on this computer, the email prints here. Send the parent the link yourself.

import { eq } from "drizzle-orm";
import { requestParentPermission } from "../src/accounts";
import { db } from "../src/client";
import { classes } from "../src/schema";

const [firstName, email, code] = process.argv.slice(2);

async function main() {
  if (!firstName || !email) throw new Error("Give a first name and the parent's email.");
  const klass = code ? await db.select({ id: classes.id }).from(classes).where(eq(classes.joinCode, code.toUpperCase())).get() : null;
  if (code && !klass) throw new Error(`No class has the code ${code}`);
  const problem = await requestParentPermission(firstName, email, klass?.id, undefined, true);
  if (problem) throw new Error(problem);
  console.log(`Set-up link created for ${firstName}. It works for 14 days.`);
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e.message);
    process.exit(1);
  },
);
