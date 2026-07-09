"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { assertAdmin } from "./adminGuard";
import { AdminProduct, Category } from "@/types";

export interface VariantInput {
  name: string;
  hex: string;
  imageUrl?: string;
}

export interface ProductInput {
  name: string;
  brand: string;
  category: Category;
  price: number;
  stock: number;
  status: AdminProduct["status"];
  colors: VariantInput[];
  images: string[];
  sizes: string[];
  drop: string;
  description: string;
  highlights: string[];
  details: Record<string, string>;
  shipping: string;
  returns: string;
}

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp(((n >> 16) & 255) + amount);
  const g = clamp(((n >> 8) & 255) + amount);
  const b = clamp((n & 255) + amount);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  await assertAdmin();
  const supabase = createClient();
  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  const ids = (products ?? []).map((p) => p.id);
  const [{ data: colors }, { data: images }] = ids.length
    ? await Promise.all([
        supabase.from("product_colors").select("*").in("product_id", ids),
        supabase.from("product_images").select("*").in("product_id", ids),
      ])
    : [{ data: [] }, { data: [] }];

  return (products ?? []).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    price: Number(p.price),
    compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : undefined,
    category: p.category as Category,
    colors: (colors ?? [])
      .filter((c) => c.product_id === p.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((c) => ({ name: c.name, hex: c.hex, tile: [c.hex, shade(c.hex, -60)] as [string, string], image: c.image_url ?? undefined })),
    images: (images ?? [])
      .filter((i) => i.product_id === p.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => i.image_url),
    sizes: p.sizes,
    stock: p.stock,
    rating: Number(p.rating),
    reviewCount: p.review_count,
    drop: p.drop_name,
    description: p.description,
    highlights: p.highlights,
    details: p.details,
    shipping: p.shipping,
    returns: p.returns,
    tags: p.tags as AdminProduct["tags"],
    reviews: [],
    status: p.status,
  }));
}

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function createProduct(input: ProductInput) {
  await assertAdmin();
  const supabase = createClient();
  const slug = `${slugify(input.name)}-${Date.now().toString(36)}`;

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      slug,
      name: input.name,
      brand: input.brand,
      price: input.price,
      category: input.category,
      stock: input.stock,
      status: input.status,
      sizes: input.sizes,
      drop_name: input.drop,
      description: input.description,
      highlights: input.highlights,
      details: input.details,
      shipping: input.shipping,
      returns: input.returns,
    })
    .select("id")
    .single();
  if (error || !product) throw new Error(error?.message ?? "Failed to create product");

  if (input.colors.length) {
    const { error: colorError } = await supabase.from("product_colors").insert(
      input.colors.map((c, i) => ({ product_id: product.id, name: c.name, hex: c.hex, image_url: c.imageUrl, sort_order: i }))
    );
    if (colorError) throw new Error(colorError.message);
  }

  if (input.images.length) {
    const { error: imageError } = await supabase.from("product_images").insert(
      input.images.map((url, i) => ({ product_id: product.id, image_url: url, sort_order: i }))
    );
    if (imageError) throw new Error(imageError.message);
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function updateProduct(id: string, input: ProductInput) {
  await assertAdmin();
  const supabase = createClient();

  const { error } = await supabase
    .from("products")
    .update({
      name: input.name,
      brand: input.brand,
      price: input.price,
      category: input.category,
      stock: input.stock,
      status: input.status,
      sizes: input.sizes,
      drop_name: input.drop,
      description: input.description,
      highlights: input.highlights,
      details: input.details,
      shipping: input.shipping,
      returns: input.returns,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await supabase.from("product_colors").delete().eq("product_id", id);
  if (input.colors.length) {
    const { error: colorError } = await supabase.from("product_colors").insert(
      input.colors.map((c, i) => ({ product_id: id, name: c.name, hex: c.hex, image_url: c.imageUrl, sort_order: i }))
    );
    if (colorError) throw new Error(colorError.message);
  }

  await supabase.from("product_images").delete().eq("product_id", id);
  if (input.images.length) {
    const { error: imageError } = await supabase.from("product_images").insert(
      input.images.map((url, i) => ({ product_id: id, image_url: url, sort_order: i }))
    );
    if (imageError) throw new Error(imageError.message);
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function deleteProduct(id: string) {
  await assertAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function uploadProductImage(formData: FormData): Promise<string> {
  await assertAdmin();
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  // Storage RLS also allows this for admins, but the service-role client avoids an extra round trip for the check.
  const admin = createAdminClient();
  const { error } = await admin.storage.from("product-images").upload(path, file, { contentType: file.type });
  if (error) throw new Error(error.message);

  const { data } = admin.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}
