import { useQuery } from "@tanstack/react-query";
import { fetchTicketLog } from "@/lib/hourlyTicketLog";

const REFRESH_INTERVAL_MS = 3 * 60 * 1000;

export const useHourlyTicketLog = () =>
  useQuery({
    queryKey: ["hourly-ticket-log"],
    queryFn: fetchTicketLog,
    refetchInterval: REFRESH_INTERVAL_MS,
    staleTime: REFRESH_INTERVAL_MS,
  });
