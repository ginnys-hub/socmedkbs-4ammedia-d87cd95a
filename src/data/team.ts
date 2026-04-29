export const TEAM_MEMBERS = [
  "Aira",
  "Bea",
  "Carlo",
  "Dani",
  "Erika",
  "Jomar",
  "Krisha",
  "Marvin",
] as const;

export type TeamMember = typeof TEAM_MEMBERS[number];
