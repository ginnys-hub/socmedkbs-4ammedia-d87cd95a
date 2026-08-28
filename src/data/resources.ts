import type { OricleProduct } from "./oricleProducts";
import { oricleProducts } from "./oricleProducts";
import oricleEsSite from "@/assets/oricle-es-site.png";
import oricle20 from "@/assets/products/oricle-2-0.png.asset.json";
import oricle30v1 from "@/assets/products/oricle-3-0-v1.png.asset.json";
import oricle30v2 from "@/assets/products/oricle-3-0-v2.png.asset.json";
import oricleProPlusV1 from "@/assets/products/oricle-pro-plus-v1.png.asset.json";
import oricleProPlusV2 from "@/assets/products/oricle-pro-plus-v2.jpeg.asset.json";


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
    href: "https://now.oriclehearing.com/0ab9bd7d-3daa-4a86-a273-8789a7951f5f?ad_id={{ad.id}}&adset_id={{adset.id}}&campaign_id={{campaign.id}}&ad_name={{ad.name}}&adset_name={{adset.name}}&campaign_name={{campaign.name}}&source={{site_source_name}}&AFID=FBC&placement={{placement}}",
    thumbnail: oricle20.url,
  },
  {
    id: "oricle-3-0-v1-handbook",
    title: "Oricle 3.0 - V1 Handbook",
    brand: "Oricle",
    category: "Guides" as ResourceCategory,
    description: "Product handbook for Oricle 3.0 V1. Use this when checking setup, controls, charging, fit, and troubleshooting guidance.",
    href: "/resources/oricle-manuals/oricle-3-0-v1-handbook.pdf",
    thumbnail: oricle30v1.url,
  },
  {
    id: "oricle-3-0-v2-manual",
    title: "Oricle 3.0 - V2 Manual",
    brand: "Oricle",
    category: "Guides" as ResourceCategory,
    description: "Product manual for Oricle 3.0 V2. Use this for the updated model's customer setup and care reference.",
    href: "/resources/oricle-manuals/oricle-3-0-v2-manual.pdf",
    thumbnail: oricle30v2.url,
  },
  {
    id: "oricle-pro-plus-v1-handbook",
    title: "Oricle PRO+ V1 Handbook",
    brand: "Oricle",
    category: "Guides" as ResourceCategory,
    description: "Product handbook for Oricle PRO+ V1. Use this when supporting customers with product operation and troubleshooting.",
    href: "/resources/oricle-manuals/oricle-pro-plus-v1-handbook.pdf",
    thumbnail: oricleProPlusV1.url,
  },
  {
    id: "oricle-pro-plus-v2-handbook",
    title: "Oricle PRO+ V2 Handbook",
    brand: "Oricle",
    category: "Guides" as ResourceCategory,
    description: "Product handbook for Oricle PRO+ V2. Use this for the newer PRO+ reference, care, charging, and setup guidance.",
    href: "/resources/oricle-manuals/oricle-pro-plus-v2-handbook.pdf",
    thumbnail: oricleProPlusV2.url,
  },
];
