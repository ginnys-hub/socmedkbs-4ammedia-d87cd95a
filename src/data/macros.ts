export const BRANDS = [
  "General / All Brands",
  "Brand A",
  "Brand B",
  "Brand C",
] as const;

export type Brand = typeof BRANDS[number];

export type Macro = {
  id: string;
  brand: Brand;
  title: string;
  body: string;
  tags?: string[];
};

export const MACROS: Macro[] = [
  {
    id: "gen-shipping",
    brand: "General / All Brands",
    title: "Shipping Timeframe",
    body: "Hi! Thanks for reaching out. Standard shipping typically takes 5–7 business days within the US after the order has been processed. You'll receive a tracking link by email as soon as your order ships. Let us know if you need anything else!",
    tags: ["shipping", "timeframe"],
  },
  {
    id: "gen-availability",
    brand: "General / All Brands",
    title: "Store Availability",
    body: "Thanks for your interest! Our products are currently available exclusively through our official online store. We'll be sure to announce any retail availability on our social channels — stay tuned!",
    tags: ["availability", "retail"],
  },
  {
    id: "gen-returns",
    brand: "General / All Brands",
    title: "Returns Policy",
    body: "We accept returns within 30 days of delivery for unused items in original packaging. Head to our Returns page to start the process — we'll take it from there!",
    tags: ["returns"],
  },
  {
    id: "a-greeting",
    brand: "Brand A",
    title: "Greeting / Intro",
    body: "Hey there! Thanks so much for reaching out to Brand A 💛 How can we help you today?",
    tags: ["greeting"],
  },
  {
    id: "a-restock",
    brand: "Brand A",
    title: "Restock Inquiry",
    body: "Great question! We don't have a confirmed restock date yet, but we recommend signing up for the 'Notify Me' alert on the product page so you'll be the first to know.",
    tags: ["restock"],
  },
  {
    id: "b-order-status",
    brand: "Brand B",
    title: "Order Status Check",
    body: "Hi! Happy to check on that for you. Could you DM us your order number (starts with #BB) and the email used at checkout? We'll dig in right away.",
    tags: ["order"],
  },
  {
    id: "b-damaged",
    brand: "Brand B",
    title: "Damaged Item",
    body: "Oh no, we're so sorry your item arrived damaged! Please send a photo of the item and the packaging along with your order number, and we'll get a replacement out ASAP.",
    tags: ["damage", "replacement"],
  },
  {
    id: "c-promo",
    brand: "Brand C",
    title: "Current Promo",
    body: "Right now you can use code WELCOME15 for 15% off your first order at Brand C 🎉 Let us know if you need help applying it at checkout!",
    tags: ["promo", "discount"],
  },
];
