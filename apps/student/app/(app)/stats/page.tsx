import { StudentAnalytics } from "@lemmory/ui/StudentAnalytics";
import { PageHeader } from "@lemmory/ui/ui";
import { getUnlockedView } from "@/lib/session";

export const metadata = { title: "My stats · Lemmory" };

export default async function StatsPage() {
  const v = await getUnlockedView();
  return (
    <div>
      <PageHeader title="My stats" info="Where you're strong, and what to fix before the contest." />
      <StudentAnalytics student={{ id: v.me.id, name: v.me.name, isYou: true, ...v.record }} today={v.today} formulaHref={(id) => `/bank/${id}`} />
    </div>
  );
}
