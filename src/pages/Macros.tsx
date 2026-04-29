import { useMemo, useState } from "react";
import { BRANDS, MACROS, type Brand } from "@/data/macros";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check, Search, MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const brandStyles: Record<Brand, string> = {
  "General / All Brands": "bg-sky text-sky-foreground",
  "Brand A": "bg-bubblegum text-bubblegum-foreground",
  "Brand B": "bg-mint text-mint-foreground",
  "Brand C": "bg-sunny text-sunny-foreground",
};

const Macros = () => {
  const [activeBrand, setActiveBrand] = useState<Brand | "All">("All");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return MACROS.filter((m) => {
      const brandOk = activeBrand === "All" || m.brand === activeBrand;
      if (!brandOk) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.body.toLowerCase().includes(q) ||
        m.tags?.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [activeBrand, query]);

  const copy = async (id: string, body: string) => {
    try {
      await navigator.clipboard.writeText(body);
      setCopiedId(id);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      toast.error("Couldn't copy. Try again.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-bubblegum p-6 sm:p-8 shadow-pop">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 shadow-soft">
            <MessageSquareText className="h-5 w-5 text-bubblegum-foreground" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold text-bubblegum-foreground">
              Macros
            </h1>
            <p className="text-sm text-bubblegum-foreground/80">
              Pre-written responses, filtered by brand. One click to copy.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search macros by keyword, title, or tag..."
            className="h-12 rounded-full pl-11"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <BrandChip
            active={activeBrand === "All"}
            onClick={() => setActiveBrand("All")}
            label="All"
            tone="bg-primary text-primary-foreground"
          />
          {BRANDS.map((b) => (
            <BrandChip
              key={b}
              active={activeBrand === b}
              onClick={() => setActiveBrand(b)}
              label={b}
              tone={brandStyles[b]}
            />
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="rounded-3xl bg-muted p-8 text-center text-muted-foreground">
          No macros match your filters.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((m) => (
            <article
              key={m.id}
              className="flex flex-col rounded-3xl bg-card p-5 shadow-soft transition-transform hover:-translate-y-1"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${brandStyles[m.brand]}`}
                >
                  {m.brand}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copy(m.id, m.body)}
                  className="rounded-full"
                >
                  {copiedId === m.id ? (
                    <>
                      <Check className="mr-1 h-4 w-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1 h-4 w-4" /> Copy
                    </>
                  )}
                </Button>
              </div>
              <h3 className="text-lg font-bold">{m.title}</h3>
              <p className="mt-2 flex-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {m.body}
              </p>
              {m.tags && m.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {m.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

const BrandChip = ({
  active,
  onClick,
  label,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  tone: string;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "rounded-full px-4 py-2 text-sm font-semibold shadow-soft transition-all",
      active ? `${tone} scale-105` : "bg-card text-foreground hover:bg-muted"
    )}
  >
    {label}
  </button>
);

export default Macros;
