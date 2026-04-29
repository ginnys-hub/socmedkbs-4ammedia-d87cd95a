import { useAnnouncements } from "@/hooks/useContent";
import { Megaphone, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const fmtDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const palette = [
  "bg-secondary text-secondary-foreground",
  "bg-accent text-accent-foreground",
  "bg-mint text-mint-foreground",
  "bg-sky text-sky-foreground",
];

const AnnouncementsBoard = () => {
  const { data: announcements, isLoading } = useAnnouncements();

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

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>
      ) : !announcements || announcements.length === 0 ? (
        <p className="rounded-3xl bg-muted p-8 text-center text-muted-foreground">
          No announcements yet.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {announcements.map((a, i) => (
            <article
              key={a.id}
              className={`rounded-3xl ${palette[i % palette.length]} p-6 shadow-soft transition-transform hover:-translate-y-1`}
            >
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold">
                <Calendar className="h-3.5 w-3.5" />
                {fmtDate(a.posted_on)}
              </div>
              <h3 className="mb-2 text-lg font-bold">{a.title}</h3>
              <p className="whitespace-pre-line text-sm leading-relaxed opacity-90">
                {a.body}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default AnnouncementsBoard;
