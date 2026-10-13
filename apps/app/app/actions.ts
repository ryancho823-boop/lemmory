"use server";

import { redirect } from "next/navigation";
import { checkLogin } from "@lemmory/db/accounts";
import { startSession } from "@lemmory/db/auth";

export type LoginState = { error?: string; login?: string } | undefined;

/** One login form for everyone: teachers sign in with an email, students with a username. */
export async function login(_: LoginState, fd: FormData): Promise<LoginState> {
  const login = String(fd.get("login") ?? "").trim();
  const password = String(fd.get("password") ?? "");
  const role = login.includes("@") ? "teacher" : "student";
  const id = await checkLogin(role, login, password);
  if (!id) return { error: `That ${role === "teacher" ? "email" : "username"} and password don't match.`, login };
  await startSession(id, role);
  redirect(role === "teacher" ? "/teach" : "/learn");
}
