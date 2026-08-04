import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  handbookCategories,
  handbookItems,
  handbookSource,
  type HandbookCategory,
  type HandbookItem,
} from "@/data/handbook";
import {
  BookMarked,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categoryStyles: Record<HandbookCategory, string> = {
  Company: "bg-sky text-sky-foreground",
  People: "bg-bubblegum text-bubblegum-foreground",
  Products: "bg-sunny text-sunny-foreground",
  Process: "bg-mint text-mint-foreground",
  Policy: "bg-accent text-accent-foreground",
  Appendix: "bg-secondary text-secondary-foreground",
};

const Handbook = () => {
  const [category, setCategory] = useState<"All" | HandbookCategory>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return handbookItems.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (!q) return true;

      const searchable = [
        item.title,
        item.summary,
        item.category,
        ...item.points,
        ...(item.links?.map((link) => `${link.label} ${link.href}`) ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(q);
    });
  }, [category, query]);

  const counts = useMemo(() => {
    return handbookItems.reduce(
      (acc, item) => {
        acc[item.category] += 1;
        return acc;
      },
      {
        Company: 0,
        People: 0,
        Products: 0,
        Process: 0,
        Policy: 0,
        Appendix: 0,
      } satisfies Record<HandbookCategory, number>
    );
  }, []);

  const hasFilters = category !== "All" || query.trim().length > 0;

  const clearFilters = () => {
    setCategory("All");
    setQuery("");
  };

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-hero p-6 shadow-pop sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-foreground/80 animate-fade-in-down">
              <BookMarked className="h-4 w-4" />
              4AM Media Knowledge Base
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-primary-foreground animate-fade-in sm:text-5xl">
              CSR Handbook
            </h1>
            <p className="mt-3 text-sm leading-6 text-primary-foreground/90 animate-fade-in stagger-1 sm:text-base">
              A searchable rebuild of the 4AM Media CSR manual, organized for fast
              customer support lookup while preserving brand privacy, product facts,
              workflows, policies, and appendix references from the source document.
            </p>
          </div>

          <div className="grid min-w-[240px] grid-cols-2 gap-3 text-primary-foreground">
            <HeroStat label="Sections" value={String(handbookItems.length)} />
            <HeroStat label="Categories" value="6" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <InfoPanel
          icon={ShieldCheck}
          title="Privacy-first replies"
          body="Answer customers only through the relevant brand or product. Keep internal names, locations, and practices private."
        />
        <InfoPanel
          icon={Search}
          title="Fast lookup"
          body="Search across products, workflows, refund guidance, escalation sheets, SKUs, and channel targets."
        />
        <InfoPanel
          icon={FileText}
          title={handbookSource.modified}
          body="The source is a large Office document in Google Drive. This page turns it into a cleaner web manual for the team."
          href={handbookSource.sourceUrl}
        />
      </section>

      <Card className="shadow-soft">
        <CardContent className="space-y-5 pt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the handbook by product, policy, tool, country, SKU, or workflow..."
              className="h-12 rounded-full pl-11"
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Sections
            </div>
            <div className="flex flex-wrap gap-2">
              {handbookCategories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold shadow-soft transition-all",
                    category === item
                      ? item === "All"
                        ? "bg-primary text-primary-foreground"
                        : categoryStyles[item]
                      : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  {item}
                  {item !== "All" && (
                    <span className="ml-2 rounded-full bg-white/50 px-1.5 py-0.5 text-[11px]">
                      {counts[item]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {hasFilters && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
              <span>
                Showing {filtered.length} of {handbookItems.length} handbook sections
              </span>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="rounded-full">
                <X className="mr-1 h-3 w-3" />
                Clear filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No handbook sections match your filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((item, index) => (
            <HandbookCard key={item.id} item={item} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

const HeroStat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-3xl bg-white/20 p-4 shadow-soft backdrop-blur-sm">
    <div className="text-3xl font-extrabold">{value}</div>
    <div className="text-xs font-bold uppercase tracking-widest text-primary-foreground/75">
      {label}
    </div>
  </div>
);

const InfoPanel = ({
  icon: Icon,
  title,
  body,
  href,
}: {
  icon: typeof Sparkles;
  title: string;
  body: string;
  href?: string;
}) => (
  <Card className="hover-lift">
    <CardContent className="flex h-full gap-4 pt-6">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-mint shadow-soft">
        <Icon className="h-5 w-5 text-mint-foreground" />
      </span>
      <div className="space-y-2">
        <h2 className="font-bold">{title}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{body}</p>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Open source <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </CardContent>
  </Card>
);

const HandbookCard = ({ item, index }: { item: HandbookItem; index: number }) => (
  <article
    style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    className="rounded-3xl bg-card p-5 shadow-soft animate-fade-in hover-lift"
  >
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <Badge className={cn("mb-3 rounded-full", categoryStyles[item.category])}>
          {item.category}
        </Badge>
        <h2 className="text-xl font-extrabold">{item.title}</h2>
      </div>
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
        <BookMarked className="h-5 w-5 text-primary" />
      </span>
    </div>

    <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.summary}</p>

    <ul className="mt-4 space-y-2 text-sm leading-6">
      {item.points.map((point) => (
        <li key={point} className="flex gap-2">
          <Sparkles className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" />
          <span>{point}</span>
        </li>
      ))}
    </ul>

    {item.links && item.links.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
        {item.links.map((link) => (
          <a
            key={`${item.id}-${link.href}`}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <LinkIcon className="h-3 w-3" />
            {link.label}
          </a>
        ))}
      </div>
    )}

    {item.table && (
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[620px] text-sm">
          <thead className={cn("text-xs uppercase tracking-wide", categoryStyles[item.category])}>
            <tr>
              {item.table.columns.map((column) => (
                <th key={column} className="p-3 text-left font-extrabold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {item.table.rows.map((row) => (
              <tr key={row.join("-")} className="border-t border-border">
                {row.map((cell, index) => (
                  <td
                    key={`${row[0]}-${index}`}
                    className={cn(
                      "p-3 align-top leading-6",
                      index === 0 ? "font-bold text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </article>
);

export default Handbook;