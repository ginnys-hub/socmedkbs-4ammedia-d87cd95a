import type { ScorecardEntry } from "@/hooks/useContent";

export const attendancePct = (e: ScorecardEntry) =>
  e.hours_scheduled > 0 ? (e.hours_worked / e.hours_scheduled) * 100 : 0;

export const qualityPct = (e: ScorecardEntry) =>
  e.qa_max > 0 ? (e.qa_score / e.qa_max) * 100 : 0;

export const achievementPct = (e: ScorecardEntry) =>
  e.ticket_target > 0 ? (e.ticket_actual / e.ticket_target) * 100 : 0;

export const workEthicPct = (e: ScorecardEntry) =>
  e.work_ethic_max > 0 ? (e.work_ethic_score / e.work_ethic_max) * 100 : 0;
