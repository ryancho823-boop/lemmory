import { Suspense } from "react";
import { PILOT_DAYS } from "@/lib/pricing";
import { GetStartedForm } from "./GetStartedForm";

export const metadata = { title: "Get started · Lemmory" };

export default function GetStarted() {
  return (
    <section className="mx-auto max-w-xl px-5 py-16 sm:py-20">
      <h1 className="text-4xl font-extrabold">Get started with Lemmory</h1>
      <p className="mt-3 text-lg leading-relaxed text-ink/75">
        We&apos;re opening Lemmory to academies, school clubs, and students in small groups. Tell us about yourself and we&apos;ll
        email you an invite, with a free {PILOT_DAYS}-day pilot for teachers.
      </p>
      {/* The form reads ?as=student from the URL, which needs a Suspense boundary to prerender. */}
      <Suspense>
        <GetStartedForm />
      </Suspense>
    </section>
  );
}
