// Where the real product lives. Locally the teacher site runs on :3002 and the student site on :3001.
export const TEACHER_URL = (process.env.NEXT_PUBLIC_TEACHER_URL ?? "http://localhost:3002").replace(/\/$/, "");
export const STUDENT_URL = (process.env.NEXT_PUBLIC_STUDENT_URL ?? "http://localhost:3001").replace(/\/$/, "");
export const SIGNUP_URL = `${TEACHER_URL}/signup`;
