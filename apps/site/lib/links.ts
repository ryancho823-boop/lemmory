import { STUDENT_URL, TEACHER_URL } from "@lemmory/core/urls";

export { STUDENT_URL, TEACHER_URL };
export const SIGNUP_URL = `${TEACHER_URL}/signup`;
/** Student sign-up without a class code, for the individual plan. */
export const INDIVIDUAL_SIGNUP_URL = `${STUDENT_URL}/join?own=1`;
/** Where questions, privacy requests and deletion requests go. Shown in the footer and the policies. */
export const CONTACT_EMAIL = "ryancho823@gmail.com";
