import oricle20 from "@/assets/products/oricle-2-0.png.asset.json";
import oricle30v1 from "@/assets/products/oricle-3-0-v1.png.asset.json";
import oricle30v2 from "@/assets/products/oricle-3-0-v2.png.asset.json";
import oriclePro from "@/assets/products/oricle-pro.png.asset.json";
import oricleProPlusV1 from "@/assets/products/oricle-pro-plus-v1.png.asset.json";
import oricleProPlusV2 from "@/assets/products/oricle-pro-plus-v2.jpeg.asset.json";

export type OricleProduct = {
  name: string;
  image: string;
  marketPrice: number;
  marketingStatus: string;
  onMarketSchedule: string;
  description: string;
  factoryModel: string;
  internalSku: string;
  currentInventory: string;
  onOrder: string;
  type: "Analog" | "Digital";
  chipset: string;
  cic: string;
  channels: number;
  volume: number;
  modes: number;
  startUpMode: string;
  startUpDelay: string;
  needRemoveSticker: "YES" | "NO";
  powerType: string;
  screenDisplay: boolean;
};

const images: Record<string, string> = {
  "Oricle 2.0": oricle20.url,
  "Oricle 3.0 - V1": oricle30v1.url,
  "Oricle 3.0 - V2": oricle30v2.url,
  "Oricle Pro": oriclePro.url,
  "Oricle PRO+ V1": oricleProPlusV1.url,
  "Oricle PRO+ V2": oricleProPlusV2.url,
};

type BaseProduct = Omit<OricleProduct, "image">;

const baseProducts: BaseProduct[] = [
  {
    name: "Oricle 2.0",
    marketPrice: 99,
    marketingStatus: "Current",
    onMarketSchedule: "Phase out EST Aug. 26",
    description: "Discontinues after the inventory is out.",
    factoryModel: "JH-A490",
    internalSku: "MA-OEHOAOTEA490",
    currentInventory: "AMZ ~12K, DTC ~10K",
    onOrder: "14K",
    type: "Analog",
    chipset: "N/A",
    cic: "CIC",
    channels: 0,
    volume: 6,
    modes: 2,
    startUpMode: "Automatic turn on",
    startUpDelay: "5 seconds",
    needRemoveSticker: "YES",
    powerType: "Built-In Rechargeable",
    screenDisplay: false,
  },
  {
    name: "Oricle 3.0 - V1",
    marketPrice: 99,
    marketingStatus: "JH testing model, temporary",
    onMarketSchedule: "Phase in on Aug. 26",
    description: "Marketing testing for JH, just 1 time testing to collect market data.",
    factoryModel: "JH-A170",
    internalSku: "MA-OEHOAOTEA170",
    currentInventory: "6K",
    onOrder: "0",
    type: "Analog",
    chipset: "N/A",
    cic: "CIC",
    channels: 0,
    volume: 6,
    modes: 2,
    startUpMode: "Automatic turn on",
    startUpDelay: "5 seconds",
    needRemoveSticker: "YES",
    powerType: "Built-In Rechargeable",
    screenDisplay: false,
  },
  {
    name: "Oricle 3.0 - V2",
    marketPrice: 99,
    marketingStatus: "New Replacement",
    onMarketSchedule: "Phase in on Aug. 26",
    description:
      "Replacement model for the current 2.0. Same look as the current Oricle 2.0, but better quality with noise canceling.",
    factoryModel: "JH-A490 (improved version)",
    internalSku: "MA-OEHOAOTEA490NEW26",
    currentInventory: "0",
    onOrder: "10,020",
    type: "Analog",
    chipset: "N/A",
    cic: "CIC",
    channels: 0,
    volume: 6,
    modes: 2,
    startUpMode: "Automatic turn on",
    startUpDelay: "5 seconds",
    needRemoveSticker: "YES",
    powerType: "Built-In Rechargeable",
    screenDisplay: false,
  },
  {
    name: "Oricle Pro",
    marketPrice: 149,
    marketingStatus: "Current",
    onMarketSchedule: "Phase out EST Jan. 27",
    description: "Discontinues after the inventory is out.",
    factoryModel: "JH-A17BT",
    internalSku: "MA-OEHOAOTEA17",
    currentInventory: "AMZ ~200 pcs, DTC ~10.7K",
    onOrder: "32K",
    type: "Digital",
    chipset: "Chinese local",
    cic: "CIC",
    channels: 16,
    volume: 6,
    modes: 4,
    startUpMode: "Manual key on",
    startUpDelay: "5 seconds",
    needRemoveSticker: "NO",
    powerType: "Built-In Rechargeable",
    screenDisplay: false,
  },
  {
    name: "Oricle PRO+ V1",
    marketPrice: 149,
    marketingStatus: "JH testing model, temporary",
    onMarketSchedule: "Phase in on Aug. 26",
    description: "Marketing testing for JH, just 1 time testing to collect market data.",
    factoryModel: "JH-A26A",
    internalSku: "MA-OEHOAOTEA26",
    currentInventory: "0",
    onOrder: "2,040",
    type: "Digital",
    chipset: "Intricon",
    cic: "CIC",
    channels: 4,
    volume: 6,
    modes: 4,
    startUpMode: "Automatic turn on",
    startUpDelay: "5 seconds",
    needRemoveSticker: "YES",
    powerType: "Built-In Rechargeable",
    screenDisplay: false,
  },
  {
    name: "Oricle PRO+ V2",
    marketPrice: 149,
    marketingStatus: "New Replacement",
    onMarketSchedule: "Phase in on Aug. 26",
    description:
      "Replacement model for the current Pro. New supplier — Wenatone. Better quality, chips, and product function, with smaller hearing size to help improve customer satisfaction.",
    factoryModel: "EC04-01",
    internalSku: "MA-OEHOAOTEWNT04",
    currentInventory: "0",
    onOrder: "3,000",
    type: "Digital",
    chipset: "Onsemi BS300",
    cic: "CIC",
    channels: 16,
    volume: 9,
    modes: 4,
    startUpMode: "Automatic turn on",
    startUpDelay: "8 seconds",
    needRemoveSticker: "YES",
    powerType: "Built-In Rechargeable",
    screenDisplay: true,
  },
];

export const oricleProducts: OricleProduct[] = baseProducts.map((p) => ({
  ...p,
  image: images[p.name],
}));

