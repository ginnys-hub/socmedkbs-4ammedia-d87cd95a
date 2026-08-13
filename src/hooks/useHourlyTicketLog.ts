import { useQuery } from "@tanstack/react-query";
import { fetchTicketLog } from "@/lib/hourlyTicketLog";

// Matches the fastest recalculation granularity Google Sheets offers for the
// mirror's IMPORTRANGE formula ("On change and every minute" — set via the
// mirror sheet's File > Settings > Calculation). Polling faster than that
// wouldn't surface newer data, since the mirror itself isn't refreshing faster.
const REFRESH_INTERVAL_MS = 60 * 1000;

export const useHourlyTicketLog = () =>
  useQuery({
    queryKey: ["hourly-ticket-log"],
    queryFn: fetchTicketLog,
    refetchInterval: REFRESH_INTERVAL_MS,
    // Keep polling on a wallboard/background tab, not just while focused.
    refetchIntervalInBackground: true,
    staleTime: REFRESH_INTERVAL_MS,
  });
