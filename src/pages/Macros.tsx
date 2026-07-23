import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MessageSquareText, FolderTree, ChevronRight, CheckCircle2, CircleSlash } from "lucide-react";
import { cn } from "@/lib/utils";

type Macro = {
  id: string;
  fullPath: string;
  category: string;
  subcategory: string;
  subSubcategory: string;
  name: string;
  active: boolean;
  parts: string[];
};

type MacroData = {
  count: number;
  macros: Macro[];
};

type TreeNode = {
  label: string;
  path: string;
  count: number;
  active: number;
  children: TreeNode[];
};

const MACRO_TREE_DATA_GZIP = "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";

async function decodeMacroTreeData(): Promise<MacroData> {
  const bytes = Uint8Array.from(atob(MACRO_TREE_DATA_GZIP), (char) => char.charCodeAt(0));

  if (!("DecompressionStream" in window)) {
    throw new Error("This browser cannot load the macro tree data.");
  }

  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  const text = await new Response(stream).text();
  return JSON.parse(text) as MacroData;
}

function buildTree(items: Macro[]) {
  const root: TreeNode = { label: "All macros", path: "", count: 0, active: 0, children: [] };

  for (const item of items) {
    let cursor = root;
    cursor.count += 1;
    cursor.active += item.active ? 1 : 0;

    item.parts.forEach((part, index) => {
      const path = item.parts.slice(0, index + 1).join("::");
      let child = cursor.children.find((node) => node.label === part);
      if (!child) {
        child = { label: part, path, count: 0, active: 0, children: [] };
        cursor.children.push(child);
      }
      child.count += 1;
      child.active += item.active ? 1 : 0;
      cursor = child;
    });
  }

  const sortNodes = (node: TreeNode) => {
    node.children.sort((a, b) => a.label.localeCompare(b.label));
    node.children.forEach(sortNodes);
  };

  sortNodes(root);
  return root;
}

