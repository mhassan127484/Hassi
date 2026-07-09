import { Product, ProductColor, Review, Tag } from "@/types";

const ink: [string, string] = ["#111114", "#2A2A30"];
const cobalt: [string, string] = ["#2B4CF0", "#0B1B4D"];
const bone: [string, string] = ["#E4E7F5", "#8A8681"];
const stoneT: [string, string] = ["#8A8681", "#F2EEE6"];
const cobaltLight: [string, string] = ["#2B4CF0", "#5A74FF"];
const charcoal: [string, string] = ["#2A2A30", "#8A8681"];
const clay: [string, string] = ["#C9C2B4", "#8A8681"];
const rust: [string, string] = ["#B5502D", "#2A2A30"];
const moss: [string, string] = ["#525F45", "#111114"];
const sand: [string, string] = ["#E8E2D9", "#C9C2B4"];

const REVIEW_AUTHORS = [
  "Sana K.",
  "Bilal R.",
  "Ayesha M.",
  "Omar F.",
  "Zara H.",
  "Hamza T.",
  "Fatima S.",
  "Danish A.",
];
const REVIEW_TITLES = [
  "Better than expected",
  "Worth every rupee",
  "Fits true to size",
  "Runs a bit large",
  "My new go-to",
  "Great weight and finish",
];
const REVIEW_BODIES = [
  "The material feels heavier and more considered than most things at this price point. Wears in nicely after a wash.",
  "Took a chance on the fit and it paid off — sits exactly like the photos suggest. Already thinking about a second colorway.",
  "Shipping was quick and the packaging felt premium. The piece itself is even better in hand.",
  "Slightly boxier than I expected but it works with the rest of the line. Construction is solid.",
  "This has replaced three other things in my rotation. Simple, well-made, no logos shouting at you.",
];

