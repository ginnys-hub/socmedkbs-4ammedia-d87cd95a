import { useQuery } from "@tanstack/react-query";
import { fetchTicketLog } from "@/lib/hourlyTicketLog";

// The source mirror recalculates about once a minute. Checking twice a minute
// keeps the wallboard current without making a stale browser cache look live.
const REFRESH_INTERVAL_MS = 30 * 1000;

export const useHourlyTicketLog = () =>
  useQuery({
    queryKey: ["hourly-ticket-log"],
    queryFn: fetchTicketLog,
    refetchInterval: REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: true,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
    staleTime: 0,
    retry: 1,
  });
