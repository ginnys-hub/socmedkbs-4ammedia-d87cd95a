export type HandbookCategory =
  | "Company"
  | "People"
  | "Products"
  | "Process"
  | "Policy"
  | "Appendix";

export type HandbookItem = {
  id: string;
  category: HandbookCategory;
  title: string;
  summary: string;
  points: string[];
  links?: { label: string; href: string }[];
};

export const handbookSource = {
  title: "4AM Media CSR Manual",
  sourceUrl:
    "https://docs.google.com/document/d/1I5XO5LgA5cDwxEbVZNcJ21y4l6S0DeA9/edit",
  modified: "Source file modified July 17, 2026",
};

export const handbookCategories: ("All" | HandbookCategory)[] = [
  "All",
  "Company",
  "People",
  "Products",
  "Process",
  "Policy",
  "Appendix",
];

export const handbookItems: HandbookItem[] = [
  {
    id: "company-overview",
    category: "Company",
    title: "Company Overview",
    summary:
      "4AM Media is an ecommerce company founded five years ago, based out of California and mostly working on PST, with fulfillment shipping out of Tampa, Florida on EST.",
    points: [
      "The company sells products online using media buying across Facebook, Google, Pinterest, and additional channels as they are added.",
      "Story-based copywriting is a core acquisition approach.",
      "Current product areas include toilet cleaners, epilators, earwax removal tools, dental probiotics, and additional household products.",
      "The company currently has 17 employees outside of customer service, including three co-owners.",
    ],
  },
  {
    id: "privacy-branding",
    category: "Policy",
    title: "Customer-Facing Privacy and Brand Separation",
    summary:
      "Customer responses should protect internal company details and answer only under the brand/product the customer contacted.",
    points: [
      "Do not tell customers the company name, employee names, internal business practices, or company location.",
      "Respond using the individual brand or product name the customer is asking about.",
      "This separation protects the business as it expands across multiple brands and products.",
      "Keep internal tools, warehouse processes, and team assignments private unless a manager directs otherwise.",
    ],
  },
  {
    id: "csr-team",
    category: "People",
    title: "CSR Team Structure",
    summary:
      "The manual identifies managers, specialists, senior CSRs, CSRs, and people outside the CSR team.",
    points: [
      "Adrian is the product sourcer and should be aware of inventory status and process setup.",
      "Althea, Georgina, and Michelle are Customer Service Managers.",
      "Brai is the Subject Matter Expert.",
      "Yurie is Senior CSR.",
      "CSR team members listed include Danielle, Kohleen, Nobi, Dianne, Jem, Dan, Jayson, Era, Princess, and Ingred.",
      "Employees outside the CSR team listed in the source include Chris, Nick, and Yani.",
    ],
  },
  {
    id: "splash-foaming-cleaner",
    category: "Products",
    title: "Splash Foaming Cleaner",
    summary:
      "Splash Foaming Cleaner washes away stains and odor-causing bacteria from sinks, toilets, and many household surfaces.",
    points: [
      "Primary site: www.buysplashcleaner.com.",
      "Ingredients listed include citric acid anhydrous, sodium lauryl sulfate, sodium carbonate, sodium citrate dihydrate, sodium polyacrylate, and EDTA acid.",
      "The manual states these are naturally occurring ingredients and should be safe to use without gloves.",
      "It can be used on glass, silver/gold, textiles, tiles, stainless steel, GI steel, copper, aluminum, cast iron, clay and stoneware, PTFE ceramics, and regular ceramics.",
      "How it works: the product reacts with water to create foam that expands across the bowl and bonds chemically with stains after about 30 minutes.",
      "Targets limescale deposits, calcium reservoirs, rust build-up, and hard water scaling.",
      "Use steps: pour a tablespoon into the toilet, powder foams immediately, let soak 30 minutes, rinse, then flush.",
      "Price in the source: 1x Splash Foaming Cleaner, 350g, $19.95.",
    ],
    links: [{ label: "Splash Cleaner", href: "https://www.buysplashcleaner.com" }],
  },
  {
    id: "splash-gifts-freebies",
    category: "Products",
    title: "Splash Gifts and Freebies",
    summary:
      "Customers may receive or select freebies through upsells, often with gift shipping attached.",
    points: [
      "Splash Foaming Cleaner Sample Pack contains the same cleaning product at 350g.",
      "Gift shipping is listed at $9.95.",
      "Gift: Washing Machine Cleaner uses effervescent tablets for washing machine tanks.",
      "Gift: Gripper Ear Cleaner uses a soft spiral grooved tip for wax removal.",
      "Gift: Charcoal Purifying Bag filters ambient air, lasts two years, and can be recharged monthly in sunlight.",
      "Gift: Refrigerator Deodorizer deodorizes refrigerator air through charcoal components.",
      "Gift: Tile Grout Marker covers stained, dirty, or old grout.",
    ],
  },
  {
    id: "country-websites",
    category: "Products",
    title: "Country-Specific Product Websites",
    summary:
      "The manual contains product landing pages by country for Splash Foam, Smooth Glide, and Klean Ears.",
    points: [
      "Splash Foam: US splashfoam.com/tars/, Canada splashfoam.com/ca/, UK splashfoam.com/uk/, Australia splashfoam.com/au/, New Zealand splashfoam.com/nz/, Germany splashfoam.com/de/, France splashfoam.com/fr/, Italy splashfoam.com/it/, Ireland splashfoam.com/ie/salespage.php.",
      "Smooth Glide: US smoothglideskin.com/peau/, Canada smoothglideskin.com/ca/, UK smoothglideskin.com/uk/, Australia smoothglideskin.com/au/salespage.php, New Zealand smoothglideskin.com/nz/, Ireland smoothglideskin.com/ie/, Germany smoothglideskin.com/de/, France smoothglideskin.com/fr/, Italy smoothglideskin.com/it/.",
      "Klean Ears: US kleanears.com/wax/, Canada kleanears.com/ca/, UK kleanears.com/uk/, Australia kleanears.com/au/, New Zealand kleanears.com/nz/.",
    ],
  },
  {
    id: "glabrous-skin",
    category: "Products",
    title: "Glabrous Skin / Smooth Glide Epilator",
    summary:
      "Glabrous Skin is positioned as an effective, less painful alternative to waxing that removes hair from the root.",
    points: [
      "Site: https://glabrousskin.com.",
      "Source price: 1x Smooth Glide Epilator, $120.",
      "Can be used on legs, face, armpits, and private areas.",
      "The manual states it can be effective up to six weeks of hair-free skin.",
      "How it works: 18 automated tweezer technology grabs tiny hairs from the root.",
      "Use steps: run the epilator over the body like a razor, allow the tweezers to remove unwanted hair, then rinse skin or apply lotion.",
      "Cleaning: the head can be rinsed under running water and cleaned with a brush; the main body is not waterproof.",
      "Package dimensions listed: 6.77 x 2.99 x 1.3 inches; 3.84 ounces.",
    ],
    links: [{ label: "Glabrous Skin", href: "https://glabrousskin.com" }],
  },
  {
    id: "kleanears",
    category: "Products",
    title: "KleanEars",
    summary:
      "KleanEars is described as a medical-grade ear wax remover that uses a spiral head and turning motion.",
    points: [
      "Site: https://buyearklean.com.",
      "Positioned for ear-wax build-up that can contribute to hearing loss, stuffed-head feeling, earaches, tinnitus, and balance issues.",
      "The spiral head is designed to pull wax out without pushing inward like cotton buds.",
      "One pack includes four tips.",
      "Optional add-on: 16 extra tips.",
      "Source price: $58, offered at 50% off for $28.99.",
    ],
    links: [{ label: "KleanEars", href: "https://buyearklean.com" }],
  },
  {
    id: "posture-benefit",
    category: "Products",
    title: "Posture BeneFIT",
    summary:
      "Posture BeneFIT is a posture corrector for mild misalignment, neck pain, back pain, and headaches.",
    points: [
      "Site: https://www.posturebenefit.com/.",
      "The product is meant to help customers retrain muscles into healthier alignment.",
      "Initial recommendation: 20 minutes per day, increasing as needed.",
      "Use steps: place the corrector on the upper back, put arms between the straps, stand straight, and pull straps until shoulders are tugged back.",
      "Source price: $80, offered at $29.95.",
    ],
    links: [{ label: "Posture BeneFIT", href: "https://www.posturebenefit.com/" }],
  },
  {
    id: "safe-siren",
    category: "Products",
    title: "Safe Siren Pro",
    summary:
      "Safe Siren Pro is listed as no longer selling, but the manual preserves its product reference.",
    points: [
      "Site in source: https://safesirenpro.com/safe/.",
      "Reusable personal alarm keychain with 132 decibel sound when the chain is pulled.",
      "Use steps: attach to keychain, clothing, or purse; pull in danger or emergency; push the chain back in to reset.",
      "Source price: $83.85 for two, offered at $39.95.",
      "Status in source: NO LONGER SELLING.",
    ],
    links: [{ label: "Safe Siren Pro", href: "https://safesirenpro.com/safe/" }],
  },
  {
    id: "soji-bamboo",
    category: "Products",
    title: "Soji Bamboo",
    summary:
      "Soji Bamboo is a rechargeable bamboo charcoal bag for odor control and room filtering.",
    points: [
      "Site: https://sojibamboo.com/fresh/.",
      "Intended to keep a 30 x 30 foot room filtered and odor-free.",
      "Recharged by natural UV light up to 24 times, or two full years.",
      "Can function up to 30 days per use.",
      "Positioned as a replacement for fancy air filters.",
    ],
    links: [{ label: "Soji Bamboo", href: "https://sojibamboo.com/fresh/" }],
  },
  {
    id: "best-breath",
    category: "Products",
    title: "Best Breath",
    summary:
      "Best Breath is an oral probiotic positioned for digestive and oral health.",
    points: [
      "Site: https://www.buybbreath.com/.",
      "Positioned to support digestive health, mouth health, plaque prevention, bad breath, gingivitis, and gum disease concerns.",
      "The manual notes customers at high infection risk, children, seniors, and pregnant women should talk to a doctor before taking high levels of probiotics.",
      "Each bottle includes 30 chewable tablets.",
      "Net weight listed: 14 oz. or 397 grams.",
    ],
    links: [{ label: "Best Breath", href: "https://www.buybbreath.com/" }],
  },
  {
    id: "horizon-direct",
    category: "Products",
    title: "Horizon Direct",
    summary:
      "Horizon Direct is the digital subscription handler across products, not a tangible product.",
    points: [
      "It administers and manages monthly recurring purchases across offered products.",
      "Subscription positioning: customers receive products monthly and are charged $19.95 per month with free shipping.",
      "For customer cancellation requests, agents must check Sticki and unsubscribe when subscribed.",
      "If a Horizon Direct order has already processed, open the order in Sticki, refund, and stop the subscription.",
    ],
  },
  {
    id: "my-order-resolution",
    category: "Process",
    title: "My Order Resolution",
    summary:
      "My Order Resolution is a customer support intake tool that creates CRM tickets.",
    points: [
      "Site: https://myorderresolution.com/#find_your_order.",
      "Developed to support sales by reassuring customers that 24/7 assistance is available.",
      "Messages submitted through the site integrate directly into the CRM tool.",
      "These messages are treated as tickets due for resolution by any available CSR agent.",
    ],
    links: [{ label: "My Order Resolution", href: "https://myorderresolution.com/#find_your_order" }],
  },
  {
    id: "additional-products",
    category: "Products",
    title: "Additional Product References",
    summary:
      "The manual includes many active and historical product references CSRs may need while handling tickets.",
    points: [
      "Covert TAC Holster: surgical-grade elastic holster for concealed weapon carry; site https://www.coverttac.com/.",
      "Splash Foam Spray: grease and grime spray-tablet cleaning product for ovens, glass, porcelain, and polished wood; site https://splashfoamspray.com/clean/.",
      "Barks No More: ultrasonic pet trainer; source price $80 offered at $39.95; site https://barksnomore.com/woof/.",
      "Splash Spotless Washing Machine Cleaner: six septic-safe tablets per box, monthly use; source price $40 offered at $19.95; site https://splashspotless.com/wash/.",
      "Jet Surge: power washing hose attachment with jet and fan nozzles; source price $79.90 offered at $39.95; site https://www.thejetsurge.com/jet/.",
      "Nighthawk Zapper: rechargeable portable bug zapper with UV light, 32-hour expected charge, 300-foot zone claim; source price $79.98 offered at $39.99.",
      "SleepHale: anti-snoring wrist device with biosensor and electrical pulse; source price $120 offered at $59.99; site https://www.sleephale.com/sleep/.",
      "Tune Buds Pro: Bluetooth 5.1 noise-cancelling earbuds with rechargeable case; site https://www.tunebudspro.com/.",
      "Blaze Wifi Boost: dual-antenna WiFi booster, up to 300 Mbps, 60-second setup; source price $99.90 offered at $49.95; site https://www.blazewifiboost.com/wifi/.",
    ],
  },
  {
    id: "subscription-check",
    category: "Process",
    title: "Checking and Canceling Subscriptions",
    summary:
      "Subscriptions are identified in Sticki by the subscription box state.",
    points: [
      "If the subscription box is highlighted blue, the customer is enrolled in the product subscription.",
      "Clicking the highlighted subscription box cancels the subscription.",
      "When refunding a product complaint, also check Sticki for related subscriptions and cancel them if present.",
    ],
  },
  {
    id: "refund-product-not-working",
    category: "Policy",
    title: "Product Not Working Refunds",
    summary:
      "For products not working, the manual directs a partial refund and related subscription cleanup.",
    points: [
      "Execute a partial 50% refund in Gorgias.",
      "Go to Sticki and check for any related product subscription; cancel it if found.",
      "If the customer also bought sample products matching the complaint, refund those too.",
      "Reply using the It didn't work macro.",
    ],
  },
  {
    id: "shiphero-refunds",
    category: "Policy",
    title: "ShipHero Refund Rule",
    summary:
      "ShipHero is for shipping status and order handling, not refunds.",
    points: [
      "No refunds in ShipHero, ever.",
      "Refunds should be handled in Sticki/Gorgias according to the relevant policy.",
      "If a customer asks for a refund and ShipHero is not yet fulfilled, cancel the corresponding refunded items in ShipHero so shipping does not process them.",
    ],
  },
  {
    id: "returns",
    category: "Policy",
    title: "Returns",
    summary:
      "For Splash, customers are generally not encouraged to return items.",
    points: [
      "Returning items can create additional shipping cost for the company or customer.",
      "Recommend that customers keep the product instead.",
      "This still applies when a refund has already been given.",
      "Refunds are generally excluding shipping fees unless an escalation condition applies.",
    ],
  },
  {
    id: "shiphero-order-holds",
    category: "Process",
    title: "ShipHero Holds and Order Edits",
    summary:
      "Use ShipHero holds when an order needs address confirmation, item deletion, or gift cancellation before fulfillment.",
    points: [
      "Address on hold: confirm address, update ShipHero address, then untick address hold.",
      "Customer asks to delete items from a new order: ask for the exact items, then tick Operator Hold in ShipHero while awaiting details.",
      "Accidental free gift: explain gift shipping, place Operator Hold while waiting, refund gift shipping and/or expedited shipping in Sticki if confirmed, cancel the gift item in ShipHero, then remove Operator Hold.",
      "Use the Accidental Gift macro when informing the customer after successful cancellation.",
    ],
  },
  {
    id: "manual-shiphero-order",
    category: "Process",
    title: "Manual ShipHero Order Creation",
    summary:
      "If an order exists in Sticki but not ShipHero, manually recreate it in ShipHero using Sticki as the reference.",
    points: [
      "Keep Sticki open in one window.",
      "In ShipHero, go to Open Orders, then Create An Order.",
      "Enter the shipping address from Sticki and set shipping option to Cheapest > Ever.",
      "Use search to add all items from the Sticki order; recheck and modify prices as needed.",
      "Enter shipping cost and tax from Sticki, then verify totals match before saving.",
      "Update details to tick Priority and Allocation Priority High.",
      "Leave a warehouse picker note with the Sticki Order ID.",
      "Update the ticket with an internal note and send/close the customer response.",
      "Add a note in Sticki as a final system update.",
    ],
  },
  {
    id: "marketing-emails",
    category: "Appendix",
    title: "Appendix C: Marketing Email Responses",
    summary:
      "Marketing email replies must be kept open for managerial review unless a customer concern requires a response first.",
    points: [
      "Marketing email subjects may include cleaning stories, jokes, senior stories, free-stuff stories, or other promotional reply chains.",
      "Do not close or merge marketing email tickets because managers need to record them individually.",
      "Keep the ticket open.",
      "Assign it to Georgina after review.",
      "If the response includes a customer concern, address the concern first, then assign the ticket to Georgina.",
      "Ask a supervisor if unsure whether the ticket is marketing-email related.",
    ],
  },
  {
    id: "paypal-tracking",
    category: "Appendix",
    title: "Appendix D: PayPal Tracking Reference Numbers",
    summary:
      "PayPal orders may need tracking added manually after shipment.",
    points: [
      "Check if the order was paid through PayPal by reviewing Sticki order notes.",
      "Log in to PayPal, go to Activity, and select All transactions.",
      "Search by customer name or email, then match by customer details and order date.",
      "Choose Add tracking from the order action menu, paste the tracking reference number, update the courier, and submit.",
      "If PayPal shows Get your money instead, choose Product, add tracking info, and submit.",
      "Tracking sources include Gorgias customer profile, Shopify order detail, and ShipHero order detail.",
      "Source quick-reference video: http://somup.com/crjTYPriKz.",
    ],
    links: [{ label: "PayPal Tracking Video", href: "http://somup.com/crjTYPriKz" }],
  },
  {
    id: "shipping-refund-escalation",
    category: "Appendix",
    title: "Appendix E: When Shipping Can Be Refunded",
    summary:
      "Shipping refund exceptions are prioritized by escalation language and customer distress.",
    points: [
      "Always refund 100% of what the customer asks for, including shipping, when they use the word chargeback.",
      "For Attorney General, BBB, attorney, curse words, excessive exclamation points, or genuine affordability hardship, first refund other items and evaluate whether the customer remains angry or unhappy before refunding shipping.",
      "When refunding shipping, tell the customer you spoke to your boss and got special permission because it goes against normal policy, or use macro CR5.",
    ],
  },
  {
    id: "fraud-holds",
    category: "Appendix",
    title: "Appendix F: Releasing Fraud Holds",
    summary:
      "Fraud holds are worked from the 2024 Orders with Hold sheet and verified against Sticky and ShipHero.",
    points: [
      "Open the 2024 Orders with Hold Google Sheet and use the Fraud Hold tab.",
      "For each order, look for the corresponding Sticky order using the Sticky/Limelight ID in notes for warehouse packer.",
      "If no refunded items are found in Sticky, treat the order as valid and release the fraud hold in ShipHero; set Actions Taken to Fraud Hold Released.",
      "If the order is fully refunded or declined in Sticky but not canceled in ShipHero, cancel it in ShipHero without ticking refund, release the hold, and set Actions Taken to Canceled Shiphero Order.",
      "If already canceled and fully refunded in Sticky and ShipHero, release the hold and set Actions Taken to Already canceled in the sheet.",
      "For test orders, cancel in ShipHero if needed, do not tick refund, then release the fraud hold.",
    ],
  },
  {
    id: "escalation-sheets",
    category: "Appendix",
    title: "Escalation Sheets",
    summary:
      "The manual lists sheets for failed refunds, order placement issues, shipment issues, undelivered messages, and order exceptions.",
    points: [
      "Follow up Refund / Failed Refunds Sheet: use when refunds have not been received within 10 business days or refund processing repeatedly fails.",
      "Failed Placing Orders and Outbound Sales Sheet: use for customer complaints about placing orders and callers interested in placing orders.",
      "Shipment Issue Sheet: use for delayed shipment, incorrect shipment, damaged product, empty box, tracking not working, order held shipped, incomplete shipment, and stuck confirmed status.",
      "Additional sheets listed: Undelivered Messages, Order found in Sticky but not in ShipHero, Orders Stuck in Transit, and Saved Return Order.",
    ],
    links: [
      { label: "Failed Refunds", href: "https://docs.google.com/spreadsheets/d/1e93ydbpPOt_ucH8DabDwfa65AqheLpcXAysfgfdVVYA/edit?usp=sharing" },
      { label: "Failed Orders / Outbound Sales", href: "https://docs.google.com/spreadsheets/d/1eXFSnBpO1jMcTvbGm7A1A-NzIMDurrtApiRlZuekU0g/edit?usp=sharing" },
      { label: "Shipment Issues", href: "https://docs.google.com/spreadsheets/d/1vXNCJry2iFqJaF3DVAmQXUM3NcNoOLreOGDW_jUQNEw/edit?usp=sharing" },
      { label: "Undelivered Messages", href: "https://docs.google.com/spreadsheets/d/1AmQ2I_X4ooWpUAjpDL_UOqVNYCtgo6NU6Ms1kODupRY/edit?usp=sharing" },
      { label: "Sticky not in ShipHero", href: "https://docs.google.com/spreadsheets/d/1nsEKMBc34_QiHxorGuJOv6B34-3m8CEgNokPlVZaAag/edit?usp=sharing" },
      { label: "Orders Stuck in Transit", href: "https://docs.google.com/spreadsheets/d/1MF4fxf0PPY8yeAoFq9kWsHlPUErfxyqh8pgdDeE0NNM/edit?usp=sharing" },
      { label: "Saved Return Order", href: "https://docs.google.com/spreadsheets/d/1kVhvCNz0-4j-YOj8m9saO0UduXybiDRe5RUy-oZKvTo/edit?usp=sharing" },
    ],
  },
  {
    id: "product-availability",
    category: "Appendix",
    title: "Product Availability by Country",
    summary:
      "The manual includes a country availability table for Australia, Canada, United Kingdom, and United States.",
    points: [
      "Australia: Splash Foam Cleaner, Glabrous Skin, Kleanears.",
      "Canada: Splash Foam Cleaner, Glabrous Skin, Kleanears.",
      "United Kingdom: Splash Foam Cleaner, Glabrous Skin, Kleanears.",
      "United States: Barks No More, Best Breath, Blaze Wifi, Covert TAC Holster, Dr. Detox, Jet Surge, Kleanears, Nighthawk Zapper, Oricle Hearing Aid, Posture BeneFIT, Safe Siren Pro, Sleephale, Glabrous Skin, Soji Bamboo, Splash Rinse, Splash Spotless, Splash Spray, Splash Foam Cleaner, Tune Buds Pro.",
    ],
  },
  {
    id: "sku-reference",
    category: "Appendix",
    title: "SKU and Product Name Reference",
    summary:
      "The source includes old names, SKUs, package formats, weights, and barcodes for warehouse and support alignment.",
    points: [
      "Splash Foam Toilet Cleaner Bag: old name 1x Splash Foam Cleaner Bag; SKU 1x-SF-SFB; weight 350g.",
      "Splash Spray Multipurpose Tablet + Bottle combo: old name Splash Foam Cleaning Spray Tablet & Spray Bottle; SKU MA-COMBOTB1BO1; 500ml.",
      "Splash Spray Multipurpose Bottle: old name 1x Splash Foam Spray Bottle; SKU 1x-SS-SFB; 500ml.",
      "Splash Spray Multipurpose Tablet Bag 10-Count: old name 1x Splash Foam Spray Tablets; SKU 1x-SS-SST; 10 pcs x 4g.",
      "Pee Buster Pet Cleaner Tablet + Bottle combo: DTC SKU MA-COMBOPBTB1BO1, Amazon SKU PEEBUSTERx1.",
      "Splash Spotless Washing Machine Cleaner 6 Count: old name Splash Spotless-Washing Machine; SKU WASHMACHINECLEAN; 120g.",
      "Splash Rinse Dishwasher Cleaner 6 Count: old name Dishwasher Rinse; SKU DISHWASH; 120g.",
      "Splash Tank Tablets 6 Count: SKU EGCT01; current DTC barcode 860003807538; new shipment barcode X0048D7G6H.",
      "Glabrous Skin Hair Epilator: old name Smooth Glide Hair Epilator; SKU 1XSG.",
      "Best Breath Oral Probiotic 30 Count: old name Best Breath Oral-Probiotic; SKU 1BBB.",
      "Safe Siren Pro Personal Alarm: SKU SAFEPROx1; color white; no barcode applied.",
      "Jet Surge Power Washer: SKU 1x-JS-JSW; package box; color black.",
      "Blaze Wi-Fi Booster: SKU 1x-BW-BWB; package box; color white.",
      "X-All Foaming Toilet Cleaner Bag 4 bags: SKU MA-XAHCTOILETFOAM 4X85G; net weight 350g / 12.35 oz / 4 treatments.",
    ],
  },
  {
    id: "channel-targets",
    category: "Process",
    title: "Channel Targets",
    summary:
      "The source includes daily and weekly channel targets for email and calls.",
    points: [
      "Email: daily target 140; weekly target 700.",
      "Inbound calls: daily target 40; weekly target 180 based on 4.5 days.",
      "Outbound calls: target 30 per hour, based on outbound hours.",
    ],
  },
  {
    id: "change-log",
    category: "Appendix",
    title: "Cascades and Updates",
    summary:
      "The source includes a long update log from November 2021 through April 2025.",
    points: [
      "Examples include added products, holiday updates, pay-period updates, website order-taking process guide, product availability by country, abusive/rude customer spiel, 30-day guarantee and return policy, ShipHero order adjustments, Q1/Q2 product list, marketing email handling, new product manuals, incentives and holiday rules, and attendance infraction updates.",
      "Recent listed updates include Marketing email handling on July 20, 2024; Macro Shine Pro on August 18, 2024; X-All Power Scrubber on September 19, 2024; Glabrous Skin and OHA manuals on September 26, 2024; OHA Pro Version Product Manual on October 24, 2024; Incentives and Holiday Rules on January 8, 2025; and Table of Infraction Attendance C on April 27, 2025.",
    ],
  },
];