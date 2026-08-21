import { parseCsv } from "@/lib/hourlyTicketLog";

export const SCHEDULE_CSV_URL = import.meta.env.VITE_SCHEDULE_CSV_URL ?? "";

export type ScheduleDay = {
  date: Date;
  key: string;
  weekday: string;
  label: string;
};

export type TeamScheduleMember = {
  name: string;
  group: string;
  skill: string;
  shifts: string[];
  scheduledDays: number;
  scheduledHours: number;
};

export type CoverageBucket = {
  label: string;
  count: number;
};

export type ScheduleWeek = {
  key: string;
  label: string;
  startLabel: string;
  endLabel: string;
};

export type TeamScheduleData = {
  weekKey: string;
  weekStart: Date;
  weekEnd: Date;
  availableWeeks: ScheduleWeek[];
  days: ScheduleDay[];
  members: TeamScheduleMember[];
  coverageByDay: CoverageBucket[][];
  generatedAt: Date;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const SCHEDULE_TIME_ZONE = "America/Los_Angeles";
const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const scheduleDateParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SCHEDULE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
  };
};

export const dateKey = (date: Date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;

export const scheduleTodayKey = (date: Date = new Date()) => {
  const { year, month, day } = scheduleDateParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

export const startOfWeek = (date: Date) => {
  const { year, month, day: dateOfMonth } = scheduleDateParts(date);
  const utc = new Date(Date.UTC(year, month - 1, dateOfMonth));
  const day = utc.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  return new Date(utc.getTime() + mondayOffset * MS_PER_DAY);
};

const startOfWeekUtc = (date: Date) => {
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = utc.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  return new Date(utc.getTime() + mondayOffset * MS_PER_DAY);
};

const addDays = (date: Date, days: number) => new Date(date.getTime() + days * MS_PER_DAY);

export const formatScheduleDate = (date: Date) =>
  `${MONTH[date.getUTCMonth()]} ${date.getUTCDate()}`;

export const parseScheduleDate = (raw: string): Date | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/^([A-Za-z]{3,9})\s+(\d{1,2}),\s*(\d{4})$/);
  if (!match) return null;
  const [, monthName, day, year] = match;
  const month = MONTH.findIndex((m) => m.toLowerCase() === monthName.slice(0, 3).toLowerCase());
  if (month === -1) return null;
  const date = new Date(Date.UTC(Number(year), month, Number(day)));
  return Number.isNaN(date.getTime()) ? null : date;
};

const normalizeShift = (shift: string) =>
  shift
    .replace(/\s+/g, " ")
    .replace(/\s*-\s*/g, " - ")
    .trim();

export const isOffShift = (shift: string) => {
  const upper = shift.toUpperCase();
  return !shift.trim() || upper === "OFF" || upper === "LWOP" || upper.includes("HOLIDAY OFF");
};

const parseTime = (raw: string) => {
  const match = raw.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;
  const [, hourRaw, minuteRaw, periodRaw] = match;
  const period = periodRaw.toUpperCase();
  let hour = Number(hourRaw) % 12;
  if (period === "PM") hour += 12;
  return hour + Number(minuteRaw ?? 0) / 60;
};

export const shiftHours = (shift: string) => {
  if (isOffShift(shift)) return 0;
  const parts = normalizeShift(shift).split(" - ");
  if (parts.length !== 2) return 0;
  const start = parseTime(parts[0]);
  const end = parseTime(parts[1]);
  if (start === null || end === null) return 0;
  const duration = end > start ? end - start : end + 24 - start;
  const unpaidBreakHours = duration > 5 ? 1 : 0;
  return Math.max(0, duration - unpaidBreakHours);
};

const isMemberRow = (row: string[]) => {
  const name = (row[0] ?? "").trim();
  const skill = (row[1] ?? "").trim();
  if (!name || !skill) return false;
  if (name.toUpperCase().startsWith("CSR")) return false;
  if (name.toUpperCase().includes("TOTAL")) return false;
  if (/^\d/.test(name) || name.toUpperCase().includes("OFF")) return false;
  return true;
};

