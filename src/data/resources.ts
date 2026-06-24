import type { OricleProduct } from "./oricleProducts";
import { oricleProducts } from "./oricleProducts";

export type ResourceCategory = "Product Info" | "Guides" | "Links";

export type Resource = {
  id: string;
  title: string;
  brand: string;
  category: ResourceCategory;
  description: string;
  href?: string;
  product?: OricleProduct;
};

export const BRANDS = ["All", "Oricle"] as const;
export const CATEGORIES: ("All" | ResourceCategory)[] = [
  "All",
  "Product Info",
  "Guides",
  "Links",
];

export const resources: Resource[] = oricleProducts.map((p) => ({
  id: `oricle-${p.name}`,
  title: p.name,
  brand: "Oricle",
  category: "Product Info",
  description: p.description,
  product: p,
}));
