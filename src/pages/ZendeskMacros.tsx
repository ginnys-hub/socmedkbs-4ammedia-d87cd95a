import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Check, Copy, FolderTree, MessageSquareText, Search } from "lucide-react";
import { toast } from "sonner";

type Macro = {
  id: string;
  fullPath: string;
  content: string;
  category: string;
  subcategory: string;
  subSubcategory: string;
  name: string;
  active: boolean;
  parts: string[];
};

type GvizCell = { v?: string | boolean | number | null; f?: string } | null;
type GvizResponse = {
  status: string;
  errors?: Array<{ detailed_message?: string; message?: string }>;
  table: {
    cols: Array<{ label: string }>;
    rows: Array<{ c: GvizCell[] }>;
  };
};

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1drFwRn6KxzbLDjmxrUJ3gmZddm3bvZbn/gviz/tq?gid=828350250&tqx=responseHandler:__zendeskMacroCallback";

const categoryStyles: Record<string, string> = {
  Fallback: "bg-sky text-sky-foreground",
  "Order Inquiry": "bg-bubblegum text-bubblegum-foreground",
  "Product Question": "bg-mint text-mint-foreground",
  Refund: "bg-sunny text-sunny-foreground",
};

declare global {
  interface Window {
    __zendeskMacroCallback?: (response: GvizResponse) => void;
  }
}

const valueAt = (row: GvizCell[], headers: Record<string, number>, label: string) => {
  const cell = row[headers[label]];
  const value = cell?.v ?? cell?.f ?? "";
  return String(value);
};

async function loadMacros(): Promise<Macro[]> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SHEET_URL;
    script.async = true;

    const cleanup = () => {
      delete window.__zendeskMacroCallback;
      script.remove();
    };

    window.__zendeskMacroCallback = (response) => {
      cleanup();

      if (response.status !== "ok") {
        reject(new Error(response.errors?.[0]?.detailed_message ?? response.errors?.[0]?.message ?? "Unable to load Zendesk macros."));
        return;
      }

      const headers = response.table.cols.reduce<Record<string, number>>((acc, col, index) => {
        if (col.label) acc[col.label] = index;
        return acc;
      }, {});

      const macros = response.table.rows
        .map((row, index) => {
          const fullPath = valueAt(row.c, headers, "Full Path");
          if (!fullPath) return null;

          const parts = fullPath.split("::").map((part) => part.trim()).filter(Boolean);
          const activeValue = row.c[headers.Active]?.v;

          return {
            id: `zendesk-macro-${index}`,
            fullPath,
            content: valueAt(row.c, headers, "Macro Content"),
            category: valueAt(row.c, headers, "Category") || parts[0] || "Uncategorized",
            subcategory: valueAt(row.c, headers, "Subcategory"),
            subSubcategory: valueAt(row.c, headers, "Sub-Subcategory"),
            name: valueAt(row.c, headers, "Macro Name") || parts[parts.length - 1] || fullPath,
            active: activeValue === true || activeValue === "TRUE" || activeValue === "True",
            parts,
          } satisfies Macro;
        })
        .filter((macro): macro is Macro => Boolean(macro));

      resolve(macros);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Unable to load Zendesk macros from the source sheet."));
    };

    document.body.appendChild(script);
  });
}

