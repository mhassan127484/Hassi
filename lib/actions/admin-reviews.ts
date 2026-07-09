"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { assertAdmin } from "./adminGuard";

export interface AdminReview {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  imageUrl?: string;
  date: string;
}

export async function getAdminReviews(): Promise<AdminReview[]> {
  await assertAdmin();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, products(slug, name)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  return (data ?? []).map((r: any) => ({
    id: r.id,
    productId: r.product_id,
    productSlug: r.products?.slug ?? "",
    productName: r.products?.name ?? "(deleted product)",
    author: r.author_name,
    rating: r.rating,
    title: r.title,
    body: r.body,
    imageUrl: r.image_url ?? undefined,
    date: r.created_at,
  }));
}

export async function deleteReviewAsAdmin(id: string, productId: string, productSlug: string) {
  await assertAdmin();
  const supabase = createClient();

  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);

  const { data: allReviews } = await supabase.from("reviews").select("rating").eq("product_id", productId);
  const count = allReviews?.length ?? 0;
  const avg = count ? allReviews!.reduce((s, r) => s + r.rating, 0) / count : 0;
  await supabase.from("products").update({ rating: Math.round(avg * 10) / 10, review_count: count }).eq("id", productId);

  revalidatePath("/admin/reviews");
  revalidatePath("/account/reviews");
  revalidatePath(`/product/${productSlug}`);
}
