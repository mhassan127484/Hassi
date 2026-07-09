import { createClient } from "@/lib/supabase/server";
import { Product, ProductColor, Category } from "@/types";
import { Database } from "@/types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type ColorRow = Database["public"]["Tables"]["product_colors"]["Row"];
type ImageRow = Database["public"]["Tables"]["product_images"]["Row"];
type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp(((n >> 16) & 255) + amount);
  const g = clamp(((n >> 8) & 255) + amount);
  const b = clamp((n & 255) + amount);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function toColor(row: ColorRow): ProductColor {
  return { name: row.name, hex: row.hex, tile: [row.hex, shade(row.hex, -60)], image: row.image_url ?? undefined };
}

function toProduct(row: ProductRow, colors: ColorRow[], reviews: ReviewRow[] = [], images: ImageRow[] = []): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    category: row.category as Category,
    colors: colors.filter((c) => c.product_id === row.id).sort((a, b) => a.sort_order - b.sort_order).map(toColor),
    images: images
      .filter((i) => i.product_id === row.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => i.image_url),
    sizes: row.sizes,
    stock: row.stock,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    drop: row.drop_name,
    description: row.description,
    highlights: row.highlights,
    details: row.details,
    shipping: row.shipping,
    returns: row.returns,
    tags: row.tags as Product["tags"],
    reviews: reviews
      .filter((r) => r.product_id === row.id)
      .map((r) => ({ id: r.id, author: r.author_name, rating: r.rating, date: r.created_at, title: r.title, body: r.body })),
  };
}

const CATEGORY_TILES: Record<string, [string, string]> = {
  Outerwear: ["#2B4CF0", "#0B1B4D"],
  Knitwear: ["#E4E7F5", "#8A8681"],
  Denim: ["#2A2A30", "#8A8681"],
  Footwear: ["#F2EEE6", "#C9C2B4"],
  Accessories: ["#C9C2B4", "#8A8681"],
  Bags: ["#B5502D", "#2A2A30"],
};
const CATEGORY_BLURB: Record<string, string> = {
  Outerwear: "Coats, jackets, shells",
  Knitwear: "Sweaters, hoodies, cardigans",
  Denim: "Jeans and trousers",
  Footwear: "Sneakers and boots",
  Accessories: "Scarves, caps, belts",
  Bags: "Totes, holdalls, crossbody",
};

async function fetchAllProductsWithColors() {
  const supabase = createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "Active")
    .order("created_at", { ascending: false });
  if (error) throw error;

  const ids = (products ?? []).map((p) => p.id);
  const [{ data: colors }, { data: images }] = ids.length
    ? await Promise.all([
        supabase.from("product_colors").select("*").in("product_id", ids),
        supabase.from("product_images").select("*").in("product_id", ids),
      ])
    : [{ data: [] as ColorRow[] }, { data: [] as ImageRow[] }];

  return { products: products ?? [], colors: colors ?? [], images: images ?? [] };
}

export async function getProducts(): Promise<Product[]> {
  const { products, colors, images } = await fetchAllProductsWithColors();
  return products.map((p) => toProduct(p, colors, [], images));
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const supabase = createClient();
  const { data: product } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (!product) return undefined;

  const [{ data: colors }, { data: reviews }, { data: images }] = await Promise.all([
    supabase.from("product_colors").select("*").eq("product_id", product.id).order("sort_order"),
    supabase.from("reviews").select("*").eq("product_id", product.id).order("created_at", { ascending: false }),
    supabase.from("product_images").select("*").eq("product_id", product.id).order("sort_order"),
  ]);

  return toProduct(product, colors ?? [], reviews ?? [], images ?? []);
}

export async function getRelatedProducts(product: Product, count = 4): Promise<Product[]> {
  const all = await getProducts();
  return all
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(all.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, count);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.category === category);
}

export async function getCategories() {
  const all = await getProducts();
  const names = Array.from(new Set(all.map((p) => p.category)));
  return names.map((name) => ({
    name: name as Category,
    blurb: CATEGORY_BLURB[name] ?? "",
    tile: CATEGORY_TILES[name] ?? (["#111114", "#2A2A30"] as [string, string]),
  }));
}

export async function getBrands(): Promise<string[]> {
  const all = await getProducts();
  return Array.from(new Set(all.map((p) => p.brand)));
}

export async function getAllSizes(): Promise<string[]> {
  const all = await getProducts();
  return Array.from(new Set(all.flatMap((p) => p.sizes)));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.tags.includes("bestseller")).slice(0, 4);
}

export async function getNewArrivals(): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.tags.includes("new"));
}

export async function getBestSellers(): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.tags.includes("bestseller"));
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const all = await getProducts();
  return all
    .filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
    .slice(0, 6);
}

export function formatPrice(pkr: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(pkr / 278);
}
