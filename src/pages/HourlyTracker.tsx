import { useMemo } from "react";
import { useHourlyTicketLog } from "@/hooks/useHourlyTicketLog";
import {
  computeHourlyStats,
  formatDateLabel,
  formatHourLabel,
  SOURCE_SHEET_URL,
} from "@/lib/hourlyTicketLog";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Clock, ExternalLink, Gauge, RefreshCw, TrendingUp } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const HourlyTracker = () => {
  const { data, isLoading, isError, error, dataUpdatedAt, isFetching } = useHourlyTicketLog();

  const stats = useMemo(() => (data ? computeHourlyStats(data) : null), [data]);

  const chartData = useMemo(() => {
    if (!stats) return [];
    return stats.today.map((count, hour) => ({
      hour,
      label: formatHourLabel(hour),
      today: count,
      average:
        stats.historicalAverage[hour] !== null
          ? Math.round((stats.historicalAverage[hour] as number) * 10) / 10
          : null,
    }));
  }, [stats]);

  const deltaPct = useMemo(() => {
    if (!stats || stats.latestHour === null || stats.latestCount === null) return null;
    const avg = stats.historicalAverage[stats.latestHour];
    if (avg === null || avg === 0) return null;
    return ((stats.latestCount - avg) / avg) * 100;
  }, [stats]);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-bubblegum p-6 sm:p-8 shadow-pop animate-scale-in">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 shadow-soft animate-float">
              <Gauge className="h-5 w-5 text-bubblegum-foreground" />
            </span>
            <div>
              <h1 className="text-3xl font-extrabold text-bubblegum-foreground animate-fade-in-down">
                Hourly Ticket Tracker
              </h1>
              <p className="text-sm text-bubblegum-foreground/80 animate-fade-in stagger-1">
                Live open-ticket volume, correlated against the typical pattern for this hour
              </p>
            </div>
          </div>
          <a
            href={SOURCE_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-bubblegum-foreground shadow-soft transition-transform hover:scale-105"
          >
            <ExternalLink className="h-4 w-4" />
            Source sheet
          </a>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 rounded-3xl" />
      ) : isError || !stats || !stats.todayDate ? (
        <div className="rounded-3xl bg-muted p-8 text-center text-muted-foreground">
          <AlertTriangle className="mx-auto mb-2 h-6 w-6" />
          Couldn't load the live tracker
          {error instanceof Error ? `: ${error.message}` : "."} Make sure the mirror sheet is
          shared as "Anyone with the link can view".
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            <span>
              Showing {formatDateLabel(stats.todayDate)} · last refreshed{" "}
              {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : "—"}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Open tickets (latest hour)"
              value={stats.latestCount !== null ? String(stats.latestCount) : "—"}
              sub={stats.latestHour !== null ? formatHourLabel(stats.latestHour) : ""}
              tone="primary"
              icon={Clock}
            />
            <StatCard
              label="Vs. typical for this hour"
              value={deltaPct !== null ? `${deltaPct > 0 ? "+" : ""}${deltaPct.toFixed(0)}%` : "—"}
              sub={`${stats.daysInAverage}-day average`}
              tone={deltaPct !== null && deltaPct > 20 ? "bubblegum" : deltaPct !== null && deltaPct < -20 ? "sky" : "mint"}
              icon={TrendingUp}
            />
            <StatCard
              label="Pattern match today"
              value={stats.correlation !== null ? `${Math.round(stats.correlation * 100)}%` : "—"}
              sub="correlation vs. typical curve"
              tone="sky"
              icon={Gauge}
            />
          </div>

          <div className="rounded-3xl bg-card p-6 shadow-soft">
            <h3 className="mb-4 font-bold">Today vs. {stats.daysInAverage}-day average, by hour</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer>
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" interval={1} />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="today" name="Today" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  <Line
                    type="monotone"
                    dataKey="average"
                    name="Typical"
                    stroke="hsl(var(--bubblegum))"
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <HourlyTable
            today={stats.today}
            average={stats.historicalAverage}
            latestHour={stats.latestHour}
          />
        </>
      )}
    </div>
  );
};

const toneMap = {
  primary: "bg-primary text-primary-foreground",
  mint: "bg-mint text-mint-foreground",
  bubblegum: "bg-bubblegum text-bubblegum-foreground",
  sky: "bg-sky text-sky-foreground",
} as const;

const StatCard = ({
  label,
  value,
  sub,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  tone: keyof typeof toneMap;
  icon: typeof Clock;
}) => (
  <div className={`rounded-3xl ${toneMap[tone]} p-5 shadow-soft animate-scale-in hover-lift`}>
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    <p className="mt-1 text-3xl font-extrabold">{value}</p>
    {sub && <p className="text-sm opacity-80">{sub}</p>}
  </div>
);

const HourlyTable = ({
  today,
  average,
  latestHour,
}: {
  today: (number | null)[];
  average: (number | null)[];
  latestHour: number | null;
}) => (
  <div className="overflow-x-auto rounded-3xl bg-card shadow-soft">
    <table className="w-full text-sm">
      <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
        <tr>
          <th className="p-3 text-left">Hour</th>
          <th className="p-3 text-right">Today</th>
          <th className="p-3 text-right">Typical</th>
          <th className="p-3 text-right">Diff</th>
        </tr>
      </thead>
      <tbody>
        {today.map((count, hour) => {
          const avg = average[hour];
          const diff = count !== null && avg !== null ? count - avg : null;
          return (
            <tr
              key={hour}
              className={`border-t border-border transition-colors hover:bg-muted/40 ${
                hour === latestHour ? "bg-primary/10 font-semibold" : ""
              }`}
            >
              <td className="p-3">{formatHourLabel(hour)}</td>
              <td className="p-3 text-right">{count ?? "—"}</td>
              <td className="p-3 text-right">{avg !== null ? avg.toFixed(1) : "—"}</td>
              <td
                className={`p-3 text-right ${
                  diff !== null && diff > 0
                    ? "text-bubblegum-foreground"
                    : diff !== null && diff < 0
                      ? "text-sky-foreground"
                      : ""
                }`}
              >
                {diff !== null ? `${diff > 0 ? "+" : ""}${diff.toFixed(1)}` : "—"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default HourlyTracker;
