import { useMemo } from "react";
import { useHourlyTicketLog } from "@/hooks/useHourlyTicketLog";
import {
  computeForecast,
  computeHourlyStats,
  computeWeekdayHourHeatmap,
  formatDateLabel,
  formatHourLabel,
  HOURS_PER_DAY,
  SOURCE_SHEET_URL,
  type Heatmap,
} from "@/lib/hourlyTicketLog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  Clock,
  ExternalLink,
  Flame,
  Gauge,
  Grid3x3,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

// Fixed sequential ramp for the heatmap: one hue (matches --primary's 260°), light -> dark by value.
const heatmapFill = (t: number) => `hsl(260 70% ${Math.round(92 - t * 60)}%)`;
const heatmapTextClass = (t: number) => (t > 0.55 ? "text-white" : "text-foreground");

const HourlyTracker = () => {
  const { data, isLoading, isError, error, dataUpdatedAt, isFetching } = useHourlyTicketLog();

  const stats = useMemo(() => (data ? computeHourlyStats(data) : null), [data]);
  const forecast = useMemo(() => (stats ? computeForecast(stats) : null), [stats]);
  const heatmap = useMemo(() => (data ? computeWeekdayHourHeatmap(data) : null), [data]);

  const chartData = useMemo(() => {
    if (!stats || !forecast) return [];
    return stats.today.map((count, hour) => {
      const min = stats.historicalMin[hour];
      const max = stats.historicalMax[hour];
      const bandLow = min ?? stats.historicalAverage[hour];
      const bandHigh = max ?? stats.historicalAverage[hour];
      return {
        hour,
        label: formatHourLabel(hour),
        todayActual: count,
        forecastContinuation:
          stats.latestHour !== null && hour >= stats.latestHour ? forecast.byHour[hour] : null,
        avg: stats.historicalAverage[hour],
        bandLow,
        bandDelta: bandLow !== null && bandHigh !== null ? Math.max(0, bandHigh - bandLow) : null,
      };
    });
  }, [stats, forecast]);

  const deltaPct = useMemo(() => {
    if (!stats || stats.latestHour === null || stats.latestCount === null) return null;
    const avg = stats.historicalAverage[stats.latestHour];
    if (avg === null || avg === 0) return null;
    return ((stats.latestCount - avg) / avg) * 100;
  }, [stats]);

  const peakHours = useMemo(() => {
    if (!stats) return null;
    const todayPeak = stats.today.reduce<{ hour: number; value: number } | null>(
      (best, v, hour) => (v !== null && (best === null || v > best.value) ? { hour, value: v } : best),
      null
    );
    const typicalPeak = stats.historicalAverage.reduce<{ hour: number; value: number } | null>(
      (best, v, hour) => (v !== null && (best === null || v > best.value) ? { hour, value: v } : best),
      null
    );
    return { todayPeak, typicalPeak };
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
                Live open-ticket volume, forecasted and correlated against the typical pattern
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
      ) : isError || !stats || !forecast || !heatmap || !stats.todayDate ? (
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Open tickets now"
              value={stats.latestCount !== null ? String(stats.latestCount) : "—"}
              sub={stats.latestHour !== null ? `as of ${formatHourLabel(stats.latestHour)}` : ""}
              tone="primary"
              icon={Clock}
              trend={stats.today}
            />
            <StatCard
              label="Projected by end of day"
              value={forecast.projectedTotal !== null ? String(Math.round(forecast.projectedTotal)) : "—"}
              sub={
                forecast.paceRatio !== null
                  ? `${forecast.paceRatio > 1 ? "+" : ""}${Math.round((forecast.paceRatio - 1) * 100)}% vs. typical pace`
                  : "at today's pace"
              }
              tone={deltaPct !== null && deltaPct > 20 ? "bubblegum" : deltaPct !== null && deltaPct < -20 ? "sky" : "mint"}
              icon={TrendingUp}
            />
            <MeterCard correlation={stats.correlation} />
            <StatCard
              label="Today's peak hour"
              value={peakHours?.todayPeak ? formatHourLabel(peakHours.todayPeak.hour) : "—"}
              sub={
                peakHours?.typicalPeak
                  ? `typical peak: ${formatHourLabel(peakHours.typicalPeak.hour)}`
                  : ""
              }
              tone="sky"
              icon={Flame}
            />
          </div>

          <ForecastChart data={chartData} />

          <WeekdayHeatmap heatmap={heatmap} />

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
  trend,
}: {
  label: string;
  value: string;
  sub: string;
  tone: keyof typeof toneMap;
  icon: typeof Clock;
  trend?: (number | null)[];
}) => {
  const sparkData = trend
    ?.map((v, hour) => ({ hour, v }))
    .filter((p): p is { hour: number; v: number } => p.v !== null);

  return (
    <div className={`rounded-3xl ${toneMap[tone]} p-5 shadow-soft animate-scale-in hover-lift`}>
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="mt-1 text-3xl font-extrabold">{value}</p>
      {sub && <p className="text-sm opacity-80">{sub}</p>}
      {sparkData && sparkData.length > 1 && (
        <div className="mt-2 h-8 w-full opacity-90">
          <ResponsiveContainer>
            <ComposedChart data={sparkData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke="currentColor"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

const MeterCard = ({ correlation }: { correlation: number | null }) => {
  const pct = correlation !== null ? Math.round(Math.max(0, correlation) * 100) : null;
  return (
    <div className="rounded-3xl bg-sky text-sky-foreground p-5 shadow-soft animate-scale-in hover-lift">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80">
        <Gauge className="h-4 w-4" />
        Pattern match today
      </div>
      <p className="mt-1 text-3xl font-extrabold">{pct !== null ? `${pct}%` : "—"}</p>
      <p className="text-sm opacity-80">correlation vs. typical curve</p>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-sky-foreground/15">
        <div
          className="h-full rounded-full bg-sky-foreground/70 transition-all"
          style={{ width: `${pct ?? 0}%` }}
        />
      </div>
    </div>
  );
};

const CustomChartTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0]?.payload as {
    todayActual: number | null;
    forecastContinuation: number | null;
    avg: number | null;
    bandLow: number | null;
    bandDelta: number | null;
  };

  return (
    <div className="rounded-xl border border-border bg-card p-3 text-sm shadow-soft">
      <p className="mb-1 font-bold">{label}</p>
      {row.todayActual !== null && (
        <p>
          <span className="font-semibold text-primary">{row.todayActual}</span> today
        </p>
      )}
      {row.todayActual === null && row.forecastContinuation !== null && (
        <p>
          <span className="font-semibold text-primary">{Math.round(row.forecastContinuation)}</span>{" "}
          forecast
        </p>
      )}
      {row.avg !== null && (
        <p className="text-muted-foreground">{row.avg.toFixed(1)} typical average</p>
      )}
      {row.bandLow !== null && row.bandDelta !== null && (
        <p className="text-muted-foreground">
          {row.bandLow.toFixed(0)}–{(row.bandLow + row.bandDelta).toFixed(0)} typical range
        </p>
      )}
    </div>
  );
};

const ForecastChart = ({
  data,
}: {
  data: Array<{
    hour: number;
    label: string;
    todayActual: number | null;
    forecastContinuation: number | null;
    avg: number | null;
    bandLow: number | null;
    bandDelta: number | null;
  }>;
}) => (
  <div className="rounded-3xl bg-card p-6 shadow-soft">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h3 className="font-bold">Today vs. typical, with a same-pace forecast</h3>
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <LegendKey swatch="line" color="hsl(var(--primary))" label="Today" />
        <LegendKey swatch="dashed" color="hsl(var(--primary))" label="Forecast" />
        <LegendKey swatch="dashed" color="hsl(var(--muted-foreground))" label="Typical average" />
        <LegendKey swatch="box" color="hsl(var(--muted-foreground) / 0.25)" label="Typical range" />
      </div>
    </div>
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <ComposedChart data={data}>
          <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" interval={1} />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip content={<CustomChartTooltip />} />
          <Area
            dataKey="bandLow"
            stackId="range"
            stroke="none"
            fill="transparent"
            isAnimationActive={false}
          />
          <Area
            dataKey="bandDelta"
            stackId="range"
            stroke="none"
            fill="hsl(var(--muted-foreground))"
            fillOpacity={0.15}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="avg"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="forecastContinuation"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            strokeDasharray="3 5"
            strokeOpacity={0.6}
            dot={false}
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="todayActual"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="hsl(var(--primary))"
            fillOpacity={0.12}
            dot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--card))" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const LegendKey = ({
  swatch,
  color,
  label,
}: {
  swatch: "line" | "dashed" | "box";
  color: string;
  label: string;
}) => (
  <span className="flex items-center gap-1.5">
    {swatch === "box" ? (
      <span className="h-2.5 w-4 rounded-sm" style={{ background: color }} />
    ) : (
      <svg width="16" height="8" aria-hidden="true">
        <line
          x1="0"
          y1="4"
          x2="16"
          y2="4"
          stroke={color}
          strokeWidth={2}
          strokeDasharray={swatch === "dashed" ? "3 3" : undefined}
        />
      </svg>
    )}
    {label}
  </span>
);

const WeekdayHeatmap = ({ heatmap }: { heatmap: Heatmap }) => {
  const allValues = heatmap.values.flat().filter((v): v is number => v !== null);
  const min = allValues.length > 0 ? Math.min(...allValues) : 0;
  const max = allValues.length > 0 ? Math.max(...allValues) : 1;
  const range = max - min || 1;

  return (
    <div className="rounded-3xl bg-card p-6 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-bold">
          <Grid3x3 className="h-4 w-4 text-primary" />
          Typical volume by hour block &amp; weekday
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          Fewer
          <span
            className="h-2.5 w-16 rounded-full"
            style={{ background: `linear-gradient(90deg, ${heatmapFill(0)}, ${heatmapFill(1)})` }}
          />
          More
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-separate border-spacing-1 text-sm">
          <thead>
            <tr>
              <th className="w-24" />
              {heatmap.colLabels.map((day) => (
                <th key={day} className="pb-1 text-xs font-semibold text-muted-foreground">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmap.rowLabels.map((rowLabel, rowIndex) => (
              <tr key={rowLabel}>
                <td className="whitespace-nowrap pr-2 text-xs font-semibold text-muted-foreground">
                  {rowLabel}
                </td>
                {heatmap.values[rowIndex].map((value, colIndex) => {
                  const t = value !== null ? (value - min) / range : 0;
                  return (
                    <td
                      key={colIndex}
                      title={value !== null ? `${value.toFixed(1)} avg open tickets` : "No data"}
                      className={`rounded-lg p-2 text-center text-xs font-semibold ${
                        value !== null ? heatmapTextClass(t) : "text-muted-foreground"
                      }`}
                      style={{ background: value !== null ? heatmapFill(t) : "hsl(var(--muted))" }}
                    >
                      {value !== null ? value.toFixed(0) : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

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
        {Array.from({ length: HOURS_PER_DAY }, (_, hour) => {
          const count = today[hour];
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
