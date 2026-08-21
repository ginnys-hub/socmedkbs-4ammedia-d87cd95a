import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Clock,
  ExternalLink,
  RefreshCw,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeamSchedule } from "@/hooks/useTeamSchedule";
import {
  SCHEDULE_SOURCE_SHEET_URL,
  dateKey,
  isOffShift,
  type TeamScheduleMember,
} from "@/lib/teamSchedule";
import { cn } from "@/lib/utils";

const todayKey = dateKey(new Date());

const formatHours = (value: number) =>
  Number(value).toLocaleString("en", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  });

const Schedule = () => {
  const { data, isLoading, isError, error, dataUpdatedAt, isFetching } = useTeamSchedule();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");

  const groups = useMemo(
    () => ["All", ...Array.from(new Set(data?.members.map((member) => member.group) ?? []))],
    [data]
  );

  const filteredMembers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data?.members ?? []).filter((member) => {
      if (group !== "All" && member.group !== group) return false;
      if (q && !`${member.name} ${member.skill} ${member.group}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [data, group, query]);

  const todayIndex = data?.days.findIndex((day) => day.key === todayKey) ?? -1;
  const todayMembers = todayIndex >= 0
    ? data?.members.filter((member) => !isOffShift(member.shifts[todayIndex] ?? "")) ?? []
    : [];
  const totalHours = data?.members.reduce((sum, member) => sum + member.scheduledHours, 0) ?? 0;
  const totalShiftCells = data?.members.reduce((sum, member) => sum + member.scheduledDays, 0) ?? 0;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-sky via-mint to-sunny p-6 shadow-pop sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 shadow-soft animate-float">
                <CalendarDays className="h-5 w-5 text-sky-foreground" />
              </span>
              <div>
                <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-sky-foreground/75">
                  <Sparkles className="h-3.5 w-3.5" />
                  {data?.source === "snapshot" ? "Sheet-backed snapshot" : "Live from Google Sheets"}
                </p>
                <h1 className="text-3xl font-extrabold text-sky-foreground sm:text-4xl">
                  Social Media Team Schedule
                </h1>
              </div>
            </div>
            <p className="mt-4 text-sm font-medium leading-6 text-sky-foreground/80">
              A cleaner weekly roster built from the team schedule sheet, with coverage,
              shift status, and quick scanning for daily staffing.
            </p>
          </div>

          <a
            href={SCHEDULE_SOURCE_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-sky-foreground shadow-soft transition-transform hover:scale-105"
          >
            <ExternalLink className="h-4 w-4" />
            Source sheet
          </a>
        </div>
      </section>

      {isLoading ? (
        <Skeleton className="h-96 rounded-3xl" />
      ) : !data ? (
        <ScheduleError error={error} />
      ) : (
        <>
          {isError && <ScheduleError error={error} compact />}

          {data.source === "snapshot" && (
            <div className="rounded-3xl bg-sunny/45 p-4 text-sunny-foreground shadow-soft">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-extrabold">Showing the latest saved schedule snapshot</p>
                  <p className="mt-1 text-sm leading-6 opacity-85">
                    The Google Sheet is private to the public website. Publish a schedule CSV mirror
                    and set VITE_SCHEDULE_CSV_URL in Cloudflare to make this page refresh every week automatically.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 font-semibold text-mint-foreground">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint" />
              </span>
              {data.source === "live" ? "Live weekly view" : "Snapshot weekly view"}
            </span>
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            <span>
              {data.days[0]?.label} - {data.days[data.days.length - 1]?.label} · refreshed{" "}
              {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : "just now"}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard icon={Users} label="Team members" value={String(data.members.length)} tone="primary" />
            <MetricCard icon={Clock} label="Weekly hours" value={`${formatHours(totalHours)}h`} tone="mint" />
            <MetricCard icon={CalendarDays} label="Scheduled shifts" value={String(totalShiftCells)} tone="sunny" />
            <MetricCard
              icon={Sparkles}
              label={todayIndex >= 0 ? "On duty today" : "Current day"}
              value={todayIndex >= 0 ? String(todayMembers.length) : "Outside week"}
              tone="sky"
            />
          </div>

          {todayIndex >= 0 && (
            <section className="rounded-3xl bg-card p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold">Today’s Coverage</h2>
                  <p className="text-sm text-muted-foreground">
                    {data.days[todayIndex].weekday}, {data.days[todayIndex].label}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.coverageByDay[todayIndex]?.map((bucket) => (
                    <span
                      key={bucket.label}
                      className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground"
                    >
                      {bucket.label}: {bucket.count}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {todayMembers.map((member) => (
                  <MemberTodayCard key={member.name} member={member} shift={member.shifts[todayIndex]} />
                ))}
              </div>
            </section>
          )}

          <section className="rounded-3xl bg-card p-5 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold">Weekly Roster</h2>
                <p className="text-sm text-muted-foreground">
                  Filter by team section or search a CSR, skill, or shift.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {groups.map((item) => (
                  <button
                    key={item}
                    onClick={() => setGroup(item)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
                      group === item
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search schedule..."
                className="pl-9"
              />
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[980px] text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                    <th className="w-56 p-3 text-left">CSR</th>
                    <th className="w-60 p-3 text-left">Priority Skill</th>
                    {data.days.map((day) => (
                      <th
                        key={day.key}
                        className={cn(
                          "w-32 p-3 text-left",
                          day.key === todayKey && "rounded-t-2xl bg-primary/10 text-primary"
                        )}
                      >
                        <span className="block font-extrabold">{day.weekday}</span>
                        <span className="font-medium normal-case">{day.label}</span>
                      </th>
                    ))}
                    <th className="w-24 p-3 text-right">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.name} className="border-b border-border/70">
                      <td className="p-3 align-top">
                        <p className="font-extrabold">{member.name}</p>
                        <p className="text-xs font-semibold text-primary">{member.group}</p>
                      </td>
                      <td className="p-3 align-top text-muted-foreground">{member.skill}</td>
                      {member.shifts.map((shift, index) => (
                        <td
                          key={`${member.name}-${data.days[index]?.key}`}
                          className={cn("p-3 align-top", data.days[index]?.key === todayKey && "bg-primary/5")}
                        >
                          <ShiftBadge shift={shift} />
                        </td>
                      ))}
                      <td className="p-3 text-right align-top font-extrabold">
                        {formatHours(member.scheduledHours)}h
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

const ScheduleError = ({ error, compact = false }: { error: unknown; compact?: boolean }) => (
  <div className={`rounded-3xl bg-sunny/45 ${compact ? "p-4" : "p-8"} text-sunny-foreground shadow-soft`}>
    <div className="flex items-start gap-3">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-extrabold">Schedule source needs a public mirror</p>
        {!compact && (
          <p className="mt-1 text-sm leading-6 opacity-85">
            The linked Google Sheet is private, so the public site cannot fetch it directly.
            Create a public mirror/published tab and set `VITE_SCHEDULE_CSV_URL` to its CSV endpoint.
            {error instanceof Error ? ` Current load detail: ${error.message}` : ""}
          </p>
        )}
      </div>
    </div>
  </div>
);

const MetricCard = ({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  tone: "primary" | "mint" | "sunny" | "sky";
}) => {
  const toneClass = {
    primary: "bg-primary text-primary-foreground",
    mint: "bg-mint text-mint-foreground",
    sunny: "bg-sunny text-sunny-foreground",
    sky: "bg-sky text-sky-foreground",
  }[tone];

  return (
    <div className={`rounded-3xl p-5 shadow-soft ${toneClass}`}>
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="mt-1 text-3xl font-extrabold">{value}</p>
    </div>
  );
};

const MemberTodayCard = ({ member, shift }: { member: TeamScheduleMember; shift: string }) => (
  <div className="rounded-2xl bg-muted/60 p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-extrabold">{member.name}</p>
        <p className="text-xs font-semibold text-muted-foreground">{member.skill}</p>
      </div>
      <ShiftBadge shift={shift} />
    </div>
  </div>
);

const ShiftBadge = ({ shift }: { shift: string }) => {
  const off = isOffShift(shift);
  return (
    <span
      className={cn(
        "inline-flex min-w-24 justify-center rounded-full px-3 py-1 text-xs font-extrabold",
        off
          ? "bg-muted text-muted-foreground"
          : "bg-primary/12 text-primary ring-1 ring-primary/20"
      )}
    >
      {shift || "OFF"}
    </span>
  );
};

export default Schedule;