const ZendeskMacros = () => {
  const [macros, setMacros] = useState<Macro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSubcategory, setActiveSubcategory] = useState("All");
  const [activeOnly, setActiveOnly] = useState(true);
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadMacros()
      .then(setMacros)
      .catch((error: Error) => setLoadError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(macros.map((macro) => macro.category).filter(Boolean)));
  }, [macros]);

  const subcategories = useMemo(() => {
    const visible = activeCategory === "All" ? macros : macros.filter((macro) => macro.category === activeCategory);
    return Array.from(new Set(visible.map((macro) => macro.subcategory).filter(Boolean)));
  }, [activeCategory, macros]);

  const filtered = useMemo(() => {
    return macros.filter((macro) => {
      if (activeOnly && !macro.active) return false;
      if (activeCategory !== "All" && macro.category !== activeCategory) return false;
      if (activeSubcategory !== "All" && macro.subcategory !== activeSubcategory) return false;
      if (!query.trim()) return true;

      const q = query.toLowerCase();
      return (
        macro.name.toLowerCase().includes(q) ||
        macro.content.toLowerCase().includes(q) ||
        macro.fullPath.toLowerCase().includes(q) ||
        macro.parts.some((part) => part.toLowerCase().includes(q))
      );
    });
  }, [activeCategory, activeOnly, activeSubcategory, macros, query]);

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

  const selectCategory = (category: string) => {
    setActiveCategory(category);
    setActiveSubcategory("All");
  };

  if (loadError) {
    return (
      <div className="rounded-3xl bg-muted p-8 text-center text-muted-foreground">
        {loadError}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-bubblegum p-6 sm:p-8 shadow-pop animate-scale-in">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 shadow-soft animate-float">
            <MessageSquareText className="h-5 w-5 text-bubblegum-foreground" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold text-bubblegum-foreground animate-fade-in-down">Zendesk Macros</h1>
            <p className="text-sm text-bubblegum-foreground/80 animate-fade-in stagger-1">
              Zendesk macro responses from the workbook. Filter by macro tree, then copy.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Zendesk macros by keyword, path, or content..."
            className="h-12 rounded-full pl-11"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <MacroTreeChip
            active={activeCategory === "All"}
            onClick={() => selectCategory("All")}
            label="All"
            count={activeOnly ? macros.filter((macro) => macro.active).length : macros.length}
            tone="bg-primary text-primary-foreground"
          />
          {categories.map((category) => {
            const categoryMacros = macros.filter((macro) => macro.category === category);
            const count = activeOnly ? categoryMacros.filter((macro) => macro.active).length : categoryMacros.length;

            return (
              <MacroTreeChip
                key={category}
                active={activeCategory === category}
                onClick={() => selectCategory(category)}
                label={category}
                count={count}
                tone={categoryStyles[category] ?? "bg-muted text-foreground"}
              />
            );
          })}
          <MacroTreeChip
            active={!activeOnly}
            onClick={() => setActiveOnly((value) => !value)}
            label={activeOnly ? "Active only" : "All statuses"}
            tone="bg-card text-foreground"
          />
        </div>

        {subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <MacroTreeChip
              active={activeSubcategory === "All"}
              onClick={() => setActiveSubcategory("All")}
              label="All Subcategories"
              tone="bg-primary text-primary-foreground"
            />
            {subcategories.map((subcategory) => (
              <MacroTreeChip
                key={subcategory}
                active={activeSubcategory === subcategory}
                onClick={() => setActiveSubcategory(subcategory)}
                label={subcategory}
                tone="bg-card text-foreground"
              />
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-3xl bg-muted p-8 text-center text-muted-foreground">
          No Zendesk macros match your filters.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((macro, i) => (
            <article
              key={macro.id}
              style={{ animationDelay: `${i * 35}ms` }}
              className="flex flex-col rounded-3xl bg-card p-5 shadow-soft animate-fade-in hover-lift"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${categoryStyles[macro.category] ?? "bg-muted text-foreground"}`}
                >
                  {macro.category}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copy(macro.id, macro.content)}
                  className="rounded-full"
                >
                  {copiedId === macro.id ? (
                    <><Check className="mr-1 h-4 w-4" /> Copied</>
                  ) : (
                    <><Copy className="mr-1 h-4 w-4" /> Copy</>
                  )}
                </Button>
              </div>
              <div className="mb-2 flex items-start gap-2">
                <FolderTree className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-xs font-medium leading-relaxed text-muted-foreground">
                  {macro.fullPath}
                </p>
              </div>
              <h3 className="text-lg font-bold">{macro.name}</h3>
              <p className="mt-2 flex-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {macro.content}
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                {macro.subcategory && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    #{macro.subcategory}
                  </span>
                )}
                {macro.subSubcategory && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    #{macro.subSubcategory}
                  </span>
                )}
                {!macro.active && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    #inactive
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

const MacroTreeChip = ({
  active,
  onClick,
  label,
  tone,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  tone: string;
  count?: number;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "rounded-full px-4 py-2 text-sm font-semibold shadow-soft transition-all",
      active ? `${tone} scale-105` : "bg-card text-foreground hover:bg-muted"
    )}
  >
    <span>{label}</span>
    {typeof count === "number" && <span className="ml-2 opacity-70">{count}</span>}
  </button>
);

export default ZendeskMacros;
