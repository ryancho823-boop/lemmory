import { AppShell } from "@/components/shell/AppShell";

export const metadata = { title: "Student demo · Lemmory" };

export default function StudentLayout({ children }: LayoutProps<"/student">) {
  return <AppShell role="student">{children}</AppShell>;
}
