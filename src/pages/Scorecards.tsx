import { useEffect, useMemo, useState } from "react";
import {
  useScorecardWeeks,
  useScorecardEntries,
  useAllScorecardEntries,
  type ScorecardEntry,
  type ScorecardWeek,
} from "@/hooks/useContent";
import {
  attendancePct,
  qualityPct,
  achievementPct,
  workEthicPct,
} from "@/lib/scorecardMath";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, CalendarDays, Download, TrendingUp, Trophy, UserRound } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type MonthlyEntry = ScorecardEntry & {
  month_id: string;
  month_label: string;
  weeks_count: number;
};

const monthIdFromDate = (date: string) => date.slice(0, 7);

const monthLabelFromId = (monthId: string) => {
  const [year, month] = monthId.split("-").map(Number);
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(
    new Date(year, month - 1, 1)
  );
};

const average = (values: number[]) =>
  values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

const buildMonthlyEntries = (weeks: ScorecardWeek[] = [], entries: ScorecardEntry[] = []) => {
  const weekToMonth = new Map(weeks.map((week) => [week.id, monthIdFromDate(week.week_of)]));
  const buckets = new Map<string, ScorecardEntry[]>();

  entries.forEach((entry) => {
    const monthId = weekToMonth.get(entry.week_id);
    if (!monthId) return;

    const key = `${monthId}::${entry.member}`;
    buckets.set(key, [...(buckets.get(key) ?? []), entry]);
  });

  return Array.from(buckets.entries()).map(([key, grouped]) => {
    const [monthId, member] = key.split("::");
    const totals = grouped.reduce(
      (acc, entry) => ({
        hours_worked: acc.hours_worked + Number(entry.hours_worked),
        hours_scheduled: acc.hours_scheduled + Number(entry.hours_scheduled),
        qa_score: acc.qa_score + Number(entry.qa_score),
        qa_max: acc.qa_max + Number(entry.qa_max),
        ticket_target: acc.ticket_target + Number(entry.ticket_target),
        ticket_actual: acc.ticket_actual + Number(entry.ticket_actual),
        work_ethic_score: acc.work_ethic_score + Number(entry.work_ethic_score),
        work_ethic_max: acc.work_ethic_max + Number(entry.work_ethic_max),
        infractions: acc.infractions + Number(entry.infractions),
      }),
      {
        hours_worked: 0,
        hours_scheduled: 0,
        qa_score: 0,
        qa_max: 0,
        ticket_target: 0,
        ticket_actual: 0,
        work_ethic_score: 0,
        work_ethic_max: 0,
        infractions: 0,
      }
    );

    return {
      id: key,
      week_id: monthId,
      member,
      month_id: monthId,
      month_label: monthLabelFromId(monthId),
      weeks_count: grouped.length,
      overall_pct: average(grouped.map((entry) => Number(entry.overall_pct))),
      ...totals,
    } satisfies MonthlyEntry;
  });
};

