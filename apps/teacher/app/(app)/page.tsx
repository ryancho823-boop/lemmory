import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight, Plus } from "lucide-react";
import { Logo } from "@lemmory/ui/Shell";
import { Button, Panel } from "@lemmory/ui/ui";
import { getClasses, requirePlan } from "@/lib/session";
import { LogoutButton } from "./LogoutButton";

export default async function Classes() {
  // New teachers (and ones whose pilot ended) pick a plan first, then make their first class.
  const me = await requirePlan();
  const classes = await getClasses();
  if (classes.length === 0) redirect("/new");
  if (classes.length === 1) redirect(`/c/${classes[0].id}`);
  return (
    <div className="min-h-screen bg-canvas">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6">
        <Logo tag="Teacher" />
        <LogoutButton />
      </header>
      <main className="mx-auto max-w-3xl px-5 pb-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-ink/45">{me.name}</p>
            <h1 className="text-[28px] font-extrabold tracking-tight">Your classes</h1>
          </div>
          <Button href="/new">
            <Plus size={15} strokeWidth={3} /> New class
          </Button>
        </div>
        <Panel className="mt-6 divide-y divide-line overflow-hidden">
          {classes.map((c) => (
            <Link key={c.id} href={`/c/${c.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-canvas">
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{c.name}</span>
                <span className="text-sm text-ink/50">
                  {c.students} student{c.students === 1 ? "" : "s"}
                  {c.contestName && ` · ${c.contestName}`}
                </span>
              </span>
              <ChevronRight size={16} className="text-ink/30" />
            </Link>
          ))}
        </Panel>
      </main>
    </div>
  );
}
