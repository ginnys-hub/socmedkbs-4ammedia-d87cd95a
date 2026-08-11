import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  UserX,
  UsersRound,
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

const teamRows = [
  { team: "TEAM CESS", employees: 6, onTime: 28, absent: 0, undertime: 2, late: 0, totalAttrition: 2 },
  { team: "TEAM BRAI", employees: 10, onTime: 45, absent: 0, undertime: 2, late: 0, totalAttrition: 2 },
  { team: "TEAM DANIELLE", employees: 8, onTime: 37, absent: 0, undertime: 1, late: 0, totalAttrition: 1 },
  { team: "TEAM YURIE", employees: 6, onTime: 25, absent: 0, undertime: 0, late: 0, totalAttrition: 0 },
  { team: "TEAM NOBI", employees: 6, onTime: 35, absent: 2, undertime: 0, late: 0, totalAttrition: 2 },
  { team: "TEAM GEORGINA", employees: 6, onTime: 31, absent: 1, undertime: 0, late: 2, totalAttrition: 3 },
];

const departmentRows = [
  { department: "Call Team", employees: 24, onTime: 110, absent: 0, undertime: 5, late: 0, totalAttrition: 5 },
  { department: "Email Team", employees: 12, onTime: 60, absent: 2, undertime: 0, late: 0, totalAttrition: 2 },
  { department: "Social Media Team", employees: 6, onTime: 31, absent: 1, undertime: 0, late: 2, totalAttrition: 3 },
];

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

const attritionEmployeeRows = employeeRows.filter(
  ([, , , , , , , totalAttrition]) => totalAttrition > 0
);

const attritionRate = (row: { onTime: number; totalAttrition: number }) => {
  const scheduled = row.onTime + row.totalAttrition;
  return scheduled === 0 ? 0 : row.totalAttrition / scheduled;
};

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

