"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** The class code plus a sign-up link students can open directly. */
export function JoinCode({ code, url }: { code: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const link = `${url}/join?code=${code}`;
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <div>
        <p className="text-xs font-semibold text-ink/50">Class code</p>
        <p className="font-mono text-3xl font-bold tracking-[0.2em]">{code}</p>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-ink/50">Or send this link</p>
        <div className="mt-1 flex items-center gap-2">
          <code className="min-w-0 flex-1 truncate rounded-lg bg-canvas px-2.5 py-1.5 text-sm">{link}</code>
          <button
            onClick={() => navigator.clipboard.writeText(link).then(() => setCopied(true))}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm font-semibold hover:border-ink/30"
          >
            {copied ? <Check size={14} className="text-good" /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
