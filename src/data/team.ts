export const TEAM_MEMBERS = [
  "Alona Jose",
  "Ava Sue Reyes",
  "Jayson Aparece",
  "Jessel Lebosada",
  "Jezzalyn Tarranza",
  "Karen Si",
  "Rande Delima",
] as const;

export type TeamMember = typeof TEAM_MEMBERS[number];
