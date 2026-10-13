"use client";

import { BarChart3, Flame, Layers, LayoutDashboard, Library, Trophy, Users, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Shell } from "@lemmory/ui/Shell";
import { Avatar, cx } from "@lemmory/ui/ui";
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
            className="h-10 w-full rounded-xl border border-line bg-white px-3 text-sm font-semibold outline-none focus:border-ink"
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
        { href: "/", label: "Home", icon: LayoutDashboard, exact: true, also: ["/review"], dot: !doneToday },
        { href: "/deck", label: "My deck", icon: Layers },
        { href: "/practice", label: "Practice all", icon: Zap },
        { href: "/bank", label: "Formula bank", icon: Library },
        { href: "/stats", label: "My stats", icon: BarChart3 },
        { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
        { href: "/class", label: classes.length > 1 ? "My classes" : "My class", icon: Users },
      ]}
      footer={
        <>
          <Avatar name={name} you />
          <p className="min-w-0 flex-1 truncate text-sm font-semibold" title={current?.name}>
            {name}
          </p>
          <span className={cx("flex items-center gap-1 text-sm font-bold", streak ? "text-ink" : "text-ink/35")} title={`${streak}-day streak`}>
            <Flame size={16} className={streak ? "fill-lemon-deep text-lemon-deep" : ""} />
            {streak}
          </span>
        </>
      }
    >
      {children}
    </Shell>
  );
}
