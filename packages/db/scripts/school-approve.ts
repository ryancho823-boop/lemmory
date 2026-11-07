// Record a school's signed form, so under-13s can join a class without a parent's email.
//   npm run school:approve -- ABC123            (approve the class with this join code)
//   npm run school:approve -- ABC123 --remove   (take the approval away)
//   npm run school:approve                      (list approved classes)

import { eq, isNotNull } from "drizzle-orm";
import { db } from "../src/client";
import { classes, users } from "../src/schema";

const code = process.argv.slice(2).find((a) => !a.startsWith("--"))?.toUpperCase();
const remove = process.argv.includes("--remove");

async function main() {
  if (!code) {
    const approved = await db
      .select({ name: classes.name, code: classes.joinCode, teacher: users.email })
      .from(classes)
      .innerJoin(users, eq(users.id, classes.teacherId))
      .where(isNotNull(classes.schoolApprovedAt));
    if (!approved.length) console.log("No classes are school approved.");
    for (const c of approved) console.log(`${c.code} · ${c.name} · ${c.teacher}`);
    return;
  }
  const klass = await db.select({ id: classes.id, name: classes.name }).from(classes).where(eq(classes.joinCode, code)).get();
  if (!klass) throw new Error(`No class has the code ${code}`);
  await db.update(classes).set({ schoolApprovedAt: remove ? null : new Date() }).where(eq(classes.id, klass.id));
  console.log(remove ? `Removed school approval from ${klass.name}.` : `${klass.name} is school approved.`);
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e.message);
    process.exit(1);
  },
);
