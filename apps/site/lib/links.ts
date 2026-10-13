// Where the teacher and student sites live. Locally they run on :3002 and :3001. Online,
// they default to the Netlify addresses in DEPLOY.md; set NEXT_PUBLIC_TEACHER_URL and
// NEXT_PUBLIC_STUDENT_URL in Netlify to use different ones (say, your own domain).
const dev = process.env.NODE_ENV === "development";
const url = (value: string | undefined, local: string, live: string) => (value ?? (dev ? local : live)).replace(/\/$/, "");

export const TEACHER_URL = url(process.env.NEXT_PUBLIC_TEACHER_URL, "http://localhost:3002", "https://lemmory-teacher.netlify.app");
export const STUDENT_URL = url(process.env.NEXT_PUBLIC_STUDENT_URL, "http://localhost:3001", "https://lemmory-student.netlify.app");
export const SIGNUP_URL = `${TEACHER_URL}/signup`;
export const JOIN_URL = `${STUDENT_URL}/join`;