const CsrAttrition = () => {
  const chartData = teamRows.map((row) => ({
    team: row.team.replace("TEAM ", ""),
    attrition: row.totalAttrition,
  }));

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-mint p-6 shadow-pop sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mint-foreground/80">
              <BarChart3 className="h-4 w-4" />
              CSR Department Attrition
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-mint-foreground sm:text-5xl">
              Attrition Report
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={UsersRound} label="Employees Included" value={summary.employeesIncluded} tone="primary" />
        <StatCard icon={UserX} label="Employees Excluded" value={summary.employeesExcluded} tone="bubblegum" />
        <StatCard icon={CheckCircle2} label="On-time Marks" value={summary.onTime} tone="mint" />
        <StatCard icon={AlertTriangle} label="Total Attrition" value={summary.totalAttrition} tone="sunny" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-card p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h2 className="font-bold">Attrition by team</h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="team" stroke="hsl(var(--muted-foreground))" />
                <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--card))",
                  }}
                />
                <Bar dataKey="attrition" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl bg-card p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <h2 className="font-bold">Report totals</h2>
          </div>
          <div className="grid gap-3 text-sm">
            <SummaryRow label="Absent" value={summary.absent} />
            <SummaryRow label="Undertime" value={summary.undertime} />
            <SummaryRow label="Late" value={summary.late} />
            <SummaryRow label="Total Attrition" value={summary.totalAttrition} strong />
            <SummaryRow
              label="Overall Attrition Rate"
              value={formatPercent(summary.totalAttrition / (summary.onTime + summary.totalAttrition))}
              strong
            />
          </div>
        </div>
      </section>

      <ReportTable
        title="Department Summary"
        rows={departmentRows}
        firstColumn="Department"
        firstKey="department"
      />

      <ReportTable title="Team Summary" rows={teamRows} firstColumn="Team" firstKey="team" />

      <AttritionCommitters rows={attritionEmployeeRows} />

      <section className="overflow-x-auto rounded-3xl bg-card shadow-soft">
        <div className="flex items-center justify-between gap-3 border-b border-border p-5">
          <div>
            <h2 className="font-bold">Employee Detail</h2>
            <p className="text-sm text-muted-foreground">
              Total Attrition equals absent plus undertime plus late.
            </p>
          </div>
        </div>
        <table className="w-full min-w-[860px] text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Team</th>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-right">On Time</th>
              <th className="p-3 text-right">Absent</th>
              <th className="p-3 text-right">Undertime</th>
              <th className="p-3 text-right">Late</th>
              <th className="p-3 text-right">Total Attrition</th>
            </tr>
          </thead>
          <tbody>
            {employeeRows.map(([department, team, employee, onTime, absent, undertime, late, totalAttrition]) => (
              <tr key={`${team}-${employee}`} className="border-t border-border transition-colors hover:bg-muted/40">
                <td className="p-3 text-muted-foreground">{department}</td>
                <td className="p-3 font-medium">{team}</td>
                <td className="p-3 font-semibold">{employee}</td>
                <td className="p-3 text-right">{onTime}</td>
                <td className="p-3 text-right">{absent}</td>
                <td className="p-3 text-right">{undertime}</td>
                <td className="p-3 text-right">{late}</td>
                <td className="p-3 text-right font-bold text-primary">{totalAttrition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

type RowWithTotals = {
  employees: number;
  onTime: number;
  absent: number;
  undertime: number;
  late: number;
  totalAttrition: number;
};

type ReportTableProps<T extends RowWithTotals> = {
  title: string;
  rows: T[];
  firstColumn: string;
  firstKey: keyof T;
};

const ReportTable = <T extends RowWithTotals>({
  title,
  rows,
  firstColumn,
  firstKey,
}: ReportTableProps<T>) => (
  <section className="overflow-x-auto rounded-3xl bg-card shadow-soft">
    <div className="border-b border-border p-5">
      <h2 className="font-bold">{title}</h2>
    </div>
    <table className="w-full min-w-[760px] text-sm">
      <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
        <tr>
          <th className="p-3 text-left">{firstColumn}</th>
          <th className="p-3 text-right">Employees</th>
          <th className="p-3 text-right">On Time</th>
          <th className="p-3 text-right">Absent</th>
          <th className="p-3 text-right">Undertime</th>
          <th className="p-3 text-right">Late</th>
          <th className="p-3 text-right">Total Attrition</th>
          <th className="p-3 text-right">Rate</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={String(row[firstKey])} className="border-t border-border transition-colors hover:bg-muted/40">
            <td className="p-3 font-semibold">{String(row[firstKey])}</td>
            <td className="p-3 text-right">{row.employees}</td>
            <td className="p-3 text-right">{row.onTime}</td>
            <td className="p-3 text-right">{row.absent}</td>
            <td className="p-3 text-right">{row.undertime}</td>
            <td className="p-3 text-right">{row.late}</td>
            <td className="p-3 text-right font-bold text-primary">{row.totalAttrition}</td>
            <td className="p-3 text-right">{formatPercent(attritionRate(row))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);

const AttritionCommitters = ({ rows }: { rows: ReadonlyArray<(typeof employeeRows)[number]> }) => (
  <section className="overflow-x-auto rounded-3xl bg-card shadow-soft">
    <div className="flex items-center justify-between gap-3 border-b border-border p-5">
      <div>
        <h2 className="font-bold">CSRs with Attrition</h2>
        <p className="text-sm text-muted-foreground">
          Employees with at least one absent, undertime, or late mark during the report week.
        </p>
      </div>
      <span className="rounded-full bg-muted px-3 py-1 text-sm font-bold text-muted-foreground">
        {rows.length} CSRs
      </span>
    </div>
    <table className="w-full min-w-[820px] text-sm">
      <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
        <tr>
          <th className="p-3 text-left">CSR</th>
          <th className="p-3 text-left">Department</th>
          <th className="p-3 text-left">Team</th>
          <th className="p-3 text-right">Absent</th>
          <th className="p-3 text-right">Undertime</th>
          <th className="p-3 text-right">Late</th>
          <th className="p-3 text-right">Total Attrition</th>
          <th className="p-3 text-right">Rate</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([department, team, employee, onTime, absent, undertime, late, totalAttrition]) => (
          <tr key={`${team}-${employee}-attrition`} className="border-t border-border transition-colors hover:bg-muted/40">
            <td className="p-3 font-semibold">{employee}</td>
            <td className="p-3 text-muted-foreground">{department}</td>
            <td className="p-3 font-medium">{team}</td>
            <td className="p-3 text-right">{absent}</td>
            <td className="p-3 text-right">{undertime}</td>
            <td className="p-3 text-right">{late}</td>
            <td className="p-3 text-right font-bold text-primary">{totalAttrition}</td>
            <td className="p-3 text-right">{formatPercent(attritionRate({ onTime, totalAttrition }))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);

const SummaryRow = ({ label, value, strong = false }: { label: string; value: string | number; strong?: boolean }) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted px-4 py-3">
    <span className="text-muted-foreground">{label}</span>
    <span className={strong ? "text-lg font-extrabold text-primary" : "font-bold"}>{value}</span>
  </div>
);

const toneMap = {
  primary: "bg-primary text-primary-foreground",
  mint: "bg-mint text-mint-foreground",
  bubblegum: "bg-bubblegum text-bubblegum-foreground",
  sunny: "bg-sunny text-sunny-foreground",
} as const;

const StatCard = ({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof BarChart3;
  label: string;
  value: number;
  tone: keyof typeof toneMap;
}) => (
  <div className={`rounded-3xl ${toneMap[tone]} p-5 shadow-soft hover-lift`}>
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    <p className="mt-2 text-4xl font-extrabold">{value}</p>
  </div>
);

export default CsrAttrition;
