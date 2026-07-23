import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, CheckCircle2, ChevronRight, CircleSlash, Copy, FolderTree, MessageSquareText, Search } from "lucide-react";
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
type TreeNode = { label: string; path: string; count: number; active: number; children: TreeNode[] };

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1drFwRn6KxzbLDjmxrUJ3gmZddm3bvZbn/gviz/tq?gid=828350250&tqx=responseHandler:__zendeskMacroCallback";

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
            id: `macro-${index}`,
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

const buildTree = (macros: Macro[]) => {
  const root: TreeNode = { label: "All Zendesk Macros", path: "", count: 0, active: 0, children: [] };

  macros.forEach((macro) => {
    let node = root;
    node.count += 1;
    if (macro.active) node.active += 1;

    macro.parts.forEach((part, index) => {
      const path = macro.parts.slice(0, index + 1).join("::");
      let child = node.children.find((item) => item.label === part);

      if (!child) {
        child = { label: part, path, count: 0, active: 0, children: [] };
        node.children.push(child);
        node.children.sort((a, b) => a.label.localeCompare(b.label));
      }

      child.count += 1;
      if (macro.active) child.active += 1;
      node = child;
    });
  });

  return root;
};

const flattenTree = (node: TreeNode, depth = 0): Array<TreeNode & { depth: number }> => [
  { ...node, depth },
  ...node.children.flatMap((child) => flattenTree(child, depth + 1)),
];

