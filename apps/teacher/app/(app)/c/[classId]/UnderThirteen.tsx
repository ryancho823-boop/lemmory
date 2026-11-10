import { SITE_URL } from "@lemmory/core/urls";

/** What a teacher needs to know about students under 13 (COPPA). Signup handles the parent step itself. */
export function UnderThirteen({ schoolApproved }: { schoolApproved: boolean }) {
  if (schoolApproved) return <>Your school approved this class, so students under 13 join with the code.</>;
  return (
    <>
      Students under 13 need a parent to sign online first. When they sign up, we email the parent for them. A school can approve a whole class
      instead with the{" "}
      <a href={`${SITE_URL}/privacy/school-form`} className="underline">
        school form
      </a>
      .
    </>
  );
}
