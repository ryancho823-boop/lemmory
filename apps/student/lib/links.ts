// The teacher site, for the Teacher side of the sign-up switch. Locally it runs on :3002;
// online it defaults to the Vercel address in DEPLOY.md. Override with NEXT_PUBLIC_TEACHER_URL.
export const teacherUrl = (
  process.env.NEXT_PUBLIC_TEACHER_URL ?? (process.env.NODE_ENV === "development" ? "http://localhost:3002" : "https://lemmory-teacher.vercel.app")
).replace(/\/$/, "");
