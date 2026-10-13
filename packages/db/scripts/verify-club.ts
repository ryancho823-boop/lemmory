// Approve (or reject) a math club's request for club pricing, after confirming with the school.
//   npm run club:verify -- teacher@school.org
//   npm run club:verify -- teacher@school.org --reject
//   npm run club:verify            (lists pending clubs)

import { and, eq } from "drizzle-orm";
import { db } from "../src/client";
import { plans, users } from "../src/schema";

const email = process.argv.slice(2).find((a) => !a.startsWith("--"));
const reject = process.argv.includes("--reject");

async function main() {
  if (!email) {
    const pending = await db
      .select({ name: users.name, email: users.email, school: plans.orgName, schoolEmail: plans.schoolEmail })
      .from(plans)
      .innerJoin(users, eq(users.id, plans.teacherId))
      .where(and(eq(plans.kind, "club"), eq(plans.clubStatus, "pending")));
    if (!pending.length) console.log("No clubs waiting for verification.");
    for (const p of pending) console.log(`${p.school} · ${p.name} · account ${p.email} · school email ${p.schoolEmail}`);
    return;
  }
  const user = await db.select({ id: users.id }).from(users).where(eq(users.email, email.toLowerCase())).get();
  if (!user) throw new Error(`No teacher with email ${email}`);
  await db
    .update(plans)
    .set(reject ? { clubStatus: "rejected" } : { clubStatus: "verified", paidAt: new Date() })
    .where(and(eq(plans.teacherId, user.id), eq(plans.kind, "club")));
  console.log(reject ? `Rejected club pricing for ${email}.` : `Verified the club for ${email}. Club pricing now applies.`);
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e.message);
    process.exit(1);
  },
);
