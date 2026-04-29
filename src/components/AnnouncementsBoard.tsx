import { useMemo, useState } from "react";
import { useAnnouncements, type AnnouncementCategory } from "@/hooks/useContent";
import { Megaphone, Calendar, AlertTriangle, CheckCircle2, Star, Bell } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const fmtDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

type CatKey = AnnouncementCategory;

const CATEGORIES: {
  key: CatKey;
  label: string;
  icon: typeof Bell;
  card: string;
  chip: string;
}[] = [
  {
    key: "update",
    label: "Update",
    icon: Bell,
    card: "bg-sky text-sky-foreground",
    chip: "bg-sky text-sky-foreground",
  },
  {
    key: "important",
    label: "Important",
    icon: Star,
    card: "bg-accent text-accent-foreground",
    chip: "bg-accent text-accent-foreground",
  },
  {
    key: "issue",
    label: "Issue",
    icon: AlertTriangle,
    card: "bg-secondary text-secondary-foreground",
    chip: "bg-secondary text-secondary-foreground",
  },
  {
    key: "resolved",
    label: "Resolved",
    icon: CheckCircle2,
    card: "bg-mint text-mint-foreground",
    chip: "bg-mint text-mint-foreground",
  },
];

const catMeta = (key: string) =>
  CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[0];

const AnnouncementsBoard = () => {
  const { data: announcements, isLoading } = useAnnouncements();
  const [filter, setFilter] = useState<CatKey | "all">("all");

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: announcements?.length ?? 0 };
    (announcements ?? []).forEach((a) => {
      map[a.category] = (map[a.category] ?? 0) + 1;
    });
    return map;
  }, [announcements]);

  const filtered = (announcements ?? []).filter(
    (a) => filter === "all" || a.category === filter
  );

  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-hero shadow-soft">
          <Megaphone className="h-5 w-5 text-primary-foreground" />
        </span>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Announcements & Updates
          </h2>
          <p className="text-sm text-muted-foreground">
            Latest news from the team lead
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-2">
        <FilterChip
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="All"
          count={counts.all ?? 0}
          className="bg-muted text-foreground"
        />
        {CATEGORIES.map((c) => (
          <FilterChip
            key={c.key}
            active={filter === c.key}
            onClick={() => setFilter(c.key)}
            label={c.label}
            icon={c.icon}
            count={counts[c.key] ?? 0}
            className={c.chip}
          />
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-3xl bg-muted p-8 text-center text-muted-foreground">
          No announcements in this filter.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((a, i) => {
            const meta = catMeta(a.category);
            const Icon = meta.icon;
            const cardPalette = [
              "bg-sky text-sky-foreground",
              "bg-accent text-accent-foreground",
              "bg-mint text-mint-foreground",
              "bg-secondary text-secondary-foreground",
            ];
            const cardColor = cardPalette[i % cardPalette.length];
            return (
              <article
                key={a.id}
                className={`rounded-3xl ${cardColor} p-6 shadow-soft transition-transform hover:-translate-y-1`}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-xs font-bold uppercase tracking-wide text-foreground">
                    <Icon className="h-3.5 w-3.5" />
                    {meta.label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {fmtDate(a.posted_on)}
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-extrabold leading-snug">
                  {a.title}
                </h3>
                <p className="whitespace-pre-line text-base font-medium leading-relaxed">
                  {a.body}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

const FilterChip = ({
  active,
  onClick,
  label,
  icon: Icon,
  count,
  className,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: typeof Bell;
  count: number;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold transition-all",
      active
        ? `${className} shadow-soft scale-105`
        : "bg-muted text-muted-foreground hover:bg-muted/70"
    )}
  >
    {Icon && <Icon className="h-3.5 w-3.5" />}
    {label}
    <span
      className={cn(
        "ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-extrabold",
        active ? "bg-white/80 text-foreground" : "bg-background/60"
      )}
    >
      {count}
    </span>
  </button>
);

export default AnnouncementsBoard;
