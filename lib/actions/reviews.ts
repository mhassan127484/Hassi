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
  imageUrl?: string;
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
    imageUrl: r.image_url ?? undefined,
    date: r.created_at,
  }));
}

export async function getMyReviewForProduct(productSlug: string): Promise<MyReview | null> {
  const reviews = await getMyReviews();
  return reviews.find((r) => r.productSlug === productSlug) ?? null;
}

export async function uploadReviewImage(formData: FormData): Promise<string> {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not signed in");

  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userData.user.id}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("review-images").upload(path, file, { contentType: file.type });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("review-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function submitReview(input: { productSlug: string; rating: number; title: string; body: string; imageUrl?: string }) {
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
    image_url: input.imageUrl,
  });
  if (error) throw new Error(error.message);

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
  if (error) throw new Error(error.message);

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

export type ReviewEligibility = "signed-out" | "already-reviewed" | "not-purchased" | "eligible";

export async function getReviewEligibility(productSlug: string): Promise<ReviewEligibility> {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return "signed-out";

  const { data: product } = await supabase.from("products").select("id").eq("slug", productSlug).single();
  if (!product) return "not-purchased";

  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", product.id)
    .eq("user_id", userData.user.id)
    .maybeSingle();
  if (existingReview) return "already-reviewed";

  const { data: deliveredOrders } = await supabase
    .from("orders")
    .select("id, order_items(product_id)")
    .eq("user_id", userData.user.id)
    .eq("status", "Delivered");

  const purchased = (deliveredOrders ?? []).some((o: any) =>
    (o.order_items ?? []).some((item: { product_id: string | null }) => item.product_id === product.id)
  );

  return purchased ? "eligible" : "not-purchased";
}
