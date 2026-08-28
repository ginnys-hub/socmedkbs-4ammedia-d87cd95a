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
    href: "https://now.oriclehearing.com/0ab9bd7d-3daa-4a86-a273-8789a7951f5f?ad_id={{ad.id}}&adset_id={{adset.id}}&campaign_id={{campaign.id}}&ad_name={{ad.name}}&adset_name={{adset.name}}&campaign_name={{campaign.name}}&source={{site_source_name}}&AFID=FBC&placement={{placement}}",
    thumbnail: oricle20.url,
  },
  {
    id: "oricle-3-0-v1-handbook",
    title: "Oricle 3.0 - V1 Handbook",
    brand: "Oricle",
    category: "Guides" as ResourceCategory,
    description:
      "Cascade overview: temporary JH testing model for Oricle 3.0, not the long-term replacement. Compared with Oricle 2.0, this uses factory model JH-A170 with the same analog CIC setup, 6 volume levels, 2 modes, automatic turn-on, 5-second start-up delay, and sticker removal requirement. Phase-in starts Aug. 26 with 6K inventory for one-time market testing.",
    href: "/resources/oricle-manuals/oricle-3-0-v1-handbook.pdf",
    thumbnail: "/resources/oricle-manuals/oricle-3-0-v1-cover.jpg",
  },
  {
    id: "oricle-3-0-v2-manual",
    title: "Oricle 3.0 - V2 Manual",
    brand: "Oricle",
    category: "Guides" as ResourceCategory,
    description:
      "Cascade overview: new replacement for Oricle 2.0. It keeps the same Oricle 2.0 look and analog CIC flow, but moves to the improved JH-A490 model with better quality and noise canceling. New internal SKU is MA-OEHOAOTEA490NEW26, with 10,020 units on order and phase-in starting Aug. 26.",
    href: "/resources/oricle-manuals/oricle-3-0-v2-manual.pdf",
    thumbnail: "/resources/oricle-manuals/oricle-3-0-v2-cover.jpg",
  },
  {
    id: "oricle-pro-plus-v1-handbook",
    title: "Oricle PRO+ V1 Handbook",
    brand: "Oricle",
    category: "Guides" as ResourceCategory,
    description:
      "Cascade overview: temporary JH testing model for the Pro line. Compared with Oricle Pro, PRO+ V1 changes to factory model JH-A26A, Intricon chipset, 4 channels, automatic turn-on, and sticker removal required. It keeps CIC style, 6 volume levels, 4 modes, and a 5-second start-up delay. Phase-in starts Aug. 26 with 2,040 units on order.",
    href: "/resources/oricle-manuals/oricle-pro-plus-v1-handbook.pdf",
    thumbnail: "/resources/oricle-manuals/oricle-pro-plus-v1-cover.jpg",
  },
  {
    id: "oricle-pro-plus-v2-handbook",
    title: "Oricle PRO+ V2 Handbook",
    brand: "Oricle",
    category: "Guides" as ResourceCategory,
    description:
      "Cascade overview: new replacement for the current Oricle Pro. This version moves to supplier Wenatone, factory model EC04-01, Onsemi BS300 chipset, smaller hearing size, 16 channels, 9 volume levels, automatic turn-on, 8-second start-up delay, sticker removal required, and screen display. Phase-in starts Aug. 26 with 3,000 units on order.",
    href: "/resources/oricle-manuals/oricle-pro-plus-v2-handbook.pdf",
    thumbnail: "/resources/oricle-manuals/oricle-pro-plus-v2-cover.jpg",
  },
];