const Scorecards = () => {
  const { data: weeks, isLoading: loadingWeeks } = useScorecardWeeks();
  const [weekId, setWeekId] = useState<string>("");
  const [member, setMember] = useState<string>("");
  const [monthId, setMonthId] = useState<string>("");
  const [monthlyMember, setMonthlyMember] = useState<string>("");

  useEffect(() => {
    if (!weekId && weeks && weeks.length > 0) {
      setWeekId((weeks.find((w) => w.is_current) ?? weeks[0]).id);
    }
  }, [weeks, weekId]);

  const { data: entries } = useScorecardEntries(weekId);
  const { data: allEntries } = useAllScorecardEntries();

  useEffect(() => {
    if (!member && entries && entries.length > 0) {
      setMember(entries[0].member);
    }
  }, [entries, member]);

  const monthlyEntries = useMemo(
    () => buildMonthlyEntries(weeks ?? [], allEntries ?? []),
    [weeks, allEntries]
  );

  const months = useMemo(() => {
    const byMonth = new Map<string, string>();
    monthlyEntries.forEach((entry) => byMonth.set(entry.month_id, entry.month_label));
    return Array.from(byMonth.entries())
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => b.id.localeCompare(a.id));
  }, [monthlyEntries]);

  useEffect(() => {
    if (!monthId && months.length > 0) {
      setMonthId(months[0].id);
    }
  }, [monthId, months]);

  const week = weeks?.find((w) => w.id === weekId);

  const monthlyForSelectedMonth = useMemo(
    () => monthlyEntries.filter((entry) => entry.month_id === monthId),
    [monthId, monthlyEntries]
  );

  const allMemberNames = useMemo(() => {
    const set = new Set<string>();
    (allEntries ?? []).forEach((e) => set.add(e.member));
    return Array.from(set).sort();
  }, [allEntries]);

  const monthlyMemberNames = useMemo(
    () => monthlyForSelectedMonth.map((entry) => entry.member).sort(),
    [monthlyForSelectedMonth]
  );

  useEffect(() => {
    if (monthlyMemberNames.length > 0 && !monthlyMemberNames.includes(monthlyMember)) {
      setMonthlyMember(monthlyMemberNames[0]);
    }
  }, [monthlyMember, monthlyMemberNames]);

  const teamChartData = useMemo(
    () =>
      (entries ?? [])
        .map((e) => ({
          name: e.member.split(" ")[0],
          overall: Math.round(Number(e.overall_pct) * 10) / 10,
        }))
        .sort((a, b) => b.overall - a.overall),
    [entries]
  );

  const monthlyChartData = useMemo(
    () =>
      monthlyForSelectedMonth
        .map((e) => ({
          name: e.member.split(" ")[0],
          overall: Math.round(Number(e.overall_pct) * 10) / 10,
        }))
        .sort((a, b) => b.overall - a.overall),
    [monthlyForSelectedMonth]
  );

  const sortedTop = useMemo(
    () =>
      [...(entries ?? [])].sort(
        (a, b) => Number(b.overall_pct) - Number(a.overall_pct)
      ),
    [entries]
  );

  const sortedMonthlyTop = useMemo(
    () =>
      [...monthlyForSelectedMonth].sort(
        (a, b) => Number(b.overall_pct) - Number(a.overall_pct)
      ),
    [monthlyForSelectedMonth]
  );

  const memberHistory = useMemo(() => {
    if (!weeks || !allEntries || !member) return [];
    return [...weeks]
      .sort(
        (a, b) =>
          new Date(a.week_of).getTime() - new Date(b.week_of).getTime()
      )
      .map((w) => {
        const e = allEntries.find(
          (x) => x.week_id === w.id && x.member === member
        );
        if (!e) return null;
        return {
          week: w.label.split(",")[0],
          overall: Math.round(Number(e.overall_pct) * 10) / 10,
          quality: Math.round(qualityPct(e) * 10) / 10,
          attendance: Math.round(attendancePct(e) * 10) / 10,
        };
      })
      .filter(Boolean) as Array<{
      week: string;
      overall: number;
      quality: number;
      attendance: number;
    }>;
  }, [weeks, allEntries, member]);

  const monthlyMemberHistory = useMemo(() => {
    if (!monthlyMember) return [];
    return [...monthlyEntries]
      .filter((entry) => entry.member === monthlyMember)
      .sort((a, b) => a.month_id.localeCompare(b.month_id))
      .map((entry) => ({
        month: entry.month_label.split(" ")[0],
        overall: Math.round(Number(entry.overall_pct) * 10) / 10,
        quality: Math.round(qualityPct(entry) * 10) / 10,
        attendance: Math.round(attendancePct(entry) * 10) / 10,
      }));
  }, [monthlyEntries, monthlyMember]);

  const memberThisWeek = entries?.find((e) => e.member === member);
  const memberThisMonth = monthlyForSelectedMonth.find(
    (entry) => entry.member === monthlyMember
  );
  const month = months.find((item) => item.id === monthId);

  if (loadingWeeks) {
    return <Skeleton className="h-96 rounded-3xl" />;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-mint p-6 sm:p-8 shadow-pop animate-scale-in">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 shadow-soft animate-float">
            <BarChart3 className="h-5 w-5 text-mint-foreground" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold text-mint-foreground animate-fade-in-down">
              Scorecard History
            </h1>
            <p className="text-sm text-mint-foreground/80 animate-fade-in stagger-1">
              Track team & individual performance by week and month
            </p>
          </div>
        </div>
      </div>

      {!weeks || weeks.length === 0 ? (
        <p className="rounded-3xl bg-muted p-8 text-center text-muted-foreground">
          No scorecard weeks have been added yet.
        </p>
      ) : (
        <Tabs defaultValue="weekly" className="space-y-6">
          <TabsList className="rounded-full bg-muted p-1">
            <TabsTrigger value="weekly" className="rounded-full">Weeklies</TabsTrigger>
            <TabsTrigger value="monthly" className="rounded-full">Monthlies</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-6">
            <WeeklyScorecards
              allMemberNames={allMemberNames}
              entries={entries ?? []}
              member={member}
              memberHistory={memberHistory}
              memberThisWeek={memberThisWeek}
              setMember={setMember}
              setWeekId={setWeekId}
              sortedTop={sortedTop}
              teamChartData={teamChartData}
              week={week}
              weekId={weekId}
              weeks={weeks}
            />
          </TabsContent>

          <TabsContent value="monthly" className="space-y-6">
            <Tabs defaultValue="overall" className="space-y-6">
              <TabsList className="rounded-full bg-muted p-1">
                <TabsTrigger value="overall" className="rounded-full">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Overall View
                </TabsTrigger>
                <TabsTrigger value="individual" className="rounded-full">
                  <UserRound className="mr-2 h-4 w-4" />
                  Individual View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overall" className="space-y-6">
                <MonthlyOverallView
                  month={month}
                  monthId={monthId}
                  months={months}
                  monthlyChartData={monthlyChartData}
                  setMonthId={setMonthId}
                  sortedMonthlyTop={sortedMonthlyTop}
                />
              </TabsContent>

              <TabsContent value="individual" className="space-y-6">
                <MonthlyIndividualView
                  memberThisMonth={memberThisMonth}
                  monthId={monthId}
                  months={months}
                  monthlyMember={monthlyMember}
                  monthlyMemberHistory={monthlyMemberHistory}
                  monthlyMemberNames={monthlyMemberNames}
                  setMonthId={setMonthId}
                  setMonthlyMember={setMonthlyMember}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

const WeeklyScorecards = ({
  allMemberNames,
  entries,
  member,
  memberHistory,
  memberThisWeek,
  setMember,
  setWeekId,
  sortedTop,
  teamChartData,
  week,
  weekId,
  weeks,
}: {
  allMemberNames: string[];
  entries: ScorecardEntry[];
  member: string;
  memberHistory: Array<{ week: string; overall: number; quality: number; attendance: number }>;
  memberThisWeek?: ScorecardEntry;
  setMember: (member: string) => void;
  setWeekId: (weekId: string) => void;
  sortedTop: ScorecardEntry[];
  teamChartData: Array<{ name: string; overall: number }>;
  week?: ScorecardWeek;
  weekId: string;
  weeks: ScorecardWeek[];
}) => (
  <Tabs defaultValue="team" className="space-y-6">
    <TabsList className="rounded-full bg-muted p-1">
      <TabsTrigger value="team" className="rounded-full">Team Board</TabsTrigger>
      <TabsTrigger value="individual" className="rounded-full">Individual Board</TabsTrigger>
    </TabsList>

    <TabsContent value="team" className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold">Week of:</span>
        <Select value={weekId} onValueChange={setWeekId}>
          <SelectTrigger className="w-[260px] rounded-full bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {weeks.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.label}
                {w.is_current ? " ★" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {week?.pdf_url ? (
          <a
            href={week.pdf_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" />
            Open PDF
          </a>
        ) : null}
      </div>

      <TopThree entries={sortedTop} />
      <OverallBarChart data={teamChartData} title={`Overall % — ${week?.label ?? ""}`} />
      <ScorecardTable entries={sortedTop} />
    </TabsContent>

    <TabsContent value="individual" className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold">Week of:</span>
        <Select value={weekId} onValueChange={setWeekId}>
          <SelectTrigger className="w-[260px] rounded-full bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {weeks.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="ml-2 text-sm font-semibold">Member:</span>
        <Select value={member} onValueChange={setMember}>
          <SelectTrigger className="w-[220px] rounded-full bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {allMemberNames.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {memberThisWeek ? (
        <>
          <MetricCards entry={memberThisWeek} />
          <DetailTable entry={memberThisWeek} />
        </>
      ) : (
        <p className="rounded-3xl bg-muted p-6 text-center text-muted-foreground">
          No data for {member} on this week.
        </p>
      )}

      <HistoryLineChart data={memberHistory} name={member} title="history" xKey="week" />
    </TabsContent>
  </Tabs>
);

const MonthlyOverallView = ({
  month,
  monthId,
  months,
  monthlyChartData,
  setMonthId,
  sortedMonthlyTop,
}: {
  month?: { id: string; label: string };
  monthId: string;
  months: Array<{ id: string; label: string }>;
  monthlyChartData: Array<{ name: string; overall: number }>;
  setMonthId: (monthId: string) => void;
  sortedMonthlyTop: MonthlyEntry[];
}) => (
  <>
    <MonthSelect monthId={monthId} months={months} setMonthId={setMonthId} />

    {sortedMonthlyTop.length === 0 ? (
      <p className="rounded-3xl bg-muted p-6 text-center text-muted-foreground">
        No monthly scorecard data for this month.
      </p>
    ) : (
      <>
        <TopThree entries={sortedMonthlyTop} />
        <OverallBarChart data={monthlyChartData} title={`Monthly Overall % — ${month?.label ?? ""}`} />
        <ScorecardTable entries={sortedMonthlyTop} showWeeks />
      </>
    )}
  </>
);

const MonthlyIndividualView = ({
  memberThisMonth,
  monthId,
  months,
  monthlyMember,
  monthlyMemberHistory,
  monthlyMemberNames,
  setMonthId,
  setMonthlyMember,
}: {
  memberThisMonth?: MonthlyEntry;
  monthId: string;
  months: Array<{ id: string; label: string }>;
  monthlyMember: string;
  monthlyMemberHistory: Array<{ month: string; overall: number; quality: number; attendance: number }>;
  monthlyMemberNames: string[];
  setMonthId: (monthId: string) => void;
  setMonthlyMember: (member: string) => void;
}) => (
  <>
    <div className="flex flex-wrap items-center gap-3">
      <MonthSelect monthId={monthId} months={months} setMonthId={setMonthId} />

      <span className="ml-2 text-sm font-semibold">Member:</span>
      <Select value={monthlyMember} onValueChange={setMonthlyMember}>
        <SelectTrigger className="w-[220px] rounded-full bg-card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {monthlyMemberNames.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {memberThisMonth ? (
      <>
        <MetricCards entry={memberThisMonth} />
        <DetailTable entry={memberThisMonth} showWeeks />
      </>
    ) : (
      <p className="rounded-3xl bg-muted p-6 text-center text-muted-foreground">
        No monthly data for {monthlyMember} in this month.
      </p>
    )}

    <HistoryLineChart data={monthlyMemberHistory} name={monthlyMember} title="monthly history" xKey="month" />
  </>
);

const MonthSelect = ({
  monthId,
  months,
  setMonthId,
}: {
  monthId: string;
  months: Array<{ id: string; label: string }>;
  setMonthId: (monthId: string) => void;
}) => (
  <div className="flex flex-wrap items-center gap-3">
    <span className="text-sm font-semibold">Month:</span>
    <Select value={monthId} onValueChange={setMonthId}>
      <SelectTrigger className="w-[240px] rounded-full bg-card">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {months.map((month) => (
          <SelectItem key={month.id} value={month.id}>
            {month.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const TopThree = ({ entries }: { entries: Array<ScorecardEntry | MonthlyEntry> }) => (
  <div className="grid gap-4 md:grid-cols-3">
    {entries.slice(0, 3).map((e, i) => {
      const styles = [
        "bg-gradient-sunny text-sunny-foreground",
        "bg-secondary text-secondary-foreground",
        "bg-accent text-accent-foreground",
      ];
      return (
        <div
          key={e.id}
          style={{ animationDelay: `${i * 100}ms` }}
          className={`rounded-3xl ${styles[i]} p-5 shadow-soft animate-scale-in hover-lift`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <Trophy className="h-4 w-4" />#{i + 1}
          </div>
          <p className="mt-2 text-2xl font-extrabold">{e.member}</p>
          <p className="text-sm opacity-80">
            Overall {Number(e.overall_pct).toFixed(2)}% · Quality{" "}
            {qualityPct(e).toFixed(0)}% · Achievement{" "}
            {achievementPct(e).toFixed(0)}%
          </p>
        </div>
      );
    })}
  </div>
);

const OverallBarChart = ({
  data,
  title,
}: {
  data: Array<{ name: string; overall: number }>;
  title: string;
}) => (
  <div className="rounded-3xl bg-card p-6 shadow-soft">
    <h3 className="mb-4 font-bold">{title}</h3>
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
          <YAxis domain={[60, 180]} stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--card))",
            }}
          />
          <Bar dataKey="overall" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const ScorecardTable = ({
  entries,
  showWeeks = false,
}: {
  entries: Array<ScorecardEntry | MonthlyEntry>;
  showWeeks?: boolean;
}) => (
  <div className="overflow-x-auto rounded-3xl bg-card shadow-soft">
    <table className="w-full text-sm">
      <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
        <tr>
          <th className="p-3 text-left">Member</th>
          {showWeeks && <th className="p-3 text-right">Weeks</th>}
          <th className="p-3 text-right">Attendance</th>
          <th className="p-3 text-right">Quality</th>
          <th className="p-3 text-right">Tickets</th>
          <th className="p-3 text-right">Achievement</th>
          <th className="p-3 text-right">Work Ethic</th>
          <th className="p-3 text-right">Infractions</th>
          <th className="p-3 text-right">Overall</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((e, i) => (
          <tr key={e.id} style={{ animationDelay: `${i * 40}ms` }} className="border-t border-border animate-fade-in transition-colors hover:bg-muted/40">
            <td className="p-3 font-semibold">{e.member}</td>
            {showWeeks && <td className="p-3 text-right">{"weeks_count" in e ? e.weeks_count : 1}</td>}
            <td className="p-3 text-right">{attendancePct(e).toFixed(2)}%</td>
            <td className="p-3 text-right">{qualityPct(e).toFixed(0)}%</td>
            <td className="p-3 text-right">
              {e.ticket_actual}/{e.ticket_target}
            </td>
            <td className="p-3 text-right">{achievementPct(e).toFixed(2)}%</td>
            <td className="p-3 text-right">{workEthicPct(e).toFixed(0)}%</td>
            <td className="p-3 text-right">{e.infractions}</td>
            <td className="p-3 text-right font-bold text-primary">
              {Number(e.overall_pct).toFixed(2)}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const MetricCards = ({ entry }: { entry: ScorecardEntry | MonthlyEntry }) => (
  <div className="grid gap-4 sm:grid-cols-4">
    <StatCard label="Overall" value={`${Number(entry.overall_pct).toFixed(2)}%`} tone="primary" />
    <StatCard label="Quality" value={`${qualityPct(entry).toFixed(0)}%`} tone="mint" />
    <StatCard label="Attendance" value={`${attendancePct(entry).toFixed(2)}%`} tone="bubblegum" />
    <StatCard label="Achievement" value={`${achievementPct(entry).toFixed(2)}%`} tone="sky" />
  </div>
);

const DetailTable = ({
  entry,
  showWeeks = false,
}: {
  entry: ScorecardEntry | MonthlyEntry;
  showWeeks?: boolean;
}) => (
  <div className="overflow-hidden rounded-3xl bg-card shadow-soft">
    <table className="w-full text-sm">
      <tbody>
        {showWeeks && <Row label="Weeks Tallied" value={`${"weeks_count" in entry ? entry.weeks_count : 1}`} />}
        <Row label="Hours Worked / Scheduled" value={`${entry.hours_worked} / ${entry.hours_scheduled}`} />
        <Row label="QA Score" value={`${entry.qa_score} / ${entry.qa_max}`} />
        <Row label="Tickets Actual / Target" value={`${entry.ticket_actual} / ${entry.ticket_target}`} />
        <Row label="Work Ethic" value={`${entry.work_ethic_score} / ${entry.work_ethic_max}`} />
        <Row label="Infractions" value={`${entry.infractions}`} />
      </tbody>
    </table>
  </div>
);

const HistoryLineChart = ({
  data,
  name,
  title,
  xKey,
}: {
  data: Array<{ overall: number; quality: number; attendance: number } & Record<string, string | number>>;
  name: string;
  title: string;
  xKey: string;
}) => (
  <div className="rounded-3xl bg-card p-6 shadow-soft">
    <div className="mb-4 flex items-center gap-2">
      <TrendingUp className="h-4 w-4 text-primary" />
      <h3 className="font-bold">{name}'s {title}</h3>
    </div>
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey={xKey} stroke="hsl(var(--muted-foreground))" />
          <YAxis domain={[60, 180]} stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--card))",
            }}
          />
          <Line type="monotone" dataKey="overall" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5 }} />
          <Line type="monotone" dataKey="quality" stroke="hsl(var(--mint))" strokeWidth={2} />
          <Line type="monotone" dataKey="attendance" stroke="hsl(var(--bubblegum))" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const toneMap = {
  primary: "bg-primary text-primary-foreground",
  mint: "bg-mint text-mint-foreground",
  bubblegum: "bg-bubblegum text-bubblegum-foreground",
  sky: "bg-sky text-sky-foreground",
} as const;

const StatCard = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: keyof typeof toneMap;
}) => (
  <div className={`rounded-3xl ${toneMap[tone]} p-5 shadow-soft animate-scale-in hover-lift`}>
    <p className="text-xs font-bold uppercase tracking-wider opacity-80">
      {label}
    </p>
    <p className="mt-1 text-3xl font-extrabold">{value}</p>
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <tr className="border-t border-border first:border-t-0">
    <td className="p-3 text-muted-foreground">{label}</td>
    <td className="p-3 text-right font-semibold">{value}</td>
  </tr>
);

export default Scorecards;
