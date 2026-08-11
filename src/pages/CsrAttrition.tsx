import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Search,
  SlidersHorizontal,
  UserX,
  UsersRound,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const reportUrl =
  "https://docs.google.com/spreadsheets/d/1F5Pih68VwYeAwSvxIs86Lh99bU0qAmLYT9Z1sFbDcZ8/edit";

const reportWindow = "August 3-9, 2026";

const summary = {
  employeesIncluded: 42,
  employeesExcluded: 4,
  onTime: 201,
  absent: 3,
  undertime: 5,
  late: 2,
  totalAttrition: 10,
};

const employeeRows = [
  ["Call Team", "TEAM CESS", "Jhon Rey Cawaling", 5, 0, 0, 0, 0],
  ["Call Team", "TEAM CESS", "Vincent Anthony Alicando", 4, 0, 1, 0, 1],
  ["Call Team", "TEAM CESS", "Ingred Caralos", 5, 0, 0, 0, 0],
  ["Call Team", "TEAM CESS", "Barbie Dholl Kiawan", 5, 0, 0, 0, 0],
  ["Call Team", "TEAM CESS", "Shaira Shein Gomez", 4, 0, 1, 0, 1],
  ["Call Team", "TEAM CESS", "Angelo Robert Vargas", 5, 0, 0, 0, 0],
  ["Call Team", "TEAM BRAI", "Charlotte Gayle Jaro", 5, 0, 0, 0, 0],
  ["Call Team", "TEAM BRAI", "Cynthia Mae Aliviado", 4, 0, 1, 0, 1],
  ["Call Team", "TEAM BRAI", "Gelby Ewican", 5, 0, 0, 0, 0],
  ["Call Team", "TEAM BRAI", "Jedah Lene Bondoc", 6, 0, 0, 0, 0],
  ["Call Team", "TEAM BRAI", "Lady Mae Latonio", 4, 0, 1, 0, 1],
  ["Call Team", "TEAM BRAI", "Ma. Joanne Len Boug", 6, 0, 0, 0, 0],
  ["Call Team", "TEAM BRAI", "Oishin Ayapana", 5, 0, 0, 0, 0],
  ["Call Team", "TEAM BRAI", "Lean Marie Ligon", 5, 0, 0, 0, 0],
  ["Call Team", "TEAM BRAI", "Dynalou Masangkay", 0, 0, 0, 0, 0],
  ["Call Team", "TEAM BRAI", "Ryan Cinco", 5, 0, 0, 0, 0],
  ["Call Team", "TEAM DANIELLE", "Danielle Mae David", 5, 0, 0, 0, 0],
  ["Call Team", "TEAM DANIELLE", "Godwin Reasol", 4, 0, 0, 0, 0],
  ["Call Team", "TEAM DANIELLE", "Candy Laid", 5, 0, 0, 0, 0],
  ["Call Team", "TEAM DANIELLE", "Mary Claudette Ibong", 4, 0, 0, 0, 0],
  ["Call Team", "TEAM DANIELLE", "Sofhia Mae Santiago", 5, 0, 0, 0, 0],
  ["Call Team", "TEAM DANIELLE", "Cherry Rose Tubongbanua", 5, 0, 0, 0, 0],
  ["Call Team", "TEAM DANIELLE", "Lyra Miclat", 5, 0, 0, 0, 0],
  ["Call Team", "TEAM DANIELLE", "Joemica Jan Carino", 4, 0, 1, 0, 1],
  ["Email Team", "TEAM YURIE", "Mylene Butihen", 5, 0, 0, 0, 0],
  ["Email Team", "TEAM YURIE", "Princess Jane Acibar", 5, 0, 0, 0, 0],
  ["Email Team", "TEAM YURIE", "Novemei Ricaforte", 0, 0, 0, 0, 0],
  ["Email Team", "TEAM YURIE", "Joanna Elizabeth Enopia", 5, 0, 0, 0, 0],
  ["Email Team", "TEAM YURIE", "Alexis Joanna Castro", 5, 0, 0, 0, 0],
  ["Email Team", "TEAM YURIE", "Mary IC Pamaong", 5, 0, 0, 0, 0],
  ["Email Team", "TEAM NOBI", "Ace Luiz Aure", 5, 0, 0, 0, 0],
  ["Email Team", "TEAM NOBI", "Jericca Mae Secreto", 5, 0, 0, 0, 0],
  ["Email Team", "TEAM NOBI", "Maria Angelica Villegas", 3, 2, 0, 0, 2],
  ["Email Team", "TEAM NOBI", "Jerome Licuanan", 5, 0, 0, 0, 0],
  ["Email Team", "TEAM NOBI", "Methusela Laudiana", 9, 0, 0, 0, 0],
  ["Email Team", "TEAM NOBI", "Avis Mae Jarabelo", 8, 0, 0, 0, 0],
  ["Social Media Team", "TEAM GEORGINA", "Rande Delima", 3, 1, 0, 1, 2],
  ["Social Media Team", "TEAM GEORGINA", "Jay Aparece", 6, 0, 0, 0, 0],
  ["Social Media Team", "TEAM GEORGINA", "Alona Grace Jose", 6, 0, 0, 0, 0],
  ["Social Media Team", "TEAM GEORGINA", "Jezzalyn Tarranza", 5, 0, 0, 1, 1],
  ["Social Media Team", "TEAM GEORGINA", "Ava Reyes", 6, 0, 0, 0, 0],
  ["Social Media Team", "TEAM GEORGINA", "Jessel Lebosada", 5, 0, 0, 0, 0],
] as const;