const ZendeskMacros = () => {
  const [macros, setMacros] = useState<Macro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeOnly, setActiveOnly] = useState(true);
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadMacros()
      .then((data) => {
        setMacros(data);
        setSelectedId(data[0]?.id ?? "");
      })
      .catch((error: Error) => setLoadError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  const tree = useMemo(() => buildTree(macros), [macros]);
  const treeRows = useMemo(() => flattenTree(tree), [tree]);
  const activeCount = useMemo(() => macros.filter((macro) => macro.active).length, [macros]);

  const filteredMacros = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return macros.filter((macro) => {
      if (activeOnly && !macro.active) return false;
      if (selectedPath && !macro.fullPath.startsWith(selectedPath)) return false;
      if (!normalizedQuery) return true;

      return [macro.fullPath, macro.name, macro.category, macro.subcategory, macro.subSubcategory, macro.content]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [activeOnly, macros, query, selectedPath]);

  const selectedMacro = useMemo(() => {
    return filteredMacros.find((macro) => macro.id === selectedId) ?? filteredMacros[0] ?? macros[0];
  }, [filteredMacros, macros, selectedId]);

  const copyMacro = async (macro: Macro) => {
    await navigator.clipboard.writeText(macro.content);
    setCopiedId(macro.id);
    toast.success("Macro content copied");
    window.setTimeout(() => setCopiedId(null), 1200);
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl border bg-card p-8 text-center shadow-soft">
        <FolderTree className="mx-auto h-10 w-10 animate-pulse text-primary" />
        <p className="mt-4 font-medium">Loading Zendesk macros...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-3xl border border-destructive/30 bg-card p-8 text-center shadow-soft">
        <h1 className="text-2xl font-bold">Zendesk Macros</h1>
        <p className="mt-3 text-muted-foreground">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-bubblegum p-8 text-bubblegum-foreground shadow-soft">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/25 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
              <FolderTree className="h-4 w-4" />
              Zendesk Macros
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Zendesk macro library</h1>
              <p className="mt-3 text-lg opacity-90">
                Browse the full Zendesk macro tree from the reference workbook, including the actual macro response content.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center sm:min-w-[360px]">
            <Stat value={macros.length} label="Total" />
            <Stat value={activeCount} label="Active" />
            <Stat value={tree.children.length} label="Groups" />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[320px_minmax(360px,0.85fr)_minmax(420px,1.15fr)]">
        <aside className="space-y-4 rounded-3xl border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Macro Tree</h2>
              <p className="text-sm text-muted-foreground">Filter by category path</p>
            </div>
            <Badge variant="secondary">{tree.count}</Badge>
          </div>
          <div className="max-h-[680px] space-y-1 overflow-auto pr-1">
            {treeRows.map((node) => (
              <button
                key={node.path || "root"}
                type="button"
                onClick={() => setSelectedPath(node.path)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2 text-left text-sm transition-all hover:bg-muted",
                  selectedPath === node.path && "bg-primary text-primary-foreground shadow-soft"
                )}
                style={{ paddingLeft: `${12 + node.depth * 14}px` }}
              >
                <span className="flex min-w-0 items-center gap-2">
                  {node.depth > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />}
                  <span className="truncate font-medium">{node.label}</span>
                </span>
                <span className="shrink-0 rounded-full bg-background/60 px-2 py-0.5 text-xs text-foreground">
                  {activeOnly ? node.active : node.count}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-4 rounded-3xl border bg-card p-5 shadow-soft">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Macros</h2>
                <p className="text-sm text-muted-foreground">{selectedPath || "All Zendesk Macros"}</p>
              </div>
              <Badge>{filteredMacros.length}</Badge>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search path, name, or macro content..."
                className="pl-9"
              />
            </div>
            <Button
              type="button"
              variant={activeOnly ? "default" : "outline"}
              onClick={() => setActiveOnly((value) => !value)}
              className="w-full justify-center gap-2"
            >
              {activeOnly ? <CheckCircle2 className="h-4 w-4" /> : <CircleSlash className="h-4 w-4" />}
              {activeOnly ? "Showing active macros" : "Showing all macros"}
            </Button>
          </div>

          <div className="max-h-[560px] space-y-2 overflow-auto pr-1">
            {filteredMacros.map((macro) => (
              <button
                key={macro.id}
                type="button"
                onClick={() => setSelectedId(macro.id)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition-all hover:border-primary/50 hover:bg-muted/60",
                  selectedMacro?.id === macro.id && "border-primary bg-primary/5 shadow-soft"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{macro.name}</div>
                    <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{macro.fullPath}</div>
                  </div>
                  <Badge variant={macro.active ? "default" : "secondary"}>
                    {macro.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm text-muted-foreground">
                  {macro.content}
                </p>
              </button>
            ))}
            {filteredMacros.length === 0 && (
              <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                No macros match the current filters.
              </div>
            )}
          </div>
        </div>

        <article className="rounded-3xl border bg-card p-6 shadow-soft">
          {selectedMacro ? (
            <div className="space-y-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={selectedMacro.active ? "default" : "secondary"}>
                      {selectedMacro.active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">{selectedMacro.category}</Badge>
                  </div>
                  <h2 className="text-2xl font-bold">{selectedMacro.name}</h2>
                  <p className="break-words text-sm text-muted-foreground">{selectedMacro.fullPath}</p>
                </div>
                <Button type="button" onClick={() => copyMacro(selectedMacro)} className="gap-2 sm:shrink-0">
                  {copiedId === selectedMacro.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedId === selectedMacro.id ? "Copied" : "Copy Macro"}
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Meta label="Category" value={selectedMacro.category} />
                <Meta label="Subcategory" value={selectedMacro.subcategory || "None"} />
                <Meta label="Sub-subcategory" value={selectedMacro.subSubcategory || "None"} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 font-semibold">
                  <MessageSquareText className="h-5 w-5 text-primary" />
                  Macro Content
                </div>
                <div className="max-h-[520px] overflow-auto rounded-2xl border bg-muted/40 p-5 text-sm leading-6 whitespace-pre-wrap">
                  {selectedMacro.content || "No macro content provided."}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              Select a macro to view its content.
            </div>
          )}
        </article>
      </section>
    </div>
  );
};

const Stat = ({ value, label }: { value: number; label: string }) => (
  <div className="rounded-2xl bg-white/25 p-4 backdrop-blur-sm">
    <div className="text-3xl font-bold">{value}</div>
    <div className="text-xs font-medium uppercase opacity-80">{label}</div>
  </div>
);

const Meta = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl bg-muted/50 p-4">
    <div className="text-xs font-semibold uppercase text-muted-foreground">{label}</div>
    <div className="mt-1 break-words text-sm font-medium">{value}</div>
  </div>
);

export default ZendeskMacros;
