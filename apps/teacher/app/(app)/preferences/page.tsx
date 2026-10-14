import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPrefs } from "@lemmory/db/report";
import { Logo } from "@lemmory/ui/Shell";
import { Panel } from "@lemmory/ui/ui";
import { requireTeacher } from "@/lib/session";
import { LogoutButton } from "../LogoutButton";
import { PreferencesForm } from "./PreferencesForm";

export const metadata = { title: "Preferences · Lemmory for teachers" };

export default async function PreferencesPage() {
  const me = await requireTeacher();
  const prefs = await getPrefs(me.id);
  return (
    <div className="min-h-screen bg-canvas">
      <header className="mx-auto flex max-w-2xl items-center justify-between px-5 py-6">
        <Logo tag="Teacher" />
        <LogoutButton />
      </header>
      <main className="mx-auto max-w-2xl px-5 pb-20">
        <Link href="/" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 hover:text-ink">
          <ArrowLeft size={15} /> Back to your classes
        </Link>
        <h1 className="text-[32px] font-extrabold">Preferences</h1>
        <Panel className="mt-6 p-6">
          <h2 className="text-[15px] font-bold">Email</h2>
          <p className="mb-4 mt-0.5 text-sm text-ink/55">
            Sent to <span className="font-semibold text-ink">{me.email}</span>.
          </p>
          <PreferencesForm weeklyReport={prefs.weeklyReport} />
        </Panel>
      </main>
    </div>
  );
}
