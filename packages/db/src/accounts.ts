import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./client";
import { hashPassword, newId, verifyPassword } from "./password";
import { users } from "./schema";

// A real hash to compare against when the account doesn't exist, so a wrong username
// takes as long as a wrong password.
const DUMMY = hashPassword("not-a-real-password");

export async function createTeacher(name: string, email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  if (await db.select({ id: users.id }).from(users).where(eq(users.email, normalized)).get()) return null;
  const id = newId();
  await db.insert(users).values({ id, role: "teacher", name, email: normalized, passwordHash: await hashPassword(password) });
  return id;
}

export async function createStudent(name: string, username: string, password: string) {
  const normalized = username.trim().toLowerCase();
  if (await db.select({ id: users.id }).from(users).where(eq(users.username, normalized)).get()) return null;
  const id = newId();
  await db.insert(users).values({ id, role: "student", name, username: normalized, passwordHash: await hashPassword(password) });
  return id;
}

/** The user id if the login (email for teachers, username for students) and password match. */
export async function checkLogin(role: "teacher" | "student", login: string, password: string) {
  const key = login.trim().toLowerCase();
  const user = await db
    .select({ id: users.id, role: users.role, hash: users.passwordHash })
    .from(users)
    .where(role === "teacher" ? eq(users.email, key) : eq(users.username, key))
    .get();
  const ok = await verifyPassword(password, user?.hash ?? (await DUMMY));
  return ok && user && user.role === role ? user.id : null;
}

/** Is there an account with this login (email for teachers, username for students)? */
export async function accountExists(role: "teacher" | "student", login: string) {
  const key = login.trim().toLowerCase();
  const user = await db
    .select({ role: users.role })
    .from(users)
    .where(role === "teacher" ? eq(users.email, key) : eq(users.username, key))
    .get();
  return user?.role === role;
}
