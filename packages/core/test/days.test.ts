import { test } from "node:test";
import assert from "node:assert/strict";
import { dayInZone, isTimeZone, isoDate } from "../src/days";

test("today flips at local midnight", () => {
  const now = new Date("2026-03-10T06:30:00Z"); // 11:30pm the day before in Los Angeles
  assert.equal(isoDate(dayInZone("UTC", now)), "2026-03-10");
  assert.equal(isoDate(dayInZone("America/Los_Angeles", now)), "2026-03-09");
  assert.equal(isoDate(dayInZone("Asia/Seoul", now)), "2026-03-10");
});

test("time zone names are checked", () => {
  assert.ok(isTimeZone("America/New_York"));
  assert.ok(!isTimeZone("Not/AZone"));
});