type EmployeeRow = (typeof employeeRows)[number];
type EmployeeFilter = "all" | "attrition";

type Totals = {
  onTime: number;
  absent: number;
  undertime: number;
  late: number;
  totalAttrition: number;
};

const departments = [...new Set(employeeRows.map(([department]) => department))];
const teams = [...new Set(employeeRows.map(([, team]) => team))];
const departmentOptions = ["All Departments", ...departments];
const teamOptions = ["All Teams", ...teams];

const attritionRate = (row: Pick<Totals, "onTime" | "totalAttrition">) => {
  const scheduled = row.onTime + row.totalAttrition;
  return scheduled === 0 ? 0 : row.totalAttrition / scheduled;
};

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

const CsrAttrition = () => {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [team, setTeam] = useState("All Teams");
  const [filter, setFilter] = useState<EmployeeFilter>("all");

  const teamInsights = useMemo(() => buildTeamInsights(employeeRows), []);
  const chartData = teamInsights.map((item) => ({
    team: item.team.replace("TEAM ", ""),
    attrition: item.totals.totalAttrition,
  }));

  const filteredEmployeeRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return employeeRows.filter(([rowDepartment, rowTeam, employee, , , , , totalAttrition]) => {
      if (department !== "All Departments" && rowDepartment !== department) return false;
      if (team !== "All Teams" && rowTeam !== team) return false;
      if (filter === "attrition" && totalAttrition === 0) return false;
      if (!normalizedQuery) return true;

      return `${employee} ${rowDepartment} ${rowTeam}`.toLowerCase().includes(normalizedQuery);
    });
  }, [department, filter, query, team]);

  const filteredAttritionRows = useMemo(
    () => filteredEmployeeRows.filter(([, , , , , , , totalAttrition]) => totalAttrition > 0),
    [filteredEmployeeRows]
  );

  const filteredTotals = useMemo(() => buildTotals(filteredEmployeeRows), [filteredEmployeeRows]);
  const hasFilters = query.trim() || department !== "All Departments" || team !== "All Teams" || filter !== "all";

  const clearFilters = () => {
    setQuery("");
    setDepartment("All Departments");
    setTeam("All Teams");
    setFilter("all");
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-gradient-mint p-6 shadow-pop sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mint-foreground/80">
              <BarChart3 className="h-4 w-4" />
              CSR Department Attrition
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-mint-foreground sm:text-5xl">
              Attrition Action Board
            </h1>
            <p className="mt-3 text-sm leading-6 text-mint-foreground/85 sm:text-base">
              Attendance Counter summary for {reportWindow}, excluding 4 CSRs from the report.
            </p>
          </div>

          <a
            href={reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white/90 px-5 py-3 text-sm font-bold text-mint-foreground shadow-soft transition-transform hover:scale-[1.02]"
          >
            Open Google Sheet <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={UsersRound} label="Employees Included" value={summary.employeesIncluded} tone="primary" />
        <StatCard icon={UserX} label="Employees Excluded" value={summary.employeesExcluded} tone="bubblegum" />
        <StatCard icon={CheckCircle2} label="On-time Marks" value={summary.onTime} tone="mint" />
        <StatCard icon={AlertTriangle} label="Total Attrition" value={summary.totalAttrition} tone="sunny" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <TeamActionBoard teams={teamInsights} />
        <div className="rounded-3xl bg-card p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h2 className="font-bold">Team Attrition</h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" allowDecimals={false} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="team" width={80} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--card))",
                  }}
                />
                <Bar dataKey="attrition" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-card p-5 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <h2 className="font-bold">Drill Into CSR Records</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Use this only when you need names, team-level detail, or a filtered view.
            </p>
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Clear filters
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1.2fr_0.9fr_0.9fr_auto]">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search CSR, team, or department..."
              className="h-11 w-full rounded-full border border-input bg-background pl-11 pr-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
            />
          </label>

          <select
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            className="h-11 rounded-full border border-input bg-background px-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
          >
            {departmentOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select
            value={team}
            onChange={(event) => setTeam(event.target.value)}
            className="h-11 rounded-full border border-input bg-background px-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
          >
            {teamOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <div className="flex rounded-full bg-muted p-1">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                filter === "all"
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("attrition")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                filter === "attrition"
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Attrition
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <FilterStat label="Showing CSRs" value={filteredEmployeeRows.length} />
          <FilterStat label="With Attrition" value={filteredAttritionRows.length} />
          <FilterStat label="Filtered Attrition" value={filteredTotals.totalAttrition} />
          <FilterStat label="Filtered Rate" value={formatPercent(attritionRate(filteredTotals))} />
        </div>
      </section>

      <EmployeeDetail rows={filteredEmployeeRows} />
    </div>
  );
};

