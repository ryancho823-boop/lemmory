"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { dayInZone } from "@lemmory/core/days";

/**
 * A page left open past midnight (in the student's time zone) reloads its data, so today's cards
 * and streak move on to the new day without a manual refresh. Checked every minute and whenever
 * the tab comes back into view.
 */
export function DayWatcher({ today, zone }: { today: number; zone: string }) {
  const router = useRouter();
  useEffect(() => {
    const check = () => {
      if (dayInZone(zone) !== today) router.refresh();
    };
    const id = setInterval(check, 60_000);
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, [today, zone, router]);
  return null;
}
