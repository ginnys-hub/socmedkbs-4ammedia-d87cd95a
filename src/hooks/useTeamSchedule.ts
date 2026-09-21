import { useQuery } from "@tanstack/react-query";
import { fallbackSchedule, fetchTeamSchedule } from "@/lib/teamSchedule";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export const useTeamSchedule = (weekKey?: string) =>
  useQuery({
    queryKey: ["team-schedule", weekKey],
    queryFn: () => fetchTeamSchedule(weekKey),
    initialData: () => fallbackSchedule(weekKey),
    initialDataUpdatedAt: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
    retry: 1,
    refetchInterval: REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: true,
    staleTime: REFRESH_INTERVAL_MS,
  });
