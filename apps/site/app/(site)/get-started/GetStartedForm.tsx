"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { cx } from "@/components/ui";

const ROLES = [
  { value: "academy", label: "Academy" },
  { value: "club", label: "School math club" },
  { value: "student", label: "Student" },
  { value: "parent", label: "Parent" },
];

const input =
  "mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] outline-none focus:border-ink focus:shadow-[0_0_0_4px_rgb(255_212_59/0.35)]";

/**
 * Posts to Netlify Forms (see public/__forms.html). Submissions show up in the Netlify
 * dashboard under Forms. Locally there's no Netlify, so the form explains that instead.
 */
export function GetStartedForm() {
  const [role, setRole] = useState(useSearchParams().get("as") === "student" ? "student" : "academy");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "local">("idle");
  const teacher = role === "academy" || role === "club";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const body = new URLSearchParams(new FormData(e.currentTarget) as unknown as Record<string, string>).toString();
    try {
      const res = await fetch("/__forms.html", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
      if (res.ok) return setStatus("sent");
      setStatus(location.hostname === "localhost" ? "local" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent")
    return (
      <div className="mt-10 rounded-2xl border-2 border-lemon bg-white p-8 text-center">
        <CheckCircle2 size={44} className="mx-auto text-good" />
        <p className="mt-3 text-2xl font-extrabold">Thanks! You&apos;re on the list.</p>
        <p className="mt-1 text-ink/75">We&apos;ll email you an invite soon.</p>
      </div>
    );

  return (
    <form name="get-started" onSubmit={submit} className="mt-10 space-y-5 rounded-2xl border border-line bg-white p-6 sm:p-8">
      <input type="hidden" name="form-name" value="get-started" />
      {/* Spam trap: people never see or fill this in. */}
      <input name="company-website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <fieldset>
        <legend className="text-sm font-semibold">I&apos;m signing up as</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <label
              key={r.value}
              className={cx(
                "cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-semibold",
                role === r.value ? "border-ink bg-ink text-white" : "border-line hover:border-ink/30",
              )}
            >
              <input type="radio" name="role" value={r.value} checked={role === r.value} onChange={() => setRole(r.value)} className="sr-only" />
              {r.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="text-sm font-semibold">Your name</span>
        <input name="name" required autoComplete="name" className={input} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={input}
          placeholder={role === "club" ? "Your school email" : undefined}
        />
      </label>
      {teacher && (
        <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
          <label className="block">
            <span className="text-sm font-semibold">{role === "club" ? "School" : "Academy"}</span>
            <input name="organization" required className={input} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Students</span>
            <input name="students" inputMode="numeric" placeholder="About how many" className={input} />
          </label>
        </div>
      )}
      <label className="block">
        <span className="text-sm font-semibold">Anything else? (optional)</span>
        <textarea name="message" rows={3} className={cx(input, "h-auto py-2.5")} />
      </label>

      {status === "error" && <p className="text-sm font-semibold text-bad">Something went wrong. Please try again.</p>}
      {status === "local" && (
        <p className="text-sm font-semibold text-lemon-deep">This form only sends once the site is on Netlify. Nothing was sent locally.</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-ink px-6 font-semibold text-white hover:bg-ink/85 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Get started"}
      </button>
    </form>
  );
}
