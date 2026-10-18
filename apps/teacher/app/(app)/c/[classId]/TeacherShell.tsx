"use client";

import { useRouter } from "next/navigation";
import { Shell } from "@lemmory/ui/Shell";
import { logout } from "../../../actions";

export function TeacherShell({
  classId,
  className,
  classes,
  teacher,
  children,
}: {
  classId: string;
  className: string;
  classes: { id: string; name: string }[];
  teacher: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const base = `/c/${classId}`;
  return (
    <Shell
      tag="Teacher"
      onLogout={logout}
      above={
        <select
          aria-label="Class"
          value={classId}
          onChange={(e) => router.push(e.target.value === "new" ? "/new" : `/c/${e.target.value}`)}
          className="h-9 w-full border border-ink/30 bg-white px-2 text-sm font-semibold outline-none focus:border-ink"
        >
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
          <option value="new">+ New class</option>
        </select>
      }
      nav={[
        { href: base, label: "Overview", exact: true },
        { href: `${base}/assign`, label: "Assign formulas" },
        { href: `${base}/formulas`, label: "Formula analytics" },
        { href: `${base}/students`, label: "Students" },
        { href: `${base}/leaderboard`, label: "Leaderboard" },
        { href: `${base}/settings`, label: "Class settings" },
        { href: "/plan", label: "Plan & billing" },
      ]}
      footer={
        <p className="truncate" title={className}>
          Signed in as <b>{teacher}</b>
        </p>
      }
    >
      {children}
    </Shell>
  );
}
