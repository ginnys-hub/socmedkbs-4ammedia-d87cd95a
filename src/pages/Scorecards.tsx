import { useEffect, useMemo, useState } from "react";
import {
  useScorecardWeeks,
  useScorecardEntries,
  useAllScorecardEntries,
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
import { BarChart3, TrendingUp, Trophy } from "lucide-react";
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

const Scorecards = () => {
  const { data: weeks, isLoading: loadingWeeks } = useScorecardWeeks();
  const [weekId, setWeekId] = useState<string>("");
  const [member, setMember] = useState<string>("");

  // Default to current week (or newest)
  useEffect(() => {
    if (!weekId && weeks && weeks.length > 0) {
      setWeekId((weeks.find((w) => w.is_current) ?? weeks[0]).id);
    }
  }, [weeks, weekId]);

  const { data: entries } = useScorecardEntries(weekId);
  const { data: allEntries } = useAllScorecardEntries();

  // Default member
  useEffect(() => {
    if (!member && entries && entries.length > 0) {
      setMember(entries[0].member);
    }
  }, [entries, member]);

  const week = weeks?.find((w) => w.id === weekId);

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

  const sortedTop = useMemo(
    () =>
      [...(entries ?? [])].sort(
        (a, b) => Number(b.overall_pct) - Number(a.overall_pct)
      ),
    [entries]
  );

  const allMemberNames = useMemo(() => {
    const set = new Set<string>();
    (allEntries ?? []).forEach((e) => set.add(e.member));
    return Array.from(set).sort();
  }, [allEntries]);

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

  const memberThisWeek = entries?.find((e) => e.member === member);

  if (loadingWeeks) {
    return <Skeleton className="h-96 rounded-3xl" />;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-mint p-6 sm:p-8 shadow-pop">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 shadow-soft">
            <BarChart3 className="h-5 w-5 text-mint-foreground" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold text-mint-foreground">
              Scorecard History
            </h1>
            <p className="text-sm text-mint-foreground/80">
              Track team & individual performance week over week
            </p>
          </div>
        </div>
      </div>

      {!weeks || weeks.length === 0 ? (
        <p className="rounded-3xl bg-muted p-8 text-center text-muted-foreground">
          No scorecard weeks have been added yet.
        </p>
      ) : (
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
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {sortedTop.slice(0, 3).map((e, i) => {
                const styles = [
                  "bg-gradient-sunny text-sunny-foreground",
                  "bg-secondary text-secondary-foreground",
                  "bg-accent text-accent-foreground",
                ];
                return (
                  <div
                    key={e.id}
                    className={`rounded-3xl ${styles[i]} p-5 shadow-soft`}
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

            <div className="rounded-3xl bg-card p-6 shadow-soft">
              <h3 className="mb-4 font-bold">Overall % — {week?.label}</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer>
                  <BarChart data={teamChartData}>
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

            <div className="overflow-x-auto rounded-3xl bg-card shadow-soft">
              <table className="w-full text-sm">
                <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3 text-left">Member</th>
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
                  {sortedTop.map((e) => (
                    <tr key={e.id} className="border-t border-border">
                      <td className="p-3 font-semibold">{e.member}</td>
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
                <div className="grid gap-4 sm:grid-cols-4">
                  <StatCard label="Overall" value={`${Number(memberThisWeek.overall_pct).toFixed(2)}%`} tone="primary" />
                  <StatCard label="Quality" value={`${qualityPct(memberThisWeek).toFixed(0)}%`} tone="mint" />
                  <StatCard label="Attendance" value={`${attendancePct(memberThisWeek).toFixed(2)}%`} tone="bubblegum" />
                  <StatCard label="Achievement" value={`${achievementPct(memberThisWeek).toFixed(2)}%`} tone="sky" />
                </div>

                <div className="overflow-hidden rounded-3xl bg-card shadow-soft">
                  <table className="w-full text-sm">
                    <tbody>
                      <Row label="Hours Worked / Scheduled" value={`${memberThisWeek.hours_worked} / ${memberThisWeek.hours_scheduled}`} />
                      <Row label="QA Score" value={`${memberThisWeek.qa_score} / ${memberThisWeek.qa_max}`} />
                      <Row label="Tickets Actual / Target" value={`${memberThisWeek.ticket_actual} / ${memberThisWeek.ticket_target}`} />
                      <Row label="Work Ethic" value={`${memberThisWeek.work_ethic_score} / ${memberThisWeek.work_ethic_max}`} />
                      <Row label="Infractions" value={`${memberThisWeek.infractions}`} />
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="rounded-3xl bg-muted p-6 text-center text-muted-foreground">
                No data for {member} on this week.
              </p>
            )}

            <div className="rounded-3xl bg-card p-6 shadow-soft">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="font-bold">{member}'s history</h3>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer>
                  <LineChart data={memberHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
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
          </TabsContent>
        </Tabs>
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
  tone,
}: {
  label: string;
  value: string;
  tone: keyof typeof toneMap;
}) => (
  <div className={`rounded-3xl ${toneMap[tone]} p-5 shadow-soft`}>
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
