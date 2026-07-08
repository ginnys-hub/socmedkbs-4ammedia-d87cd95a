import type { OricleProduct } from "./oricleProducts";
import { oricleProducts } from "./oricleProducts";
import oricleEsSite from "@/assets/oricle-es-site.png";
import oricle20 from "@/assets/products/oricle-2-0.png.asset.json";


export type ResourceCategory = "Product Info" | "Guides" | "Links";

export type Resource = {
  id: string;
  title: string;
  brand: string;
  category: ResourceCategory;
  description: string;
  href?: string;
  thumbnail?: string;
  product?: OricleProduct;
};

export const BRANDS = ["All", "Oricle"] as const;
export const CATEGORIES: ("All" | ResourceCategory)[] = [
  "All",
  "Product Info",
  "Guides",
  "Links",
];

export const resources: Resource[] = [
  ...oricleProducts.map((p) => ({
    id: `oricle-${p.name}`,
    title: p.name,
    brand: "Oricle",
    category: "Product Info" as ResourceCategory,
    description: p.description,
    thumbnail: p.image,
    product: p,
  })),
  {
    id: "oricle-es-site",
    title: "Oricle (ES) Site",
    brand: "Oricle",
    category: "Links" as ResourceCategory,
    description: "Spanish site for Oricle — use this link to refer to Spanish-speaking commenters moving forward.",
    href: "https://hear.oriclehearing.com/?oid=112&affid=251&sub2=wk09q4vg4v816fgjjead1pss&c=US&lang=es",
    thumbnail: oricleEsSite,
  },
  {
    id: "oricle-2-0-comment-link",
    title: "Oricle 2.0 — Correct Comment Link",
    brand: "Oricle",
    category: "Links" as ResourceCategory,
    description:
      "Use this link when replying to Oricle 2.0 comments. Do NOT use the Shopify site links (oriclehearing.com/products/...) — those are incorrect for comments.",
    href: "https://now.oriclehearing.com/0ab9bd7d-3daa-4a86-a273-8789a7951f5f?AFID=FBC&campaign_name=comment&ad_name=2216223485812415",
    thumbnail: oricle20.url,
  },
];
