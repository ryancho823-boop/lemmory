import { STUDENT_URL, TEACHER_URL } from "@lemmory/core/urls";

export { STUDENT_URL, TEACHER_URL };
export const SIGNUP_URL = `${TEACHER_URL}/signup`;
/** Student sign-up without a class code, for the individual plan. */
export const INDIVIDUAL_SIGNUP_URL = `${STUDENT_URL}/join?own=1`;
