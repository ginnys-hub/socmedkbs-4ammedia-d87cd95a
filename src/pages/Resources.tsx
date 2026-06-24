import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BRANDS, CATEGORIES, resources, type Resource } from "@/data/resources";
import { BookOpen, ExternalLink, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Resources = () => {
  const [brand, setBrand] = useState<string>("All");
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((r) => {
      if (brand !== "All" && r.brand !== brand) return false;
      if (category !== "All" && r.category !== category) return false;
      if (
        q &&
        !`${r.title} ${r.description}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [brand, category, query]);

  const clearAll = () => {
    setBrand("All");
    setCategory("All");
    setQuery("");
  };

  const hasFilters =
    brand !== "All" || category !== "All" || query;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-hero shadow-soft">
          <BookOpen className="h-5 w-5 text-primary-foreground" />
        </span>
        <div>
          <h1 className="text-3xl font-bold">Resources</h1>
          <p className="text-muted-foreground">
            Product info and references — filter by brand or category.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources..."
              className="pl-9"
            />
          </div>

          <FilterRow label="Brand" options={[...BRANDS]} active={brand} onChange={setBrand} />
          <FilterRow
            label="Category"
            options={CATEGORIES as string[]}
            active={category}
            onChange={setCategory}
          />

          {hasFilters && (
            <div className="flex items-center justify-between border-t border-border pt-3 text-sm text-muted-foreground">
              <span>
                Showing {filtered.length} of {resources.length} resources
              </span>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                <X className="mr-1 h-3 w-3" /> Clear filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No resources match your filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      )}
    </div>
  );
};

const FilterRow = ({
  label,
  options,
  active,
  onChange,
}: {
  label: string;
  options: string[];
  active: string;
  onChange: (v: string) => void;
}) => (
  <div className="space-y-2">
    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {label}
    </div>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium transition-colors",
            active === opt
              ? "bg-primary text-primary-foreground shadow-soft"
              : "bg-muted text-muted-foreground hover:bg-muted/70",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const { product } = resource;
  return (
    <Card className="hover-scale overflow-hidden">
      {product?.image && (
        <div className="flex h-40 items-center justify-center bg-muted/40 p-4">
          <img
            src={product.image}
            alt={resource.title}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{resource.title}</CardTitle>
          <Badge variant="secondary">{resource.brand}</Badge>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Badge>{resource.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-muted-foreground">
          {highlightDescription(resource.description)}
        </p>

        {product && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-3">
            <Info label="Schedule" value={product.onMarketSchedule} />
            <Info label="Factory Model" value={product.factoryModel} />
            <Info label="Internal SKU" value={product.internalSku} />
            <Info label="Chipset" value={product.chipset} />
            <Info label="Inventory" value={product.currentInventory} />
            <Info label="On Order" value={product.onOrder} />
            <Info label="Channels" value={String(product.channels)} />
            <Info label="Volume Levels" value={String(product.volume)} />
            <Info label="Modes" value={String(product.modes)} />
            <Info label="Start-up Mode" value={product.startUpMode} />
            <Info label="Start-up Delay" value={product.startUpDelay} />
            <Info label="Remove Sticker?" value={product.needRemoveSticker} />
          </div>
        )}

        {resource.href && (
          <a
            href={resource.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Open <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </CardContent>
    </Card>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className="font-medium">{value}</div>
  </div>
);

export default Resources;
