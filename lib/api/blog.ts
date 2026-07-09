import { createClient } from "@/lib/supabase/server";
import { BlogPost } from "@/types";
import { Database } from "@/types/database";

type BlogRow = Database["public"]["Tables"]["blog_posts"]["Row"];

const FALLBACK_TILE: [string, string] = ["#111114", "#2A2A30"];

function toPost(row: BlogRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    body: row.body,
    date: row.published_at,
    author: row.author,
    tile: FALLBACK_TILE,
    image: row.tile_image_url ?? undefined,
    featured: row.featured,
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toPost);
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const supabase = createClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
  return data ? toPost(data) : undefined;
}

export async function getFeaturedPost(): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.featured) ?? posts[0];
}

export async function getRecentPosts(excludeId?: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  return posts.filter((p) => p.id !== excludeId);
}