const parseDateKey = (key: string) => {
  const [year, month, day] = key.split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatWeekLabel = (weekStart: Date) => {
  const weekEnd = addDays(weekStart, 6);
  const startLabel = formatScheduleDate(weekStart);
  const endLabel = formatScheduleDate(weekEnd);
  return {
    key: dateKey(weekStart),
    label: `${startLabel} - ${endLabel}`,
    startLabel,
    endLabel,
  };
};

const getAvailableWeeks = (datedColumns: { date: Date; index: number }[]) => {
  const weekStarts = new Map<string, Date>();
  datedColumns.forEach(({ date }) => {
    const weekStart = startOfWeekUtc(date);
    weekStarts.set(dateKey(weekStart), weekStart);
  });
  return Array.from(weekStarts.values())
    .sort((a, b) => a.getTime() - b.getTime())
    .map(formatWeekLabel);
};

export const parseTeamScheduleCsv = (
  csvText: string,
  now: Date = new Date(),
  selectedWeekKey?: string
): TeamScheduleData => {
  const rows = parseCsv(csvText);
  const dateRow = rows[0] ?? [];
  const datedColumns = dateRow
    .map((cell, index) => ({ date: parseScheduleDate(cell), index }))
    .filter((item): item is { date: Date; index: number } => item.date !== null);

  const availableWeeks = getAvailableWeeks(datedColumns);
  const selectedWeekStart = selectedWeekKey ? parseDateKey(selectedWeekKey) : null;
  const weekStart = selectedWeekStart ?? startOfWeek(now);
  const weekEnd = addDays(weekStart, 6);
  let weekColumns = datedColumns.filter(
    ({ date }) => date.getTime() >= weekStart.getTime() && date.getTime() <= weekEnd.getTime()
  );

  if (weekColumns.length === 0) {
    const fallbackWeekStart = availableWeeks.length > 0
      ? parseDateKey(availableWeeks[availableWeeks.length - 1].key)
      : null;
    weekColumns = fallbackWeekStart
      ? datedColumns.filter(
        ({ date }) =>
          date.getTime() >= fallbackWeekStart.getTime() &&
          date.getTime() <= addDays(fallbackWeekStart, 6).getTime()
      )
      : datedColumns.slice(-7);
  }

  const days = weekColumns.map(({ date }) => ({
    date,
    key: dateKey(date),
    weekday: WEEKDAY[date.getUTCDay()],
    label: formatScheduleDate(date),
  }));

  let currentGroup = "Social Media";
  const members: TeamScheduleMember[] = [];

  rows.forEach((row) => {
    const firstCell = (row[0] ?? "").trim();
    if (firstCell.toUpperCase().startsWith("CSR")) {
      currentGroup = firstCell.replace(/^CSR\s*-\s*/i, "").trim();
      return;
    }

    if (!isMemberRow(row)) return;

    const shifts = weekColumns.map(({ index }) => normalizeShift(row[index] ?? ""));
    const scheduledDays = shifts.filter((shift) => !isOffShift(shift)).length;
    const scheduledHours = shifts.reduce((sum, shift) => sum + shiftHours(shift), 0);

    members.push({
      name: firstCell,
      group: currentGroup,
      skill: (row[1] ?? "").trim(),
      shifts,
      scheduledDays,
      scheduledHours,
    });
  });

  const coverageByDay = days.map((_, dayIndex) => {
    const counts = new Map<string, number>();
    members.forEach((member) => {
      const shift = member.shifts[dayIndex] ?? "";
      if (isOffShift(shift)) return;
      counts.set(shift, (counts.get(shift) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  return {
    weekKey: days[0] ? dateKey(startOfWeekUtc(days[0].date)) : dateKey(weekStart),
    weekStart: days[0]?.date ?? weekStart,
    weekEnd: days[days.length - 1]?.date ?? weekEnd,
    availableWeeks,
    days,
    members,
    coverageByDay,
    generatedAt: new Date(),
  };
};

const FALLBACK_SCHEDULE_CSV = [
  '"Team Georgina",,"Aug 17, 2026","Aug 18, 2026","Aug 19, 2026","Aug 20, 2026","Aug 21, 2026","Aug 22, 2026","Aug 23, 2026","Aug 24, 2026","Aug 25, 2026","Aug 26, 2026","Aug 27, 2026","Aug 28, 2026","Aug 29, 2026","Aug 30, 2026"',
  '"CSR - OHA","Priority Skill","Mon","Tue","Wed","Thu","Fri","Sat","Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun"',
  '"Alona Grace Jose","FB Chat+Comment Reply","5AM - 2PM","5AM - 2PM","5AM - 2PM","5AM - 2PM","5AM - 2PM","5AM - 2PM","OFF","5AM - 2PM","5AM - 2PM","5AM - 2PM","5AM - 2PM","5AM - 2PM","OFF","OFF"',
  '"Ava Sue Reyes","FB Moderator and Chat+Comment Reply","OFF","1PM - 10PM","1PM - 10PM","1PM - 10PM","1PM - 10PM","1PM - 10PM","1PM - 10PM","OFF","1PM - 10PM","1PM - 10PM","1PM - 10PM","1PM - 10PM","1PM - 10PM","OFF"',
  '"Jezzalyn Tarranza","FB Moderator","5AM - 2PM","5AM - 2PM","5AM - 2PM","5AM - 2PM","5AM - 2PM","OFF","5AM - 2PM","5AM - 2PM","5AM - 2PM","5AM - 2PM","OFF","OFF","5AM - 2PM","5AM - 2PM"',
  '"Jayson Aparece","FB Moderator and Chat+Comment Reply","1PM - 10PM","1PM - 10PM","1PM - 10PM","OFF","1PM - 10PM","1PM - 10PM","1PM - 10PM","1PM - 10PM","1PM - 10PM","OFF","OFF","1PM - 10PM","1PM - 10PM","1PM - 10PM"',
  '"TOTAL CSRs ON DUTY",,"3","4","3","3","4","3","3","3","4","3","3","3","3","3"',
  "",
  '"CSR - OTHER BRANDS","Priority Skill","Mon","Tue","Wed","Thu","Fri","Sat","Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun"',
  '"Jessel Lebosada","FB Moderator","1PM-10PM","1PM-10PM","1PM-10PM","1PM-10PM","1PM-10PM","1PM-10PM","OFF","1PM-10PM","1PM-10PM","1PM-10PM","1PM-10PM","1PM-10PM","OFF","OFF"',
  '"Rande Delima","FB Moderator and Chat+Comment Reply","2AM - 11AM","2AM - 11AM","OFF","2AM - 11AM","2AM - 11AM","2AM - 11AM","2AM - 11AM","2AM - 11AM","2AM - 11AM","OFF","OFF","2AM - 11AM","2AM - 11AM","2AM - 11AM"',
  '"TOTAL CSRs ON DUTY",,"5","6","3","5","2","2","1","5","6","4","4","5","3","2"',
].join("\n");

const fallbackSchedule = () =>
  parseTeamScheduleCsv(FALLBACK_SCHEDULE_CSV, new Date("2026-08-21T00:00:00Z"));

export const fetchTeamSchedule = async (selectedWeekKey?: string): Promise<TeamScheduleData> => {
  if (!SCHEDULE_CSV_URL) {
    return selectedWeekKey
      ? parseTeamScheduleCsv(FALLBACK_SCHEDULE_CSV, new Date(), selectedWeekKey)
      : fallbackSchedule();
  }

  try {
    const separator = SCHEDULE_CSV_URL.includes("?") ? "&" : "?";
    const response = await fetch(`${SCHEDULE_CSV_URL}${separator}cachebust=${Date.now()}`);
    if (!response.ok) {
      throw new Error(`Failed to load team schedule (HTTP ${response.status})`);
    }

    const csvText = await response.text();
    if (/<!doctype html|<html|ServiceLogin/i.test(csvText)) {
      throw new Error("Schedule load returned an unexpected response.");
    }

    return parseTeamScheduleCsv(csvText, new Date(), selectedWeekKey);
  } catch {
    return selectedWeekKey
      ? parseTeamScheduleCsv(FALLBACK_SCHEDULE_CSV, new Date(), selectedWeekKey)
      : fallbackSchedule();
  }
};
