"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Shell } from "@lemmory/ui/Shell";
import { logout, switchClass } from "../actions";

export function StudentShell({
  name,
  classId,
  classes,
  streak,
  doneToday,
  children,
}: {
  name: string;
  classId: string | null;
  classes: { id: string; name: string }[];
  streak: number;
  doneToday: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const current = classes.find((c) => c.id === classId);
  return (
    <Shell
      tag="Student"
      onLogout={logout}
      above={
        classes.length > 0 && (
          <select
            aria-label="Class"
            value={classId ?? ""}
            disabled={pending}
            onChange={(e) => (e.target.value === "join" ? router.push("/class") : start(() => switchClass(e.target.value)))}
            className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm font-semibold outline-none focus:border-ink"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
            <option value="join">+ Join another class</option>
          </select>
        )
      }
      nav={[
        { href: "/", label: "Home", exact: true, also: ["/review"], dot: !doneToday },
        { href: "/deck", label: "My deck" },
        { href: "/practice", label: "Practice all" },
        { href: "/bank", label: "Formula bank" },
        { href: "/stats", label: "My stats" },
        { href: "/leaderboard", label: "Leaderboard" },
        { href: "/class", label: classes.length > 1 ? "My classes" : classes.length ? "My class" : "Plan & classes" },
      ]}
      footer={
        <>
          <p className="truncate font-semibold" title={current?.name}>
            {name}
          </p>
          <p className="text-ink/55">{streak ? `${streak}-day streak` : "No streak yet"}</p>
        </>
      }
    >
      {children}
    </Shell>
  );
}
