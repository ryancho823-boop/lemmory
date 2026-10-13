import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@lemmory/ui/Shell";
import { Panel } from "@lemmory/ui/ui";
import { getClasses, requirePlan } from "@/lib/session";
import { createClassAction } from "../../actions";
import { ClassForm } from "../ClassForm";
import { LogoutButton } from "../LogoutButton";

export const metadata = { title: "New class · Lemmory for teachers" };

export default async function NewClass() {
  await requirePlan();
  const classes = await getClasses();
  return (
    <div className="min-h-screen bg-canvas">
      <header className="mx-auto flex max-w-xl items-center justify-between px-5 py-6">
        <Logo tag="Teacher" />
        <LogoutButton />
      </header>
      <main className="mx-auto max-w-xl px-5 pb-20">
        {classes.length > 0 && (
          <Link href="/" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/45 hover:text-ink">
            <ArrowLeft size={15} /> Your classes
          </Link>
        )}
        <h1 className="text-[28px] font-extrabold tracking-tight">{classes.length ? "New class" : "Set up your first class"}</h1>
        <p className="mt-1 text-ink/60">Students join with a code you&apos;ll get next.</p>
        <Panel className="mt-6 p-6">
          <ClassForm action={createClassAction} submit="Create class" />
        </Panel>
      </main>
    </div>
  );
}