function seedNumber(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

function mkReviews(seed: string, count: number): Review[] {
  const h = seedNumber(seed);
  return Array.from({ length: count }, (_, i) => {
    const n = h + i * 17;
    return {
      id: `${seed}-r${i}`,
      author: REVIEW_AUTHORS[(n + i) % REVIEW_AUTHORS.length],
      rating: 4 + ((n >> 2) % 2),
      date: new Date(2026, (n % 6) + 1, (n % 27) + 1).toISOString(),
      title: REVIEW_TITLES[n % REVIEW_TITLES.length],
      body: REVIEW_BODIES[(n + 3) % REVIEW_BODIES.length],
    };
  });
}

function colorway(name: string, hex: string, tile: [string, string]): ProductColor {
  return { name, hex, tile };
}

const CARE = "Dry clean only";
const MADE = "Made in Karachi, Pakistan";
const SHIPPING =
  "Free standard shipping on orders over $50. Standard delivery in 5–7 business days, express in 2–3 business days for $5.";
const RETURNS =
  "30-day returns on unworn pieces with tags attached. Store credit issued instantly; refunds to original payment method within 5–7 business days.";

interface Seed {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  category: Product["category"];
  colors: ProductColor[];
  sizes: string[];
  stock: number;
  rating: number;
  drop: string;
  description: string;
  highlights: string[];
  details: Record<string, string>;
  tags: Tag[];
  featured?: boolean;
  reviewCount?: number;
}

const seeds: Seed[] = [
  {
    id: "01",
    slug: "phantom-overcoat",
    name: "Phantom Overcoat",
    brand: "Hassi Atelier",
    price: 24900,
    compareAtPrice: 29900,
    category: "Outerwear",
    colors: [colorway("Ink / Cobalt", "#111114", cobalt), colorway("Bone", "#E4E7F5", bone)],
    sizes: ["S", "M", "L", "XL"],
    stock: 6,
    rating: 4.8,
    drop: "Vol. 01",
    description:
      "A single-breasted overcoat cut from double-face wool. Dropped shoulder, concealed placket, and a hem that moves with you.",
    highlights: [
      "80% wool, 20% nylon double-face",
      "Dropped shoulder, relaxed silhouette",
      "Concealed placket, horn-effect buttons",
      "Interior phone pocket",
    ],
    details: { Material: "Double-face wool, garment finished", Fit: "Relaxed, true to size", Care: CARE, "Made in": MADE },
    tags: ["bestseller"],
    featured: true,
  },
  {
    id: "02",
    slug: "atlas-knit",
    name: "Atlas Ribbed Knit",
    brand: "Hassi Standard",
    price: 8900,
    category: "Knitwear",
    colors: [colorway("Bone", "#E4E7F5", bone), colorway("Ink", "#111114", ink)],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 14,
    rating: 4.6,
    drop: "Vol. 01",
    description:
      "Chunky merino rib with a relaxed body. The kind of layer you reach for before you think about it.",
    highlights: ["100% merino wool", "Chunky rib knit", "Relaxed body, dropped shoulder", "Ribbed cuffs and hem"],
    details: { Material: "100% merino wool", Fit: "Relaxed, size down for fitted", Care: "Hand wash cold, dry flat", "Made in": MADE },
    tags: ["bestseller", "new"],
    featured: true,
  },
  {
    id: "03",
    slug: "meridian-denim",
    name: "Meridian Wide Denim",
    brand: "Hassi Standard",
    price: 11500,
    category: "Denim",
    colors: [colorway("Raw Indigo", "#1c2b6b", cobalt), colorway("Charcoal", "#2A2A30", charcoal)],
    sizes: ["28", "30", "32", "34", "36"],
    stock: 9,
    rating: 4.7,
    drop: "Vol. 01",
    description:
      "Raw selvedge denim with a wide, architectural leg. Fades into something personal over time.",
    highlights: ["13oz raw selvedge denim", "Wide, architectural leg", "Button-fly, self-fabric belt loops", "Unwashed — fades with wear"],
    details: { Material: "100% cotton selvedge denim", Fit: "Wide leg, true to size", Care: "Wash cold, hang dry", "Made in": MADE },
    tags: ["bestseller"],
    featured: true,
  },
  {
    id: "04",
    slug: "null-scarf",
    name: "Null Wool Scarf",
    brand: "Hassi Studio",
    price: 4200,
    category: "Accessories",
    colors: [colorway("Stone", "#8A8681", stoneT), colorway("Ink", "#111114", ink)],
    sizes: ["One Size"],
    stock: 22,
    rating: 4.5,
    drop: "Vol. 01",
    description: "An oversized brushed-wool scarf. Wraps twice, warms always.",
    highlights: ["100% brushed wool", "180 x 40cm", "Fringed edges", "Wraps twice around the neck"],
    details: { Material: "100% brushed wool", Fit: "One size", Care: "Dry clean only", "Made in": MADE },
    tags: [],
  },
  {
    id: "05",
    slug: "vector-bomber",
    name: "Vector Bomber",
    brand: "Hassi Atelier",
    price: 18900,
    category: "Outerwear",
    colors: [colorway("Cobalt", "#2B4CF0", cobaltLight), colorway("Ink", "#111114", ink)],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 3,
    rating: 4.9,
    drop: "Vol. 01",
    description:
      "A cropped technical bomber with a matte shell and ribbed cuffs. Weightless, wind-blocking.",
    highlights: ["Matte technical shell", "Taped seams, wind-blocking", "Ribbed collar, cuffs and hem", "Zippered chest pocket"],
    details: { Material: "Recycled nylon shell, fleece lining", Fit: "Cropped, true to size", Care: "Machine wash cold", "Made in": MADE },
    tags: ["bestseller", "low-stock"],
    featured: true,
  },
  {
    id: "06",
    slug: "quiet-hoodie",
    name: "Quiet Heavy Hoodie",
    brand: "Hassi Standard",
    price: 7600,
    category: "Knitwear",
    colors: [colorway("Ink", "#111114", ink), colorway("Bone", "#E4E7F5", bone)],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: 18,
    rating: 4.7,
    drop: "Vol. 01",
    description:
      "500gsm loopback cotton, boxy fit, garment-dyed. The last hoodie argument you'll have.",
    highlights: ["500gsm loopback cotton", "Boxy, dropped-shoulder fit", "Garment-dyed for depth of color", "Kangaroo pocket"],
    details: { Material: "100% loopback cotton", Fit: "Boxy, size down for fitted", Care: "Machine wash cold, inside out", "Made in": MADE },
    tags: ["new"],
  },
  {
    id: "07",
    slug: "orbit-tote",
    name: "Orbit Leather Tote",
    brand: "Hassi Studio",
    price: 13400,
    category: "Bags",
    colors: [colorway("Bone", "#F2EEE6", stoneT), colorway("Clay", "#C9C2B4", clay)],
    sizes: ["One Size"],
    stock: 11,
    rating: 4.6,
    drop: "Vol. 01",
    description: "Vegetable-tanned leather that softens with the week. Holds a laptop and a mood.",
    highlights: ["Vegetable-tanned leather", "Fits a 15\" laptop", "Interior zip pocket", "Softens and patinas with wear"],
    details: { Material: "Full-grain vegetable-tanned leather", Fit: "38 x 32 x 12cm", Care: "Wipe clean, leather conditioner as needed", "Made in": MADE },
    tags: [],
  },
  {
    id: "08",
    slug: "static-trouser",
    name: "Static Pleated Trouser",
    brand: "Hassi Standard",
    price: 9800,
    category: "Denim",
    colors: [colorway("Charcoal", "#2A2A30", charcoal), colorway("Sand", "#E8E2D9", sand)],
    sizes: ["28", "30", "32", "34", "36"],
    stock: 8,
    rating: 4.4,
    drop: "Vol. 01",
    description: "A single-pleat wool-blend trouser with a clean break. Sharp without trying.",
    highlights: ["Wool-blend twill", "Single pleat, tapered leg", "Clean break at the ankle", "Side-adjuster waistband"],
    details: { Material: "70% wool, 30% polyester", Fit: "Tapered, true to size", Care: "Dry clean only", "Made in": MADE },
    tags: [],
  },
  {
    id: "09",
    slug: "field-parka",
    name: "Field Parka",
    brand: "Hassi Atelier",
    price: 27500,
    category: "Outerwear",
    colors: [colorway("Moss", "#525F45", moss), colorway("Ink", "#111114", ink)],
    sizes: ["S", "M", "L", "XL"],
    stock: 5,
    rating: 4.8,
    drop: "Vol. 02",
    description: "A long-line field parka with a storm flap and removable liner. Built for the season, not just the shoot.",
    highlights: ["Waxed cotton shell", "Removable quilted liner", "Storm flap over front zip", "Four-pocket utility front"],
    details: { Material: "Waxed cotton, quilted polyester liner", Fit: "Long-line, true to size", Care: "Spot clean, re-wax annually", "Made in": MADE },
    tags: ["new"],
  },
  {
    id: "10",
    slug: "cursive-cardigan",
    name: "Cursive Cardigan",
    brand: "Hassi Standard",
    price: 10200,
    category: "Knitwear",
    colors: [colorway("Clay", "#C9C2B4", clay), colorway("Ink", "#111114", ink)],
    sizes: ["XS", "S", "M", "L"],
    stock: 12,
    rating: 4.5,
    drop: "Vol. 02",
    description: "A fine-gauge cardigan with horn buttons and a soft drape. Layers under everything, over nothing.",
    highlights: ["Fine-gauge cotton-wool blend", "Horn-effect button front", "Ribbed collar and cuffs", "Soft, fluid drape"],
    details: { Material: "60% cotton, 40% wool", Fit: "Relaxed, true to size", Care: "Hand wash cold", "Made in": MADE },
    tags: ["new"],
  },
  {
    id: "11",
    slug: "raw-slim-denim",
    name: "Raw Slim Denim",
    brand: "Hassi Standard",
    price: 10800,
    category: "Denim",
    colors: [colorway("Raw Indigo", "#1c2b6b", cobalt), colorway("Black", "#111114", ink)],
    sizes: ["28", "30", "32", "34", "36", "38"],
    stock: 16,
    rating: 4.6,
    drop: "Vol. 01",
    description: "A slim straight cut in rigid 12oz denim. The everyday pair, done properly.",
    highlights: ["12oz rigid selvedge denim", "Slim straight leg", "Five-pocket construction", "Unwashed — fades with wear"],
    details: { Material: "100% cotton selvedge denim", Fit: "Slim, true to size", Care: "Wash cold, hang dry", "Made in": MADE },
    tags: [],
  },
  {
    id: "12",
    slug: "monolith-crossbody",
    name: "Monolith Crossbody",
    brand: "Hassi Studio",
    price: 6900,
    category: "Bags",
    colors: [colorway("Ink", "#111114", ink), colorway("Rust", "#B5502D", rust)],
    sizes: ["One Size"],
    stock: 20,
    rating: 4.3,
    drop: "Vol. 02",
    description: "A minimal crossbody in structured canvas with leather trim. Fits the essentials, nothing more.",
    highlights: ["Water-resistant structured canvas", "Leather trim and strap", "Fits phone, cards, keys", "Adjustable strap, 55–120cm"],
    details: { Material: "Canvas body, leather trim", Fit: "18 x 14 x 5cm", Care: "Wipe clean", "Made in": MADE },
    tags: ["new"],
  },
  {
    id: "13",
    slug: "form-sneaker",
    name: "Form Low Sneaker",
    brand: "Hassi Studio",
    price: 12500,
    category: "Footwear",
    colors: [colorway("Bone", "#F2EEE6", stoneT), colorway("Ink", "#111114", ink)],
    sizes: ["39", "40", "41", "42", "43", "44"],
    stock: 10,
    rating: 4.7,
    drop: "Vol. 02",
    description: "A low-profile sneaker in brushed leather with a moulded rubber sole. Quiet, considered, all-day.",
    highlights: ["Brushed full-grain leather upper", "Moulded rubber outsole", "Padded collar, low profile", "Cotton laces"],
    details: { Material: "Full-grain leather, rubber sole", Fit: "True to size", Care: "Wipe clean, leather protector", "Made in": MADE },
    tags: ["bestseller"],
    featured: true,
  },
  {
    id: "14",
    slug: "trail-boot",
    name: "Trail Chelsea Boot",
    brand: "Hassi Atelier",
    price: 17200,
    category: "Footwear",
    colors: [colorway("Charcoal", "#2A2A30", charcoal), colorway("Rust", "#B5502D", rust)],
    sizes: ["40", "41", "42", "43", "44", "45"],
    stock: 4,
    rating: 4.6,
    drop: "Vol. 01",
    description: "A waxed-suede Chelsea boot on a lugged sole. Built for the commute and the mountain both.",
    highlights: ["Waxed suede upper", "Lugged rubber sole", "Elastic side panels", "Pull tab at heel"],
    details: { Material: "Waxed suede, rubber sole", Fit: "True to size", Care: "Suede brush, waterproof spray", "Made in": MADE },
    tags: ["low-stock"],
  },
  {
    id: "15",
    slug: "index-cap",
    name: "Index Wool Cap",
    brand: "Hassi Studio",
    price: 3200,
    category: "Accessories",
    colors: [colorway("Ink", "#111114", ink), colorway("Stone", "#8A8681", stoneT)],
    sizes: ["One Size"],
    stock: 30,
    rating: 4.2,
    drop: "Vol. 02",
    description: "A six-panel wool cap with a low crown and curved brim. No branding, just the shape.",
    highlights: ["Wool-blend twill", "Six-panel construction", "Adjustable strap closure", "Low crown, curved brim"],
    details: { Material: "80% wool, 20% nylon", Fit: "Adjustable, one size", Care: "Spot clean", "Made in": MADE },
    tags: ["new"],
  },
  {
    id: "16",
    slug: "belt-01",
    name: "Full-Grain Belt",
    brand: "Hassi Studio",
    price: 4600,
    category: "Accessories",
    colors: [colorway("Ink", "#111114", ink), colorway("Clay", "#C9C2B4", clay)],
    sizes: ["S/M", "L/XL"],
    stock: 25,
    rating: 4.5,
    drop: "Vol. 01",
    description: "A full-grain leather belt with a matte brushed buckle. Ages well, holds its line.",
    highlights: ["Full-grain leather", "Matte brushed metal buckle", "3.5cm width", "Ages and patinas with wear"],
    details: { Material: "Full-grain leather", Fit: "See size chart", Care: "Wipe clean, leather conditioner", "Made in": MADE },
    tags: [],
  },
  {
    id: "17",
    slug: "deck-shoe",
    name: "Deck Canvas Shoe",
    brand: "Hassi Standard",
    price: 6400,
    category: "Footwear",
    colors: [colorway("Sand", "#E8E2D9", sand), colorway("Ink", "#111114", ink)],
    sizes: ["39", "40", "41", "42", "43", "44"],
    stock: 15,
    rating: 4.1,
    drop: "Vol. 02",
    description: "A washed-canvas deck shoe with a vulcanised sole. Warm-weather standard issue.",
    highlights: ["Washed cotton canvas", "Vulcanised rubber sole", "Breathable, lightweight", "Cotton laces"],
    details: { Material: "Cotton canvas, rubber sole", Fit: "True to size", Care: "Machine wash cold, air dry", "Made in": MADE },
    tags: [],
  },
  {
    id: "18",
    slug: "weekender-holdall",
    name: "Weekender Holdall",
    brand: "Hassi Atelier",
    price: 15800,
    category: "Bags",
    colors: [colorway("Ink", "#111114", ink), colorway("Moss", "#525F45", moss)],
    sizes: ["One Size"],
    stock: 7,
    rating: 4.7,
    drop: "Vol. 01",
    description: "A structured canvas holdall with leather handles and a detachable strap. Built for the short trip.",
    highlights: ["Waxed canvas body", "Full-grain leather handles", "Detachable, adjustable strap", "45L capacity"],
    details: { Material: "Waxed canvas, leather trim", Fit: "52 x 28 x 24cm", Care: "Wipe clean", "Made in": MADE },
    tags: ["low-stock"],
  },
];

export const products: Product[] = seeds.map((s) => ({
  id: s.id,
  slug: s.slug,
  name: s.name,
  brand: s.brand,
  price: s.price,
  compareAtPrice: s.compareAtPrice,
  category: s.category,
  colors: s.colors,
  images: [],
  sizes: s.sizes,
  stock: s.stock,
  rating: s.rating,
  reviewCount: s.reviewCount ?? 12 + (seedNumber(s.slug) % 80),
  drop: s.drop,
  description: s.description,
  highlights: s.highlights,
  details: s.details,
  shipping: SHIPPING,
  returns: RETURNS,
  tags: s.tags,
  reviews: mkReviews(s.slug, 2 + (seedNumber(s.slug) % 2)),
  featured: s.featured,
}));

export const featuredProducts = products.filter((p) => p.featured);
export const newArrivals = products.filter((p) => p.tags.includes("new"));
export const bestSellers = products.filter((p) => p.tags.includes("bestseller"));

export const categories: { name: Product["category"]; blurb: string; tile: [string, string] }[] = [
  { name: "Outerwear", blurb: "Coats, jackets, shells", tile: cobalt },
  { name: "Knitwear", blurb: "Sweaters, hoodies, cardigans", tile: bone },
  { name: "Denim", blurb: "Jeans and trousers", tile: charcoal },
  { name: "Footwear", blurb: "Sneakers and boots", tile: stoneT },
  { name: "Accessories", blurb: "Scarves, caps, belts", tile: clay },
  { name: "Bags", blurb: "Totes, holdalls, crossbody", tile: rust },
];

export const brands = Array.from(new Set(products.map((p) => p.brand)));
export const allSizes = Array.from(new Set(products.flatMap((p) => p.sizes)));

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, count);
}

export function formatPrice(usd: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(usd);
}
