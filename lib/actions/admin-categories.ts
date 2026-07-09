"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { assertAdmin } from "./adminGuard";

export interface AdminCategory {
  id: string;
  name: string;
  blurb: string;
  tileHex: string;
  imageUrl?: string;
  productCount: number;
}

export interface CategoryInput {
  name: string;
  blurb: string;
  tileHex: string;
  imageUrl?: string;
}

function revalidateStorefront() {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/collections");
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  await assertAdmin();
  const supabase = createClient();
  const [{ data: categories, error }, { data: products }] = await Promise.all([
    supabase.from("categories").select("*").order("created_at"),
    supabase.from("products").select("category"),
  ]);
  if (error) throw new Error(error.message);

  const counts = new Map<string, number>();
  (products ?? []).forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1));

  return (categories ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    blurb: c.blurb,
    tileHex: c.tile_hex,
    imageUrl: c.image_url ?? undefined,
    productCount: counts.get(c.name) ?? 0,
  }));
}

export async function createCategory(input: CategoryInput) {
  await assertAdmin();
  const supabase = createClient();
  const { error } = await supabase
    .from("categories")
    .insert({ name: input.name, blurb: input.blurb, tile_hex: input.tileHex, image_url: input.imageUrl });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidateStorefront();
}

export async function updateCategory(id: string, input: CategoryInput) {
  await assertAdmin();
  const supabase = createClient();

  const { data: existing, error: fetchError } = await supabase.from("categories").select("name").eq("id", id).single();
  if (fetchError || !existing) throw new Error(fetchError?.message ?? "Category not found");

  const { error } = await supabase
    .from("categories")
    .update({ name: input.name, blurb: input.blurb, tile_hex: input.tileHex, image_url: input.imageUrl })
    .eq("id", id);
  if (error) throw new Error(error.message);

  if (existing.name !== input.name) {
    const { error: cascadeError } = await supabase.from("products").update({ category: input.name }).eq("category", existing.name);
    if (cascadeError) throw new Error(cascadeError.message);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidateStorefront();
}

export async function deleteCategory(id: string) {
  await assertAdmin();
  const supabase = createClient();

  const { data: existing, error: fetchError } = await supabase.from("categories").select("name").eq("id", id).single();
  if (fetchError || !existing) throw new Error(fetchError?.message ?? "Category not found");

  const { count } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("category", existing.name);
  if (count && count > 0) {
    throw new Error(`${count} product${count === 1 ? "" : "s"} still use "${existing.name}". Reassign them before deleting.`);
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidateStorefront();
}

export async function uploadCategoryImage(formData: FormData): Promise<string> {
  await assertAdmin();
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");

  const ext = file.name.split(".").pop() || "jpg";
  const path = `categories/${crypto.randomUUID()}.${ext}`;

  const admin = createAdminClient();
  const { error } = await admin.storage.from("product-images").upload(path, file, { contentType: file.type });
  if (error) throw new Error(error.message);

  const { data } = admin.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}
