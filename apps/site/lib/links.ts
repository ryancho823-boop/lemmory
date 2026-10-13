// Where Sign up / Log in go. When the app is online, set NEXT_PUBLIC_APP_URL (e.g.
// https://app.lemmory.com) and the buttons go straight to it. Until then, a live site
// sends people to /get-started, a sign-up form Netlify collects. In development the
// app runs on :3001.
const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
export const APP_URL = configured ?? (process.env.NODE_ENV === "development" ? "http://localhost:3001" : null);

export const SIGNUP_URL = APP_URL ? `${APP_URL}/signup` : "/get-started";
export const LOGIN_URL = APP_URL ? `${APP_URL}/login` : "/get-started";
export const JOIN_URL = APP_URL ? `${APP_URL}/join` : "/get-started?as=student";
