"use client";

import { useRouter } from "next/navigation";
import { BarChart3, BookOpen, CreditCard, GraduationCap, LayoutDashboard, Settings, Trophy, Users } from "lucide-react";
import { Shell } from "@lemmory/ui/Shell";
import { logout } from "@/app/teach/actions";

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
  const base = `/teach/c/${classId}`;
  return (
    <Shell
      tag="Teacher"
      onLogout={logout}
      above={
        <select
          aria-label="Class"
          value={classId}
          onChange={(e) => router.push(e.target.value === "new" ? "/teach/new" : `/teach/c/${e.target.value}`)}
          className="h-10 w-full rounded-xl border border-line bg-white px-3 text-sm font-semibold outline-none focus:border-ink"
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
        { href: base, label: "Overview", icon: LayoutDashboard, exact: true },
        { href: `${base}/assign`, label: "Assign formulas", icon: BookOpen },
        { href: `${base}/formulas`, label: "Formula analytics", icon: BarChart3 },
        { href: `${base}/students`, label: "Students", icon: Users },
        { href: `${base}/leaderboard`, label: "Leaderboard", icon: Trophy },
        { href: `${base}/settings`, label: "Class settings", icon: Settings },
        { href: "/teach/plan", label: "Plan & billing", icon: CreditCard },
      ]}
      footer={
        <>
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-white">
            <GraduationCap size={16} />
          </span>
          <p className="min-w-0 truncate text-sm font-semibold" title={className}>
            {teacher}
          </p>
        </>
      }
    >
      {children}
    </Shell>
  );
}
