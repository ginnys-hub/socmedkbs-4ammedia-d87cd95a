import { useMemo, useState } from "react";
import { SCORECARDS, composite, TEAM_MEMBERS } from "@/data/scorecards";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [weekOf, setWeekOf] = useState(SCORECARDS[0].weekOf);
  const [member, setMember] = useState<string>(TEAM_MEMBERS[0]);

  const week = SCORECARDS.find((w) => w.weekOf === weekOf) ?? SCORECARDS[0];

  const teamChartData = useMemo(
    () =>
      week.entries
        .map((e) => ({ name: e.member, score: composite(e), qa: e.qa, csat: e.csat }))
        .sort((a, b) => b.score - a.score),
    [week]
  );

  const sortedTop = [...week.entries].sort(
    (a, b) => composite(b) - composite(a)
  );

  // Individual: history across all weeks
  const memberHistory = useMemo(
    () =>
      [...SCORECARDS]
        .reverse()
        .map((w) => {
          const e = w.entries.find((x) => x.member === member);
          return e
            ? {
                week: w.label.split(",")[0],
                score: composite(e),
                qa: e.qa,
                csat: e.csat,
                tickets: e.tickets,
              }
            : null;
        })
        .filter(Boolean) as Array<{
        week: string;
        score: number;
        qa: number;
        csat: number;
        tickets: number;
      }>,
    [member]
  );

  const memberThisWeek = week.entries.find((e) => e.member === member);

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

      <Tabs defaultValue="team" className="space-y-6">
        <TabsList className="rounded-full bg-muted p-1">
          <TabsTrigger value="team" className="rounded-full">
            Team Board
          </TabsTrigger>
          <TabsTrigger value="individual" className="rounded-full">
            Individual Board
          </TabsTrigger>
        </TabsList>

        {/* TEAM BOARD */}
        <TabsContent value="team" className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold">Week of:</span>
            <Select value={weekOf} onValueChange={setWeekOf}>
              <SelectTrigger className="w-[260px] rounded-full bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCORECARDS.map((w) => (
                  <SelectItem key={w.weekOf} value={w.weekOf}>
                    {w.label}
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
                  key={e.member}
                  className={`rounded-3xl ${styles[i]} p-5 shadow-soft`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    <Trophy className="h-4 w-4" />#{i + 1}
                  </div>
                  <p className="mt-2 text-2xl font-extrabold">{e.member}</p>
                  <p className="text-sm opacity-80">
                    Composite {composite(e)} · QA {e.qa} · CSAT {e.csat}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="rounded-3xl bg-card p-6 shadow-soft">
            <h3 className="mb-4 font-bold">Composite scores — {week.label}</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={teamChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[80, 100]} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                    }}
                  />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl bg-card shadow-soft">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3 text-left">Member</th>
                  <th className="p-3 text-right">QA</th>
                  <th className="p-3 text-right">CSAT</th>
                  <th className="p-3 text-right">Tickets</th>
                  <th className="p-3 text-right">Avg Resp (min)</th>
                  <th className="p-3 text-right">Composite</th>
                </tr>
              </thead>
              <tbody>
                {sortedTop.map((e) => (
                  <tr key={e.member} className="border-t border-border">
                    <td className="p-3 font-semibold">{e.member}</td>
                    <td className="p-3 text-right">{e.qa}</td>
                    <td className="p-3 text-right">{e.csat}</td>
                    <td className="p-3 text-right">{e.tickets}</td>
                    <td className="p-3 text-right">{e.responseTime}</td>
                    <td className="p-3 text-right font-bold text-primary">
                      {composite(e)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* INDIVIDUAL BOARD */}
        <TabsContent value="individual" className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold">Week of:</span>
            <Select value={weekOf} onValueChange={setWeekOf}>
              <SelectTrigger className="w-[260px] rounded-full bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCORECARDS.map((w) => (
                  <SelectItem key={w.weekOf} value={w.weekOf}>
                    {w.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="ml-2 text-sm font-semibold">Member:</span>
            <Select value={member} onValueChange={setMember}>
              <SelectTrigger className="w-[200px] rounded-full bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEAM_MEMBERS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {memberThisWeek && (
            <div className="grid gap-4 sm:grid-cols-4">
              <StatCard label="Composite" value={composite(memberThisWeek)} tone="primary" />
              <StatCard label="QA" value={memberThisWeek.qa} tone="mint" />
              <StatCard label="CSAT" value={memberThisWeek.csat} tone="bubblegum" />
              <StatCard label="Tickets" value={memberThisWeek.tickets} tone="sky" />
            </div>
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
                  <YAxis domain={[80, 100]} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="qa"
                    stroke="hsl(var(--mint))"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="csat"
                    stroke="hsl(var(--bubblegum))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
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
  value: number;
  tone: keyof typeof toneMap;
}) => (
  <div className={`rounded-3xl ${toneMap[tone]} p-5 shadow-soft`}>
    <p className="text-xs font-bold uppercase tracking-wider opacity-80">
      {label}
    </p>
    <p className="mt-1 text-3xl font-extrabold">{value}</p>
  </div>
);

export default Scorecards;
