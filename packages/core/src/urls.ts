// Where the student and teacher sites live. Locally they run on :3001 and :3002; online they
// default to the Vercel addresses in DEPLOY.md. Set NEXT_PUBLIC_STUDENT_URL and
// NEXT_PUBLIC_TEACHER_URL to use different ones (say, your own domain).

const dev = process.env.NODE_ENV === "development";
const url = (value: string | undefined, local: string, live: string) => (value ?? (dev ? local : live)).replace(/\/$/, "");

export const STUDENT_URL = url(process.env.NEXT_PUBLIC_STUDENT_URL, "http://localhost:3001", "https://lemmory-student.vercel.app");
export const TEACHER_URL = url(process.env.NEXT_PUBLIC_TEACHER_URL, "http://localhost:3002", "https://lemmory-teacher.vercel.app");
