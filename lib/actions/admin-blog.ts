"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { assertAdmin } from "./adminGuard";

export interface AdminBlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string[];
  author: string;
  publishedAt: string;
  tileImageUrl?: string;
  featured: boolean;
}

export interface BlogPostInput {
  title: string;
  category: string;
  excerpt: string;
  body: string[];
  author: string;
  publishedAt: string;
  tileImageUrl?: string;
  featured: boolean;
}

function slugify(title: string) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function getAdminBlogPosts(): Promise<AdminBlogPost[]> {
  await assertAdmin();
  const supabase = createClient();
  const { data, error } = await supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
  if (error) throw new Error(error.message);

  return (data ?? []).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category,
    excerpt: p.excerpt,
    body: p.body,
    author: p.author,
    publishedAt: p.published_at,
    tileImageUrl: p.tile_image_url ?? undefined,
    featured: p.featured,
  }));
}

export async function createBlogPost(input: BlogPostInput) {
  await assertAdmin();
  const supabase = createClient();
  const slug = `${slugify(input.title)}-${Date.now().toString(36)}`;

  const { error } = await supabase.from("blog_posts").insert({
    slug,
    title: input.title,
    category: input.category,
    excerpt: input.excerpt,
    body: input.body,
    author: input.author,
    published_at: input.publishedAt,
    tile_image_url: input.tileImageUrl,
    featured: input.featured,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function updateBlogPost(id: string, input: BlogPostInput) {
  await assertAdmin();
  const supabase = createClient();

  const { error } = await supabase
    .from("blog_posts")
    .update({
      title: input.title,
      category: input.category,
      excerpt: input.excerpt,
      body: input.body,
      author: input.author,
      published_at: input.publishedAt,
      tile_image_url: input.tileImageUrl,
      featured: input.featured,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function deleteBlogPost(id: string) {
  await assertAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function uploadBlogImage(formData: FormData): Promise<string> {
  await assertAdmin();
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");

  const ext = file.name.split(".").pop() || "jpg";
  const path = `blog/${crypto.randomUUID()}.${ext}`;

  const admin = createAdminClient();
  const { error } = await admin.storage.from("product-images").upload(path, file, { contentType: file.type });
  if (error) throw new Error(error.message);

  const { data } = admin.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}
