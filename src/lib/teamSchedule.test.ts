import { afterEach, describe, expect, it, vi } from "vitest";
import {
  dateKey,
  fetchTeamSchedule,
  isOffShift,
  parseScheduleDate,
  parseTeamScheduleCsv,
  scheduleTodayKey,
  shiftHours,
  startOfWeek,
} from "./teamSchedule";
import { onRequestGet } from "../../functions/api/team-schedule";

afterEach(() => vi.unstubAllGlobals());

const sampleCsv = [
  'Team Georgina,,"Aug 17, 2026","Aug 18, 2026","Aug 19, 2026","Aug 20, 2026","Aug 21, 2026","Aug 22, 2026","Aug 23, 2026","Aug 24, 2026","Aug 25, 2026","Aug 26, 2026","Aug 27, 2026","Aug 28, 2026","Aug 29, 2026","Aug 30, 2026"',
  "CSR - OHA,Priority Skill,Mon,Tue,Wed,Thu,Fri,Sat,Sun,Mon,Tue,Wed,Thu,Fri,Sat,Sun",
  "Alona Grace Jose,FB Chat+Comment Reply,5AM - 2PM,5AM - 2PM,5AM - 2PM,5AM - 2PM,5AM - 2PM,OFF,OFF,OFF,5AM - 2PM,5AM - 2PM,5AM - 2PM,5AM - 2PM,OFF,OFF",
  "Ava Sue Reyes,FB Moderator and Chat+Comment Reply,1PM - 10PM,1PM - 10PM,LWOP,1PM - 10PM,1PM - 10PM,OFF,OFF,1PM - 10PM,1PM - 10PM,1PM - 10PM,OFF,1PM - 10PM,OFF,OFF",
  "TOTAL CSRs ON DUTY,,2,2,1,2,2,0,0,1,2,2,1,2,0,0",
  "",
  "CSR - OTHER BRANDS,Priority Skill,Mon,Tue,Wed,Thu,Fri,Sat,Sun",
  "Rande Delima,FB Moderator and Chat+Comment Reply,10PM - 7AM,10PM - 7AM,10PM - 7AM,10PM - 7AM,10PM - 7AM,OFF,OFF,OFF,10PM - 7AM,10PM - 7AM,10PM - 7AM,10PM - 7AM,OFF,OFF",
].join("\n");

describe("team schedule parsing", () => {
  it("does not double-count copied date columns", () => {
    const csv = 'Team,,"Sep 14, 2026","Sep 14, 2026"\nCSR - OHA,Skill,Mon,Mon\nAgent,Chat,5AM - 2PM,1PM - 10PM';
    const schedule = parseTeamScheduleCsv(csv, new Date("2026-09-14T12:00:00Z"));
    expect(schedule.days).toHaveLength(1);
    expect(schedule.members[0].scheduledHours).toBe(8);
    expect(schedule.members[0].shifts).toEqual(["1PM - 10PM"]);
  });

  it("moves to the current California week without a saved selection", () => {
    expect(parseTeamScheduleCsv(sampleCsv, new Date("2026-08-24T06:59:00Z")).weekKey).toBe("2026-08-17");
    expect(parseTeamScheduleCsv(sampleCsv, new Date("2026-08-24T07:00:00Z")).weekKey).toBe("2026-08-24");
  });

  it("loads updated weeks from the live endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(sampleCsv));
    vi.stubGlobal("fetch", fetchMock);
    const schedule = await fetchTeamSchedule("2026-08-24");
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/api/team-schedule?"), expect.objectContaining({ cache: "no-store" }));
    expect(schedule.weekKey).toBe("2026-08-24");
    expect(schedule.members[0].scheduledHours).toBe(32);
  });

  it.each([new Response("denied", { status: 503 }), new Response("<html>Login</html>"), new Response("invalid,csv")])("reports failed refreshes instead of pretending old data is fresh", async (response) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));
    await expect(fetchTeamSchedule()).rejects.toThrow();
  });

  it("serves fresh CSV through Cloudflare without cache", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(sampleCsv)));
    const response = await onRequestGet({ env: {} });
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.text()).toBe(sampleCsv);
  });

  it("returns an unavailable status when the source denies access", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("denied", { status: 401 })));
    expect((await onRequestGet({ env: {} })).status).toBe(503);
  });
  it("parses the current Monday-Sunday week from the schedule sheet layout", () => {
    const schedule = parseTeamScheduleCsv(sampleCsv, new Date("2026-08-21T10:00:00Z"));

    expect(schedule.days.map((day) => day.weekday)).toEqual([
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ]);
    expect(schedule.members.map((member) => member.name)).toEqual([
      "Alona Grace Jose",
      "Ava Sue Reyes",
      "Rande Delima",
    ]);
    expect(schedule.members[0].group).toBe("OHA");
    expect(schedule.members[2].group).toBe("OTHER BRANDS");
    expect(schedule.members[0].scheduledHours).toBe(40);
    expect(schedule.members[1].scheduledDays).toBe(4);
    expect(schedule.weekKey).toBe("2026-08-17");
    expect(schedule.availableWeeks.map((week) => week.key)).toEqual(["2026-08-17", "2026-08-24"]);
    expect(schedule.coverageByDay[0]).toEqual([
      { label: "10PM - 7AM", count: 1 },
      { label: "1PM - 10PM", count: 1 },
      { label: "5AM - 2PM", count: 1 },
    ]);
  });

  it("can parse a selected week from the available schedule weeks", () => {
    const schedule = parseTeamScheduleCsv(
      sampleCsv,
      new Date("2026-08-21T10:00:00Z"),
      "2026-08-24"
    );

    expect(schedule.weekKey).toBe("2026-08-24");
    expect(schedule.days[0].label).toBe("Aug 24");
    expect(schedule.members[0].shifts[0]).toBe("OFF");
    expect(schedule.members[0].scheduledHours).toBe(32);
  });

  it("handles date and shift helpers used by the UI", () => {
    expect(dateKey(startOfWeek(new Date("2026-08-23T10:00:00Z")))).toBe("2026-08-17");
    expect(dateKey(startOfWeek(new Date("2026-08-24T06:30:00Z")))).toBe("2026-08-17");
    expect(scheduleTodayKey(new Date("2026-08-24T06:30:00Z"))).toBe("2026-08-23");
    expect(dateKey(parseScheduleDate("Aug 21, 2026")!)).toBe("2026-08-21");
    expect(shiftHours("10PM - 7AM")).toBe(8);
    expect(isOffShift("LWOP")).toBe(true);
    expect(isOffShift("HOLIDAY OFF")).toBe(true);
  });
});