const buildTotals = (rows: ReadonlyArray<EmployeeRow>) =>
  rows.reduce(
    (acc, [, , , onTime, absent, undertime, late, totalAttrition]) => ({
      onTime: acc.onTime + onTime,
      absent: acc.absent + absent,
      undertime: acc.undertime + undertime,
      late: acc.late + late,
      totalAttrition: acc.totalAttrition + totalAttrition,
    }),
    { onTime: 0, absent: 0, undertime: 0, late: 0, totalAttrition: 0 }
  );

const groupRowsByTeam = (rows: ReadonlyArray<EmployeeRow>) => {
  const groups = new Map<string, EmployeeRow[]>();

  rows.forEach((row) => {
    const team = row[1];
    groups.set(team, [...(groups.get(team) ?? []), row]);
  });

  return Array.from(groups.entries()).map(([team, teamMembers]) => ({
    team,
    rows: [...teamMembers].sort((a, b) => b[7] - a[7] || a[2].localeCompare(b[2])),
    totals: buildTotals(teamMembers),
  }));
};

const buildTeamInsights = (rows: ReadonlyArray<EmployeeRow>) =>
  groupRowsByTeam(rows)
    .map((group) => ({
      ...group,
      reviewRows: group.rows.filter((row) => row[7] > 0),
    }))
    .sort((a, b) => b.totals.totalAttrition - a.totals.totalAttrition || a.team.localeCompare(b.team));

const driverLabel = (totals: Totals) => {
  const drivers = [
    ["Absent", totals.absent],
    ["Undertime", totals.undertime],
    ["Late", totals.late],
  ] as const;
  const [label, value] = [...drivers].sort((a, b) => b[1] - a[1])[0];
  return value > 0 ? `${label} is the main driver` : "No attrition driver this week";
};

