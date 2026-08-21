import { useQuery } from "@tanstack/react-query";
import { fetchTeamSchedule } from "@/lib/teamSchedule";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export const useTeamSchedule = () =>
  useQuery({
    queryKey: ["team-schedule"],
    queryFn: fetchTeamSchedule,
    refetchInterval: REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: true,
    staleTime: REFRESH_INTERVAL_MS,
  });
