import { Trophy, Sparkles } from "lucide-react";
import {
  SCORECARDS,
  topPerformer,
  attendancePct,
  qualityPct,
  achievementPct,
} from "@/data/scorecards";

const TopPerformerBanner = () => {
  const latestWeek = SCORECARDS[0];
  const top = topPerformer(latestWeek);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-sunny p-6 sm:p-8 shadow-pop">
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
      <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-bubblegum/40 blur-2xl" />

      <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/90 shadow-soft animate-float">
            <Trophy className="h-8 w-8 text-sunny-foreground" />
          </div>
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sunny-foreground/80">
              <Sparkles className="h-3.5 w-3.5" />
              Top Performer of the Week
            </p>
            <h3 className="mt-1 text-3xl font-extrabold text-sunny-foreground">
              {top.member} 🎉
            </h3>
            <p className="text-sm font-medium text-sunny-foreground/80">
              {latestWeek.label} · most efficient CSR
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Stat label="Overall" value={`${top.overallPct.toFixed(2)}%`} />
          <Stat label="Quality" value={`${qualityPct(top).toFixed(0)}%`} />
          <Stat label="Attendance" value={`${attendancePct(top).toFixed(0)}%`} />
          <Stat label="Achievement" value={`${achievementPct(top).toFixed(0)}%`} />
        </div>
      </div>
    </section>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl bg-white/85 px-4 py-2 text-center shadow-soft">
    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
      {label}
    </p>
    <p className="text-xl font-extrabold text-foreground">{value}</p>
  </div>
);

export default TopPerformerBanner;
