import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TopBar } from "@lemmory/ui/Shell";
import { cx } from "@lemmory/ui/ui";
import { LogoutButton } from "./LogoutButton";

const TABS = [
  { href: "/plan", label: "Plan & billing" },
  { href: "/account", label: "Account" },
];

/** Plan & billing and Account: one yellow header with a tab for each, so it's clear where you are. */
export function SettingsFrame({
  active,
  title,
  sub,
  back,
  children,
}: {
  active: string;
  title: string;
  sub?: string;
  /** The link back to the classes; left out while the classes are locked. */
  back?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="product min-h-screen bg-canvas">
      <TopBar tag="Teacher" width="max-w-4xl">
        <LogoutButton />
      </TopBar>
      <div className="border-b-2 border-ink bg-lemon">
        <div className="mx-auto max-w-4xl px-5 pt-7">
          {back && (
            <Link href="/" className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">
              <ArrowLeft size={15} /> {back}
            </Link>
          )}
          <h1 className="text-[32px] font-extrabold leading-tight">{title}</h1>
          {sub && <p className="mt-1 max-w-2xl">{sub}</p>}
          <nav aria-label="Settings" className="-mb-0.5 mt-6 flex gap-1">
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                aria-current={t.href === active ? "page" : undefined}
                className={cx(
                  "rounded-t-lg border-2 px-4 py-2 text-[15px] font-semibold",
                  t.href === active ? "border-ink border-b-canvas bg-canvas" : "border-transparent hover:bg-ink/10",
                )}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <main className="mx-auto max-w-4xl px-5 pb-20 pt-8">{children}</main>
    </div>
  );
}
