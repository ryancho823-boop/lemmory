"use client";

import { useEffect, useState } from "react";

/** The browser's time zone, sent with the form so "today" flips at the student's midnight. */
export function TimeZoneField() {
  const [tz, setTz] = useState("");
  // eslint-disable-next-line react-hooks/set-state-in-effect -- only the browser knows its time zone
  useEffect(() => setTz(Intl.DateTimeFormat().resolvedOptions().timeZone), []);
  return <input type="hidden" name="timezone" value={tz} />;
}