function TreeBranch({
  node,
  selectedPath,
  onSelect,
  depth = 0,
}: {
  node: TreeNode;
  selectedPath: string;
  onSelect: (path: string) => void;
  depth?: number;
}) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = node.children.length > 0;
  const selected = selectedPath === node.path;

  return (
    <li>
      <div className="flex items-center gap-1" style={{ paddingLeft: depth * 12 }}>
        <button
          type="button"
          disabled={!hasChildren}
          onClick={() => setOpen((value) => !value)}
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted disabled:opacity-30"
          aria-label={`${open ? "Collapse" : "Expand"} ${node.label}`}
        >
          {hasChildren ? <ChevronRight className={cn("h-4 w-4 transition", open && "rotate-90")} /> : null}
        </button>
        <button
          type="button"
          onClick={() => onSelect(node.path)}
          className={cn(
            "flex min-w-0 flex-1 items-center justify-between gap-3 rounded-2xl px-3 py-2 text-left text-sm font-semibold transition",
            selected ? "bg-primary text-primary-foreground shadow-soft" : "hover:bg-muted",
          )}
        >
          <span className="truncate">{node.label}</span>
          <span className={cn("text-xs", selected ? "text-primary-foreground/80" : "text-muted-foreground")}>{node.count}</span>
        </button>
      </div>
      {open && hasChildren ? (
        <ul className="mt-1 space-y-1">
          {node.children.map((child) => (
            <TreeBranch key={child.path} node={child} selectedPath={selectedPath} onSelect={onSelect} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

const Macros = () => {
  const [macros, setMacros] = useState<Macro[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  useEffect(() => {
    decodeMacroTreeData()
      .then((data) => {
        setMacros(data.macros);
        setSelectedId(data.macros[0]?.id ?? "");
      })
      .catch((error: Error) => setLoadError(error.message));
  }, []);

  const tree = useMemo(() => buildTree(macros), [macros]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return macros.filter((macro) => {
      const pathOk = !selectedPath || macro.fullPath.toLowerCase().startsWith(selectedPath.toLowerCase());
      const activeOk = !activeOnly || macro.active;
      const queryOk = !q || `${macro.fullPath} ${macro.name}`.toLowerCase().includes(q);
      return pathOk && activeOk && queryOk;
    });
  }, [activeOnly, macros, query, selectedPath]);

  const selectedMacro = filtered.find((macro) => macro.id === selectedId) ?? filtered[0] ?? macros[0];
  const activeCount = macros.filter((macro) => macro.active).length;
  const categoryCount = new Set(macros.map((macro) => macro.category)).size;

  if (loadError) {
    return <div className="rounded-3xl bg-muted p-8 text-center text-muted-foreground">{loadError}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-bubblegum p-6 shadow-pop animate-scale-in sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/90 shadow-soft animate-float">
              <MessageSquareText className="h-5 w-5 text-bubblegum-foreground" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-bubblegum-foreground/75">Zendesk support reference</p>
              <h1 className="mt-1 text-3xl font-extrabold text-bubblegum-foreground animate-fade-in-down sm:text-4xl">
                Macro tree
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-bubblegum-foreground/80 animate-fade-in stagger-1">
                Browse the Zendesk macro hierarchy from the reference workbook, search by path, and inspect each macro's exact category placement.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat label="Macros" value={macros.length} />
            <Stat label="Active" value={activeCount} />
            <Stat label="Categories" value={categoryCount} />
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-card p-4 shadow-soft">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search macro path or name..."
              className="h-12 rounded-full pl-11"
            />
          </div>
          <Button
            type="button"
            variant={activeOnly ? "default" : "outline"}
            onClick={() => setActiveOnly((value) => !value)}
            className="rounded-full"
          >
            {activeOnly ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <CircleSlash className="mr-2 h-4 w-4" />}
            Active only
          </Button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1fr_1.05fr]">
        <section className="rounded-3xl bg-card p-4 shadow-soft animate-fade-in stagger-2">
          <PanelTitle icon={<FolderTree className="h-4 w-4" />} label="Macro tree" count={filtered.length} />
          <ul className="mt-4 max-h-[640px] space-y-1 overflow-auto pr-1">
            <TreeBranch node={tree} selectedPath={selectedPath} onSelect={setSelectedPath} />
          </ul>
        </section>

        <section className="rounded-3xl bg-card p-4 shadow-soft animate-fade-in stagger-3">
          <PanelTitle label={selectedPath || "All macros"} count={filtered.length} />
          <div className="mt-4 grid max-h-[640px] gap-3 overflow-auto pr-1">
            {filtered.length === 0 ? (
              <p className="rounded-3xl bg-muted p-8 text-center text-muted-foreground">No macros match your filters.</p>
            ) : (
              filtered.map((macro, index) => (
                <button
                  key={macro.id}
                  type="button"
                  onClick={() => setSelectedId(macro.id)}
                  style={{ animationDelay: `${index * 30}ms` }}
                  className={cn(
                    "rounded-3xl border bg-background p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-pop animate-fade-in",
                    selectedMacro?.id === macro.id ? "border-primary ring-2 ring-primary/20" : "border-border",
                  )}
                >
                  <p className="line-clamp-1 text-xs font-bold text-muted-foreground">{macro.parts.slice(0, -1).join(" / ")}</p>
                  <h3 className="mt-1 font-bold">{macro.name}</h3>
                  <Badge className={cn("mt-3 rounded-full", macro.active ? "bg-mint text-mint-foreground" : "bg-muted text-muted-foreground")}>
                    {macro.active ? "Active" : "Inactive"}
                  </Badge>
                </button>
              ))
            )}
          </div>
        </section>

        <aside className="rounded-3xl bg-card p-5 shadow-soft animate-fade-in stagger-4">
          {selectedMacro ? (
            <div className="space-y-5">
              <div>
                <Badge className={cn("rounded-full", selectedMacro.active ? "bg-mint text-mint-foreground" : "bg-muted text-muted-foreground")}>
                  {selectedMacro.active ? "Active" : "Inactive"}
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold">{selectedMacro.name}</h2>
                <p className="mt-2 break-words text-sm text-muted-foreground">{selectedMacro.fullPath}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedMacro.parts.map((part, index) => (
                  <Badge key={`${part}-${index}`} variant="secondary" className="rounded-full">
                    {part}
                  </Badge>
                ))}
              </div>

              <dl className="grid gap-3 rounded-3xl bg-muted p-4 text-sm">
                <Meta label="Category" value={selectedMacro.category || "Uncategorized"} />
                <Meta label="Subcategory" value={selectedMacro.subcategory || "None"} />
                <Meta label="Sub-subcategory" value={selectedMacro.subSubcategory || "None"} />
                <Meta label="Zendesk path" value={selectedMacro.fullPath} />
              </dl>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading macro tree...</p>
          )}
        </aside>
      </div>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-3xl bg-white/70 px-4 py-3 shadow-soft">
    <strong className="block text-xl text-bubblegum-foreground">{value}</strong>
    <span className="text-xs font-bold uppercase tracking-wide text-bubblegum-foreground/70">{label}</span>
  </div>
);

const PanelTitle = ({ icon, label, count }: { icon?: React.ReactNode; label: string; count: number }) => (
  <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
    <div className="flex min-w-0 items-center gap-2">
      {icon}
      <h2 className="truncate text-sm font-extrabold uppercase tracking-wide text-muted-foreground">{label}</h2>
    </div>
    <Badge variant="secondary" className="rounded-full">{count}</Badge>
  </div>
);

const Meta = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</dt>
    <dd className="mt-1 break-words font-semibold text-foreground">{value}</dd>
  </div>
);

export default Macros;
