// Where the real product (the student and teacher app) lives. Set NEXT_PUBLIC_APP_URL when
// deploying; locally the app runs on :3001.
export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001").replace(/\/$/, "");
export const SIGNUP_URL = `${APP_URL}/signup`;
export const LOGIN_URL = `${APP_URL}/login`;
export const JOIN_URL = `${APP_URL}/join`;
