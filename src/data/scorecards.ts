import { TEAM_MEMBERS, type TeamMember } from "./team";

export type ScorecardEntry = {
  member: TeamMember;
  qa: number;        // QA score 0-100
  csat: number;      // CSAT 0-100
  tickets: number;   // tickets handled
  responseTime: number; // avg response time minutes (lower better)
};

export type WeekScorecard = {
  weekOf: string; // ISO Monday date
  label: string;
  entries: ScorecardEntry[];
};

// Helper deterministic-ish data
const mk = (
  weekOf: string,
  label: string,
  rows: Array<[TeamMember, number, number, number, number]>
): WeekScorecard => ({
  weekOf,
  label,
  entries: rows.map(([member, qa, csat, tickets, responseTime]) => ({
    member,
    qa,
    csat,
    tickets,
    responseTime,
  })),
});

export const SCORECARDS: WeekScorecard[] = [
  mk("2026-04-27", "Apr 27 – May 3, 2026", [
    ["Aira", 98, 96, 142, 4.2],
    ["Bea", 95, 94, 138, 4.8],
    ["Carlo", 92, 91, 130, 5.1],
    ["Dani", 96, 95, 145, 4.5],
    ["Erika", 94, 93, 128, 5.0],
    ["Jomar", 90, 89, 120, 5.6],
    ["Krisha", 93, 92, 134, 4.9],
    ["Marvin", 91, 90, 125, 5.3],
  ]),
  mk("2026-04-20", "Apr 20 – Apr 26, 2026", [
    ["Aira", 96, 94, 138, 4.4],
    ["Bea", 97, 95, 144, 4.5],
    ["Carlo", 90, 89, 122, 5.4],
    ["Dani", 94, 93, 140, 4.7],
    ["Erika", 95, 94, 132, 4.8],
    ["Jomar", 88, 87, 115, 5.9],
    ["Krisha", 91, 90, 128, 5.2],
    ["Marvin", 92, 91, 124, 5.4],
  ]),
  mk("2026-04-13", "Apr 13 – Apr 19, 2026", [
    ["Aira", 94, 93, 130, 4.6],
    ["Bea", 93, 92, 132, 4.9],
    ["Carlo", 89, 88, 118, 5.5],
    ["Dani", 95, 94, 142, 4.6],
    ["Erika", 92, 91, 126, 5.1],
    ["Jomar", 87, 86, 110, 6.0],
    ["Krisha", 90, 89, 124, 5.4],
    ["Marvin", 90, 89, 122, 5.5],
  ]),
  mk("2026-04-06", "Apr 6 – Apr 12, 2026", [
    ["Aira", 93, 92, 128, 4.7],
    ["Bea", 92, 91, 130, 5.0],
    ["Carlo", 88, 87, 116, 5.6],
    ["Dani", 93, 92, 138, 4.8],
    ["Erika", 91, 90, 124, 5.2],
    ["Jomar", 86, 85, 108, 6.2],
    ["Krisha", 89, 88, 122, 5.5],
    ["Marvin", 89, 88, 120, 5.6],
  ]),
];

export const composite = (e: ScorecardEntry) =>
  Math.round((e.qa * 0.5 + e.csat * 0.5) * 10) / 10;

export const topPerformer = (week: WeekScorecard) => {
  const sorted = [...week.entries].sort(
    (a, b) => composite(b) - composite(a)
  );
  return sorted[0];
};

export { TEAM_MEMBERS };
