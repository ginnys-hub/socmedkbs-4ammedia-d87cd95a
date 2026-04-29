export type Announcement = {
  id: string;
  date: string; // ISO
  title: string;
  body: string;
};

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "2026-04-28-tagging",
    date: "2026-04-28",
    title: "Manual Tagging on Zendesk",
    body: "Team for SocMed Tickets, you can manually add tagging on Zendesk FB_Ticket so we can easily filter out which is which. Thank you!",
  },
  {
    id: "2026-04-28-update",
    date: "2026-04-28",
    title: "Latest Update on Zendesk Issues",
    body: `1. No more duplicate tickets.\n\n2. Ticket Auto-Solving process: If it's a chat ticket, place them on Pending instead of Solved. After 3 days of no response, safe to update the status to Solved.\n\n3. FB Macro not integrated: We will continue to use our macros but every ZD Ticket for Social Media should have FB_Tickets tagging.\n\n4. No more additional ZD tickets for replying directly on Meta Business Suite.`,
  },
  {
    id: "2026-04-27-issues",
    date: "2026-04-27",
    title: "Ongoing Zendesk Issues — In Progress",
    body: `We are currently working on the following issues to get fixed:\n\n1. Duplicate Ticket Creation from FB Post Comments\n2. Tickets Auto-Solving / Unable to Reply in ZD\n3. FB Macro Not Integrated in ZD / Tagging Confusion\n4. Replying Directly on FB Meta Page Creates Additional ZD Tickets\n\nHopefully these issues get fixed by tomorrow so we can operate BAU. Thank you for your patience. Any observations aside from these 4 are welcome — please message me if you see anything unusual so we can get it fixed. Thanks again, team!`,
  },
];
