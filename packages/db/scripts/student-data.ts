// Answer a parent's or school's request: show what we hold about a student, or delete it.
//   npm run student:data -- username            (print it, to send to them)
//   npm run student:data -- username --delete   (delete the account and everything in it)
//   npm run student:data -- username --parent-email=new@example.com   (a parent changes their email)
//   npm run student:data -- username --signed   (their parent's signed form came in, so they can join classes)

import { count, eq } from "drizzle-orm";
import { eraseAccount } from "../src/accounts";
import { db } from "../src/client";
import { cards, classes, enrollments, reviews, users } from "../src/schema";

const username = process.argv.slice(2).find((a) => !a.startsWith("--"))?.toLowerCase();

async function main() {
  if (!username) throw new Error("Which username?");
  const student = await db.select().from(users).where(eq(users.username, username)).get();
  if (!student) throw new Error(`No student has the username ${username}`);
  if (process.argv.includes("--delete")) {
    await eraseAccount(student.id);
    console.log(`Deleted ${username} and everything in the account.`);
    return;
  }
  if (process.argv.includes("--signed")) {
    await db.update(users).set({ consent: "signed" }).where(eq(users.id, student.id));
    console.log(`${username} can now join classes.`);
    return;
  }
  const parentEmail = process.argv.find((a) => a.startsWith("--parent-email="))?.split("=")[1]?.toLowerCase();
  if (parentEmail) {
    await db.update(users).set({ recoveryEmail: parentEmail, emailConfirmedAt: new Date() }).where(eq(users.id, student.id));
    console.log(`The contact email for ${username} is now ${parentEmail}.`);
    return;
  }
  const inClasses = await db.select({ name: classes.name }).from(enrollments).innerJoin(classes, eq(classes.id, enrollments.classId)).where(eq(enrollments.studentId, student.id));
  const deck = await db.select({ formulaId: cards.formulaId, stage: cards.stage }).from(cards).where(eq(cards.studentId, student.id));
  const [answers] = await db.select({ n: count() }).from(reviews).where(eq(reviews.studentId, student.id));
  const { name, recoveryEmail, timezone, consent, parentSignature, parentSignedAt, createdAt } = student;
  console.log(JSON.stringify({ name, username, contactEmail: recoveryEmail, timezone, permission: consent, parentSignature, parentSignedAt, joined: createdAt, classes: inClasses.map((c) => c.name), cardsInDeck: deck, answersRecorded: answers.n }, null, 2));
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e.message);
    process.exit(1);
  },
);
