"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface MyReview {
  id: string;
  productSlug: string;
  productName: string;
  rating: number;
  title: string;
  body: string;
  date: string;
}

export async function getMyReviews(): Promise<MyReview[]> {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data } = await supabase
    .from("reviews")
    .select("*, products(slug, name)")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  return (data ?? []).map((r: any) => ({
    id: r.id,
    productSlug: r.products?.slug ?? "",
    productName: r.products?.name ?? "",
    rating: r.rating,
    title: r.title,
    body: r.body,
    date: r.created_at,
  }));
}

export async function submitReview(input: { productSlug: string; rating: number; title: string; body: string }) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not signed in");

  const { data: product } = await supabase.from("products").select("id").eq("slug", input.productSlug).single();
  if (!product) throw new Error("Product not found");

  const authorName =
    (userData.user.user_metadata?.full_name as string | undefined) || userData.user.email?.split("@")[0] || "Customer";

  const { error } = await supabase.from("reviews").insert({
    product_id: product.id,
    user_id: userData.user.id,
    author_name: authorName,
    rating: input.rating,
    title: input.title,
    body: input.body,
  });
  if (error) throw error;

  const { data: allReviews } = await supabase.from("reviews").select("rating").eq("product_id", product.id);
  const count = allReviews?.length ?? 0;
  const avg = count ? allReviews!.reduce((s, r) => s + r.rating, 0) / count : 0;
  await supabase.from("products").update({ rating: Math.round(avg * 10) / 10, review_count: count }).eq("id", product.id);

  revalidatePath("/account/reviews");
  revalidatePath(`/product/${input.productSlug}`);
}

export async function removeReview(id: string, productSlug: string) {
  const supabase = createClient();
  const { data: review } = await supabase.from("reviews").select("product_id").eq("id", id).single();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw error;

  if (review) {
    const { data: allReviews } = await supabase.from("reviews").select("rating").eq("product_id", review.product_id);
    const count = allReviews?.length ?? 0;
    const avg = count ? allReviews!.reduce((s, r) => s + r.rating, 0) / count : 0;
    await supabase.from("products").update({ rating: Math.round(avg * 10) / 10, review_count: count }).eq("id", review.product_id);
  }

  revalidatePath("/account/reviews");
  revalidatePath(`/product/${productSlug}`);
}

export async function getReviewedProductSlugs(): Promise<string[]> {
  const reviews = await getMyReviews();
  return reviews.map((r) => r.productSlug);
}