const TeamActionBoard = ({ teams }: { teams: ReturnType<typeof buildTeamInsights> }) => (
  <section className="rounded-3xl bg-card p-5 shadow-soft">
    <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-bold">Team Leader Action Board</h2>
        <p className="text-sm text-muted-foreground">
          Scan each team for priority, driver, and the CSRs to review.
        </p>
      </div>
      <span className="w-fit rounded-full bg-muted px-3 py-1 text-sm font-bold text-muted-foreground">
        {teams.filter((item) => item.totals.totalAttrition > 0).length} teams with attrition
      </span>
    </div>

    <div className="mt-4 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
      {teams.map((item) => (
        <TeamActionCard key={item.team} item={item} />
      ))}
    </div>
  </section>
);

const TeamActionCard = ({ item }: { item: ReturnType<typeof buildTeamInsights>[number] }) => {
  const { team, rows, reviewRows, totals } = item;
  const topReviewRows = reviewRows.slice(0, 3);

  return (
    <article className="rounded-2xl border border-border bg-background/60 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-extrabold">{team}</h3>
            <TeamHealthPill totalAttrition={totals.totalAttrition} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} CSRs · {formatPercent(attritionRate(totals))} attrition rate
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold text-primary">{totals.totalAttrition}</div>
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">events</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <MiniMetric label="Absent" value={totals.absent} />
        <MiniMetric label="Under" value={totals.undertime} />
        <MiniMetric label="Late" value={totals.late} />
      </div>

      <div className="mt-4 rounded-2xl bg-muted p-3">
        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Suggested focus</div>
        <p className="mt-1 text-sm font-semibold">{driverLabel(totals)}</p>
      </div>

      <div className="mt-4">
        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Review list</div>
        {topReviewRows.length === 0 ? (
          <p className="mt-2 rounded-2xl bg-mint px-3 py-2 text-sm font-bold text-mint-foreground">
            No CSR review needed from attrition data.
          </p>
        ) : (
          <div className="mt-2 space-y-2">
            {topReviewRows.map(([, , employee, , absent, undertime, late, totalAttrition]) => (
              <div key={`${team}-${employee}`} className="flex items-center justify-between gap-3 rounded-2xl bg-muted px-3 py-2 text-sm">
                <span className="font-semibold">{employee}</span>
                <span className="shrink-0 text-xs font-bold text-muted-foreground">
                  {totalAttrition} total · A{absent} U{undertime} L{late}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

const EmployeeDetail = ({ rows }: { rows: ReadonlyArray<EmployeeRow> }) => {
  const groups = groupRowsByTeam(rows);
  const defaultOpenTeams = groups
    .filter(({ totals }) => totals.totalAttrition > 0)
    .map(({ team }) => team);

  return (
    <section className="rounded-3xl bg-card p-5 shadow-soft">
      <div className="flex flex-col gap-2 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold">CSR Drilldown</h2>
          <p className="text-sm text-muted-foreground">
            Open a team only when you need the full CSR-level attendance mix.
          </p>
        </div>
        <span className="w-fit rounded-full bg-muted px-3 py-1 text-sm font-bold text-muted-foreground">
          {rows.length} records
        </span>
      </div>

      {rows.length === 0 ? (
        <EmptyState message="No employee records match the current filters." />
      ) : (
        <Accordion type="multiple" defaultValue={defaultOpenTeams} className="mt-5 space-y-3">
          {groups.map(({ team, rows: teamMembers, totals }) => (
            <AccordionItem
              key={team}
              value={team}
              className="overflow-hidden rounded-2xl border border-border bg-background/60 px-0 shadow-sm"
            >
              <AccordionTrigger className="px-4 py-4 text-left hover:no-underline">
                <div className="flex w-full flex-col gap-3 pr-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold">{team}</h3>
                      <TeamHealthPill totalAttrition={totals.totalAttrition} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {teamMembers.length} CSRs · {totals.totalAttrition} attrition · {formatPercent(attritionRate(totals))} rate
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-bold">
                    <MetricChip label="Absent" value={totals.absent} />
                    <MetricChip label="Undertime" value={totals.undertime} />
                    <MetricChip label="Late" value={totals.late} />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {teamMembers.map((row) => (
                    <CsrReviewCard key={`${row[1]}-${row[2]}`} row={row} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </section>
  );
};

const CsrReviewCard = ({ row }: { row: EmployeeRow }) => {
  const [department, team, employee, onTime, absent, undertime, late, totalAttrition] = row;
  const scheduled = onTime + totalAttrition;
  const onTimeRate = scheduled === 0 ? 0 : onTime / scheduled;
  const needsReview = totalAttrition > 0;
  const highAttention = totalAttrition >= 2;

  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-bold leading-tight">{employee}</h4>
          <p className="mt-1 text-xs text-muted-foreground">{department} · {team}</p>
        </div>
        <StatusPill totalAttrition={totalAttrition} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <MiniMetric label="On Time" value={onTime} />
        <MiniMetric label="Attrition" value={totalAttrition} accent={needsReview} />
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>On-time share</span>
          <span>{formatPercent(onTimeRate)}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full ${highAttention ? "bg-bubblegum" : needsReview ? "bg-sunny" : "bg-mint"}`}
            style={{ width: `${Math.max(onTimeRate * 100, scheduled === 0 ? 0 : 8)}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {totalAttrition === 0 ? (
          <span className="rounded-full bg-mint px-3 py-1 text-xs font-bold text-mint-foreground">
            No attrition recorded
          </span>
        ) : (
          <>
            {absent > 0 && <MetricChip label="Absent" value={absent} />}
            {undertime > 0 && <MetricChip label="Undertime" value={undertime} />}
            {late > 0 && <MetricChip label="Late" value={late} />}
          </>
        )}
      </div>
    </article>
  );
};

const MiniMetric = ({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) => (
  <div className="rounded-xl bg-muted p-3">
    <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className={`mt-1 text-xl font-extrabold ${accent ? "text-primary" : ""}`}>{value}</div>
  </div>
);

const TeamHealthPill = ({ totalAttrition }: { totalAttrition: number }) => {
  if (totalAttrition >= 3) {
    return <span className="rounded-full bg-bubblegum px-3 py-1 text-xs font-bold text-bubblegum-foreground">Needs Attention</span>;
  }

  if (totalAttrition > 0) {
    return <span className="rounded-full bg-sunny px-3 py-1 text-xs font-bold text-sunny-foreground">Has Attrition</span>;
  }

  return <span className="rounded-full bg-mint px-3 py-1 text-xs font-bold text-mint-foreground">Clean Team</span>;
};

const StatusPill = ({ totalAttrition }: { totalAttrition: number }) => {
  if (totalAttrition >= 2) {
    return <span className="rounded-full bg-bubblegum px-3 py-1 text-xs font-bold text-bubblegum-foreground">Priority</span>;
  }

  if (totalAttrition === 1) {
    return <span className="rounded-full bg-sunny px-3 py-1 text-xs font-bold text-sunny-foreground">Review</span>;
  }

  return <span className="rounded-full bg-mint px-3 py-1 text-xs font-bold text-mint-foreground">Clean</span>;
};

const MetricChip = ({ label, value }: { label: string; value: number }) => (
  <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
    {label}: {value}
  </span>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="p-8 text-center text-sm text-muted-foreground">{message}</div>
);

const FilterStat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-2xl bg-muted p-4">
    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
    <div className="mt-1 text-2xl font-extrabold">{value}</div>
  </div>
);

const StatCard = ({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof BarChart3;
  label: string;
  value: number;
  tone: "primary" | "mint" | "bubblegum" | "sunny";
}) => {
  const toneClass = {
    primary: "bg-primary text-primary-foreground",
    mint: "bg-mint text-mint-foreground",
    bubblegum: "bg-bubblegum text-bubblegum-foreground",
    sunny: "bg-sunny text-sunny-foreground",
  }[tone];

  return (
    <div className={`rounded-3xl ${toneClass} p-5 shadow-soft hover-lift`}>
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="mt-2 text-4xl font-extrabold">{value}</p>
    </div>
  );
};

export default CsrAttrition;
