import type { OricleProduct } from "./oricleProducts";
import { oricleProducts } from "./oricleProducts";

export type ResourceCategory =
  | "Product Info"
  | "Forms"
  | "Guides"
  | "Links";

export type Resource = {
  id: string;
  title: string;
  brand: string;
  category: ResourceCategory;
  tags: string[];
  description: string;
  href?: string;
  product?: OricleProduct;
};

export const BRANDS = ["All", "Oricle"] as const;
export const CATEGORIES: ("All" | ResourceCategory)[] = [
  "All",
  "Product Info",
  "Forms",
  "Guides",
  "Links",
];

const productResources: Resource[] = oricleProducts.map((p) => ({
  id: `oricle-${p.name}`,
  title: p.name,
  brand: "Oricle",
  category: "Product Info",
  tags: [
    `$${p.marketPrice}`,
    p.type,
    p.marketingStatus,
    p.screenDisplay ? "Screen Display" : "No Display",
  ],
  description: p.description,
  product: p,
}));

const linkResources: Resource[] = [
  {
    id: "eod-form",
    title: "EOD Form Submission",
    brand: "Oricle",
    category: "Forms",
    tags: ["Daily", "Reporting", "Required"],
    description:
      "Submit your End-of-Day report using the official form. Effective June 24, 2026 (PST Shift).",
    href: "https://forms.gle/9fUouXo2xURBrSWc6",
  },
];

export const resources: Resource[] = [...productResources, ...linkResources];
