import { describe, expect, it } from "vitest";
import {
  dateKey,
  isOffShift,
  parseScheduleDate,
  parseTeamScheduleCsv,
  scheduleTodayKey,
  shiftHours,
  startOfWeek,
} from "./teamSchedule";

const sampleCsv = [
  'Team Georgina,,"Aug 17, 2026","Aug 18, 2026","Aug 19, 2026","Aug 20, 2026","Aug 21, 2026","Aug 22, 2026","Aug 23, 2026"',
  "CSR - OHA,Priority Skill,Mon,Tue,Wed,Thu,Fri,Sat,Sun",
  "Alona Grace Jose,FB Chat+Comment Reply,5AM - 2PM,5AM - 2PM,5AM - 2PM,5AM - 2PM,5AM - 2PM,OFF,OFF",
  "Ava Sue Reyes,FB Moderator and Chat+Comment Reply,1PM - 10PM,1PM - 10PM,LWOP,1PM - 10PM,1PM - 10PM,OFF,OFF",
  "TOTAL CSRs ON DUTY,,2,2,1,2,2,0,0",
  "",
  "CSR - OTHER BRANDS,Priority Skill,Mon,Tue,Wed,Thu,Fri,Sat,Sun",
  "Rande Delima,FB Moderator and Chat+Comment Reply,10PM - 7AM,10PM - 7AM,10PM - 7AM,10PM - 7AM,10PM - 7AM,OFF,OFF",
].join("\n");

describe("team schedule parsing", () => {
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
    expect(schedule.coverageByDay[0]).toEqual([
      { label: "10PM - 7AM", count: 1 },
      { label: "1PM - 10PM", count: 1 },
      { label: "5AM - 2PM", count: 1 },
    ]);
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
