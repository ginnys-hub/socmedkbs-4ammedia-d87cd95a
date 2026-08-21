import { useMemo } from "react";
import { AlertTriangle, CalendarDays, CheckCircle2, Clock, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useScorecardEntries, useScorecardWeeks } from "@/hooks/useContent";
import { attendancePct } from "@/lib/scorecardMath";

const formatHours = (value: number) =>
  Number(value).toLocaleString("en", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

const Schedule = () => {
  const { data: weeks, isLoading: loadingWeeks } = useScorecardWeeks();
  const currentWeek = weeks?.find((week) => week.is_current) ?? weeks?.[0];
  const { data: entries, isLoading: loadingEntries } = useScorecardEntries(currentWeek?.id);

  const sortedEntries = useMemo(
    () => [...(entries ?? [])].sort((a, b) => a.member.localeCompare(b.member)),
    [entries]
  );

  const totals = useMemo(() => {
    const scheduled = sortedEntries.reduce((sum, entry) => sum + Number(entry.hours_scheduled), 0);
    const worked = sortedEntries.reduce((sum, entry) => sum + Number(entry.hours_worked), 0);
    return {
      scheduled,
      worked,
      attendance: scheduled > 0 ? (worked / scheduled) * 100 : 0,
    };
  }, [sortedEntries]);

  if (loadingWeeks || loadingEntries) {
    return <Skeleton className="h-96 rounded-3xl" />;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-sky p-6 shadow-pop sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 shadow-soft animate-float">
              <CalendarDays className="h-5 w-5 text-sky-foreground" />
            </span>
            <div>
              <h1 className="text-3xl font-extrabold text-sky-foreground">Team Schedule</h1>
              <p className="text-sm text-sky-foreground/80">
                {currentWeek ? currentWeek.label : "No current schedule week"}
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-white/85 px-4 py-2 text-right text-sky-foreground shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wider opacity-75">Roster</p>
            <p className="text-2xl font-extrabold">{sortedEntries.length}</p>
          </div>
        </div>
      </div>

      {!currentWeek || sortedEntries.length === 0 ? (
        <div className="rounded-3xl bg-muted p-8 text-center text-muted-foreground">
          <AlertTriangle className="mx-auto mb-2 h-6 w-6" />
          No schedule data has been added yet.
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <SummaryCard
              label="Scheduled hours"
              value={formatHours(totals.scheduled)}
              icon={CalendarDays}
              tone="bg-primary text-primary-foreground"
            />
            <SummaryCard
              label="Worked hours"
              value={formatHours(totals.worked)}
              icon={Clock}
              tone="bg-mint text-mint-foreground"
            />
            <SummaryCard
              label="Attendance"
              value={`${totals.attendance.toFixed(0)}%`}
              icon={Users}
              tone="bg-sunny text-sunny-foreground"
            />
          </div>

          <section className="overflow-hidden rounded-3xl bg-card shadow-soft">
            <div className="border-b border-border p-5">
              <h2 className="text-xl font-extrabold">Weekly Roster</h2>
              <p className="text-sm text-muted-foreground">
                Scheduled hours are pulled from the current weekly scorecard.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="p-3 text-left">Team member</th>
                    <th className="p-3 text-right">Scheduled</th>
                    <th className="p-3 text-right">Worked</th>
                    <th className="p-3 text-right">Attendance</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEntries.map((entry) => {
                    const attendance = attendancePct(entry);
                    const status = attendance >= 100 ? "On track" : attendance >= 95 ? "Close" : "Needs review";
                    return (
                      <tr key={entry.id} className="border-t border-border">
                        <td className="p-3 font-semibold">{entry.member}</td>
                        <td className="p-3 text-right">{formatHours(Number(entry.hours_scheduled))}h</td>
                        <td className="p-3 text-right">{formatHours(Number(entry.hours_worked))}h</td>
                        <td className="p-3 text-right font-bold">{attendance.toFixed(2)}%</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

const SummaryCard = ({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof CalendarDays;
  tone: string;
}) => (
  <div className={`rounded-3xl p-5 shadow-soft ${tone}`}>
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    <p className="mt-1 text-3xl font-extrabold">{value}</p>
  </div>
);

export default Schedule;
