import { TEAM_MEMBERS, type TeamMember } from "./team";

export type ScorecardEntry = {
  member: TeamMember;
  hoursWorked: number;
  hoursScheduled: number;
  qaScore: number;
  qaMax: number;
  ticketTarget: number;
  ticketActual: number;
  workEthicScore: number;
  workEthicMax: number;
  infractions: number;
  overallPct: number; // pre-computed final overall %
};

export type WeekScorecard = {
  weekOf: string; // ISO Monday date
  label: string;
  entries: ScorecardEntry[];
};

export const SCORECARDS: WeekScorecard[] = [
  {
    weekOf: "2026-04-20",
    label: "Apr 20 – Apr 26, 2026",
    entries: [
      { member: "Alona Jose",        hoursWorked: 42.37, hoursScheduled: 32, qaScore: 25, qaMax: 40, ticketTarget: 424, ticketActual: 745, workEthicScore: 10, workEthicMax: 10, infractions: 0, overallPct: 94.98 },
      { member: "Ava Sue Reyes",     hoursWorked: 44,    hoursScheduled: 40, qaScore: 40, qaMax: 40, ticketTarget: 440, ticketActual: 511, workEthicScore: 10, workEthicMax: 10, infractions: 0, overallPct: 106.53 },
      { member: "Jayson Aparece",    hoursWorked: 49,    hoursScheduled: 40, qaScore: 40, qaMax: 40, ticketTarget: 490, ticketActual: 625, workEthicScore: 10, workEthicMax: 10, infractions: 0, overallPct: 112.51 },
      { member: "Jessel Lebosada",   hoursWorked: 47,    hoursScheduled: 40, qaScore: 40, qaMax: 40, ticketTarget: 470, ticketActual: 586, workEthicScore: 10, workEthicMax: 10, infractions: 0, overallPct: 110.55 },
      { member: "Jezzalyn Tarranza", hoursWorked: 45.85, hoursScheduled: 40, qaScore: 40, qaMax: 40, ticketTarget: 459, ticketActual: 597, workEthicScore: 10, workEthicMax: 10, infractions: 0, overallPct: 111.21 },
      { member: "Karen Si",          hoursWorked: 23.54, hoursScheduled: 24, qaScore: 40, qaMax: 40, ticketTarget: 240, ticketActual: 212, workEthicScore: 10, workEthicMax: 10, infractions: 0, overallPct: 96.60 },
      { member: "Rande Delima",      hoursWorked: 40,    hoursScheduled: 40, qaScore: 40, qaMax: 40, ticketTarget: 400, ticketActual: 518, workEthicScore: 10, workEthicMax: 10, infractions: 0, overallPct: 107.38 },
    ],
  },
];

export const attendancePct = (e: ScorecardEntry) =>
  e.hoursScheduled > 0 ? (e.hoursWorked / e.hoursScheduled) * 100 : 0;

export const qualityPct = (e: ScorecardEntry) =>
  e.qaMax > 0 ? (e.qaScore / e.qaMax) * 100 : 0;

export const achievementPct = (e: ScorecardEntry) =>
  e.ticketTarget > 0 ? (e.ticketActual / e.ticketTarget) * 100 : 0;

export const workEthicPct = (e: ScorecardEntry) =>
  e.workEthicMax > 0 ? (e.workEthicScore / e.workEthicMax) * 100 : 0;

export const topPerformer = (week: WeekScorecard) => {
  const sorted = [...week.entries].sort((a, b) => b.overallPct - a.overallPct);
  return sorted[0];
};

export { TEAM_MEMBERS };
