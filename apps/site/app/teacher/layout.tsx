import { AppShell } from "@/components/shell/AppShell";

export const metadata = { title: "Teacher demo · Lemmory" };

export default function TeacherLayout({ children }: LayoutProps<"/teacher">) {
  return <AppShell role="teacher">{children}</AppShell>;
}
