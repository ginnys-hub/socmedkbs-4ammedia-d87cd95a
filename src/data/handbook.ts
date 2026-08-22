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
  table?: {
    columns: string[];
    rows: string[][];
  };
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
    id: "performance-review",
    category: "Policy",
    title: "Performance Review",
    summary:
      "This section explains how CSRs are evaluated across attendance, quality, ticket output, achievement, work ethic, and infractions.",
    points: [
      "CSRs should use the scorecard as the main reference for understanding weekly or monthly performance.",
      "Attendance is checked against scheduled hours, actual hours worked, tardiness, absences, and related attendance infractions.",
      "Quality is checked through QA score, response accuracy, customer handling, macro usage, and resolution quality.",
      "Productivity is checked through ticket actuals, ticket targets, channel output, and achievement percentage.",
      "Work ethic is checked through reliability, ownership, responsiveness, system updates, and follow-through.",
      "Infractions affect the review separately from raw output, especially when the same issue repeats.",
      "CSRs are expected to understand the issue, correct the behavior, and follow the improvement expectations given by management.",
    ],
    table: {
      columns: ["Area", "What CSRs Are Evaluated On", "CSR Focus"],
      rows: [
        ["Attendance", "Hours worked vs. hours scheduled, tardiness, absences, and attendance infractions.", "Follow schedule, give proper notice, and avoid repeated attendance issues."],
        ["Quality", "QA score, accuracy, customer handling, macro usage, and resolution quality.", "Send accurate, brand-safe replies and correct QA misses quickly."],
        ["Productivity", "Ticket actuals vs. target, email/call output, and channel-specific targets.", "Meet assigned channel targets and raise blockers early."],
        ["Achievement", "Overall completion against expected output.", "Understand whether output is meeting the expected scorecard level."],
        ["Work Ethic", "Reliability, ownership, responsiveness, system updates, and follow-through.", "Stay responsive, update systems correctly, and close loops."],
        ["Infractions", "Attendance, process, conduct, system, or customer-handling violations.", "Avoid repeat issues and follow the correction given by management."],
      ],
    },
  },
  {
    id: "table-of-infractions",
    category: "Policy",
    title: "Table of Infractions",
    summary:
      "This CSR-facing infraction guide explains the kinds of issues that can affect performance records, including the source updates for Verbal Warning and Attendance: C.",
    points: [
      "Infractions are recorded when a CSR has repeated or serious issues that need formal tracking.",
      "Attendance infractions include schedule adherence problems such as tardiness, absence, undertime, no-show behavior, or failure to follow attendance notice rules.",
      "Process infractions include missed required steps in Sticki, ShipHero, Gorgias, PayPal, escalation sheets, refunds, subscriptions, or order holds.",
      "Customer-handling infractions include rude replies, incorrect brand disclosure, privacy violations, poor tone, or failure to use approved guidance/macros.",
      "System-update infractions include failing to update the relevant ticket, order, hold, refund, note, tracking reference, or escalation record.",
      "Repeated or severe issues may move from reminder or verbal warning into written warning, final warning, or stronger action according to management review.",
    ],
    table: {
      columns: ["Infraction Area", "Examples", "What CSRs Should Do"],
      rows: [
        ["Attendance", "Late login, undertime, unapproved absence, no call/no show, failure to follow notice rules.", "Follow schedule rules, notify properly, and correct attendance patterns immediately."],
        ["Performance", "Missing email, call, ticket, QA, achievement, or work ethic expectations.", "Check scorecard gaps, ask for clarification when needed, and follow the improvement plan given."],
        ["Customer Response", "Incorrect information, poor tone, privacy breach, wrong brand handling, missed macro guidance.", "Use approved macros/guidance, protect brand privacy, and correct QA feedback quickly."],
        ["Refunds and Returns", "Refunding in the wrong system, missing subscription cancellation, mishandling shipping-refund rules.", "Follow the exact refund, return, and subscription steps before closing the ticket."],
        ["ShipHero / Sticki Process", "Incorrect order hold handling, missed cancellation, manual order mismatch, missing notes.", "Keep Sticki, ShipHero, and ticket notes aligned before releasing or closing work."],
        ["Escalations", "Missing required escalation sheet entry, incomplete details, delayed manager handoff.", "Complete the required sheet or handoff with all details before moving on."],
        ["Conduct", "Rude behavior, refusal to follow process, careless handling of sensitive/internal information.", "Keep communication professional and follow internal privacy and process rules."],
      ],
    },
  },
  {
    id: "active-cascades",
    category: "Appendix",
    title: "Active Cascades",
    summary:
      "These are the valid active cascades from the approved 2026 cascade workbooks. Use these as the current operating reference.",
    points: [
      "Only cascades from the Jan-July 2026 and August-December 2026 cascade workbooks should be treated as valid.",
      "Use this section for current customer handling, tagging, refund, return, replacement, marketplace, marketing, consultation, and escalation guidance.",
      "Items marked New / Current are the newest active cascades from the August workbook.",
    ],
    table: {
      columns: ["Date", "Cascade", "Status"],
      rows: [
        ["Jan 02, 2026", "Proper Return Tagging (All Returns with Refunds Issued)", "Active"],
        ["Jan 06, 2026", "Proper Escalation for Failed Refunds", "Active"],
        ["Jan 07, 2026", "New Amazon, Ebay, Walmart 2026 Tracking Sheet", "Active"],
        ["Jan 08, 2026", "Reminder: Serial Number Collection Handling", "Active"],
        ["Jan 09, 2026", "Splash/X-All Refund Pushback Process Update", "Active"],
        ["Jan 12, 2026", "Product Website Links", "Active"],
        ["Jan 16, 2026", "Important Reminder: Nova AI Ticket Handling (Email Team)", "Active"],
        ["Jan 21, 2026", "Reminder: Failed Refund Escalation Sheet - Avoid Duplicate Entries", "Active"],
        ["Mar 21, 2026", "Update: Macro Creation with Layered Response Options", "Active"],
        ["Mar 28, 2026", "Update: New Hearing Consultation Scheduling Link", "Active"],
        ["Mar 28, 2026", "Process Reminder: Order Cancellation & Holds", "Active"],
        ["Apr 04, 2026", "Important Update: EMAIL Refund Pushback / Value Proposition Flow", "Active"],
        ["Apr 09, 2026", "Update: Audiologist Consultation Portal", "Active"],
        ["Apr 10, 2026", "Update: Process for handling Walmart customer emails", "Active"],
        ["Apr 12, 2026", "Update: Return Process Handling", "Active"],
        ["Apr 14, 2026", "Update: Audiologist Consultation Invitation - Declined", "Active"],
        ["Apr 15, 2026", "OHA Defective Device Free Replacement (30 Days)", "Active"],
        ["Apr 17, 2026", "Reminder: Amazon, Walmart, or Shopify SKUs", "Active"],
        ["Apr 18, 2026", "Audiologist Consultation Link & Portal Reminder", "Active"],
        ["Apr 20, 2026", "Misrouted Emails: SPLASH", "Active"],
        ["Apr 22, 2026", "OHA Follow-Up Meetings with Hearing Specialists (Within 30 Days)", "Active"],
        ["Apr 23, 2026", "REDO Refunded Orders (Return Completed)", "Active"],
        ["May 03, 2026", "Reminder: Escalated Tickets in Zendesk", "Active"],
        ["May 03, 2026", "Reminder: Merging Tickets", "Active"],
        ["May 07, 2026", "Clarification: Audiologist Consultation Offering Guidelines", "Active"],
        ["May 13, 2026", "Important Update: Oricle Return Portal Link", "Active"],
        ["May 13, 2026", "Update: RTS / Undelivered Package Complaint Process", "Active"],
        ["May 15, 2026", "Update: RTS and undelivered package complaints", "Active"],
        ["May 16, 2026", "New Reshipment Process: Shopify Manual Order Creation & Reshipment Requests", "Active"],
        ["May 19, 2026", "New Damaged Orders Tab Added - DHL Re-Shipment Claim Template Sheet", "Active"],
        ["May 19, 2026", "Incorrect Item Received Concerns", "Active"],
        ["May 20, 2026", "Updated Return / Refund Process OHA", "Active"],
        ["May 20, 2026", "Update: Return Process for Splash and X-All Products", "Active"],
        ["May 31, 2026", "Reminder: Marketing Email Handling", "Active"],
        ["Jun 01, 2026", "Update: Marketing Ticket Manual Tagging", "Active"],
        ["Jun 06, 2026", "Update: Internal Notes in Shiphero", "Active"],
        ["Jun 12, 2026", "Update: Redo Process (X-All | Splash)", "Active"],
        ["Jun 15, 2026", "Reminder: Proper Tagging for Tickets with Multiple Concerns", "Active"],
        ["Jun 19, 2026", "Update: Placing an order via Sticky", "Active"],
        ["Jun 19, 2026", "Workflow Update: Marketing Email Unsubscribe Requests", "Active"],
        ["Jun 27, 2026", "Update: New Process for Walmart Escalation Tickets", "Active"],
        ["Jun 27, 2026", "Order Processing Update: Campaign ID Reference & Upsell Reminder", "Active"],
        ["Jul 02, 2026", "Reminder: Assisting Customers with Oricle Upgrades Following Hearing Consultations", "Active"],
        ["Jul 15, 2026", "Update: B&J Warehouse / New NY Warehouse Shipping Delay Compensation", "Active"],
        ["Jul 16, 2026", "Specialist Consultation Calendar Links", "Active"],
        ["Jul 25, 2026", "Reminder: DO NOT Assist Amazon, Walmart, or eBay Customers Directly", "Active"],
        ["Aug 04, 2026", "Attention: New Audiologist Training Portal", "Active"],
        ["Aug 11, 2026", "Important: Customer Details Update Process", "Active"],
        ["Aug 12, 2026", "Update: International Returns", "Active"],
        ["Aug 14, 2026", "Warranty Replacement Process", "New / Current"],
        ["Aug 17, 2026", "OHA Double Dome Tips Customer Complaints Tracking", "Active"],
        ["Aug 18, 2026", "Update: OHA Double Dome Tips Fit & Insertion Assistance", "New / Current"],
        ["Aug 19, 2026", "Replacement Process for Defective Items", "New / Current"],
        ["Aug 20, 2026", "OHA: Campaign Tracking", "New / Current"],
      ],
    },
  },
  {
    id: "superseded-cascades",
    category: "Appendix",
    title: "Superseded and Retired Cascades",
    summary:
      "These cascades are retained for context only. Do not use them as the current process when an active cascade replaces them.",
    points: [
      "Superseded cascades were replaced by a newer cascade listed in the valid workbooks.",
      "Retired cascades are no longer active and should not be used for customer handling.",
      "Legacy 2021-2025 handbook update references are treated as superseded unless they also appear as active in the approved 2026 cascade workbooks.",
    ],
    table: {
      columns: ["Date", "Cascade", "Superseded By / Note"],
      rows: [
        ["Legacy", "Old handbook cascade log from Nov 2021 through Apr 2025", "Superseded by approved 2026 cascade workbooks."],
        ["Jan 06, 2026", "Duplicate Order Confirmations (Shiphero)", "Retired."],
        ["Jan 08, 2026", "Handling Email Marketing Ticket", "Superseded by later marketing email handling cascades."],
        ["Jan 17, 2026", "Pee Buster Expiry Cases: Refund Guidance", "Retired."],
        ["Jan 21, 2026", "Refund Flow Test: Oricle Hearing Aid", "Retired."],
        ["Jan 21, 2026", "Clarification on Refund Flow Test: Oricle Hearing Aid", "Superseded by refund flow updates."],
        ["Jan 21, 2026", "Delivered but Not Received: Response Flow", "Superseded by Terms and Conditions / macro revamp cascades."],
        ["Jan 23, 2026", "Update: Refund Flow Test | Oricle Hearing | Email Only", "Superseded by later refund flow updates."],
        ["Jan 24, 2026", "Update: Oricle Hearing | Refund Flow Test Update", "Retired."],
        ["Mar 14, 2026", "Important Update: Terms and Conditions / Terms of Service", "Superseded by March 21 layered macro update."],
        ["Mar 28, 2026", "Returns & Refunds (Oricle Hearing Aid)", "Superseded by May 20 OHA return/refund process."],
        ["Mar 31, 2026", "New EMAIL Refund Pushback Flow - Effective Immediately", "Superseded by April 1 and April 4 refund pushback updates."],
        ["Apr 01, 2026", "Important Update - EMAIL Refund Pushback / Value Proposition Flow", "Superseded by April 4 refund pushback update."],
        ["Apr 02, 2026", "Update: Oricle Ticket Handling", "Retired."],
        ["Apr 04, 2026", "Update: Oricle Hearing Aid Refund Follow-Ups", "Retired."],
        ["Apr 22, 2026", "Attention: Duplicate Order Incident (All Brands)", "Retired."],
        ["Apr 27, 2026", "Update: OHA Pushback Layers Paused (Email Team Only)", "Retired."],
        ["May 07, 2026", "Handling Email Marketing Ticket", "Superseded by May 14 marketing cascade."],
        ["May 14, 2026", "To all handling Email Tickets (Email & Social Media Team)", "Superseded by May 29 marketing cascade."],
        ["May 29, 2026", "Update: Marketing Email Handling", "Superseded by May 31 marketing email reminder."],
      ],
    },
  },
];
