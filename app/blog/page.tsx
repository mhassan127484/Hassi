import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getFeaturedPost, getRecentPosts } from "@/lib/api/blog";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductTile from "@/components/ProductTile";

export default async function BlogPage() {
  const featuredPost = await getFeaturedPost();
  const recentPosts = featuredPost ? await getRecentPosts(featuredPost.id) : [];

  if (!featuredPost) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-28 md:px-10 md:pt-36">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
        <h1 className="mt-6 font-display text-6xl font-semibold tracking-tightest text-ink md:text-8xl">Blog</h1>
        <p className="mt-8 font-body text-sm text-ink/50">No posts yet.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-28 md:px-10 md:pt-36">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
      <h1 className="mt-6 font-display text-6xl font-semibold tracking-tightest text-ink md:text-8xl">
        Blog
      </h1>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <Link href={`/blog/${featuredPost.slug}`} className="group lg:col-span-2">
          <ProductTile tile={featuredPost.tile} image={featuredPost.image} className="aspect-[16/10] rounded-sm" />
          <p className="mt-5 font-body text-xs uppercase tracking-widest text-cobalt">{featuredPost.category}</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tightest text-ink transition-colors group-hover:text-cobalt md:text-4xl">
            {featuredPost.title}
          </h2>
          <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-ink/60">{featuredPost.excerpt}</p>
          <p className="mt-4 font-body text-xs uppercase tracking-widest text-stone">
            {new Date(featuredPost.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {featuredPost.author}
          </p>
        </Link>

        <div className="space-y-8 lg:border-l lg:border-ink/10 lg:pl-8">
          {recentPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex items-start gap-4">
              <ProductTile tile={post.tile} image={post.image} className="h-20 w-20 flex-shrink-0 rounded-sm" />
              <div>
                <p className="font-body text-[11px] uppercase tracking-widest text-stone">
                  {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
                <h3 className="mt-1 font-body text-sm font-medium leading-snug text-ink transition-colors group-hover:text-cobalt">
                  {post.title}
                </h3>
                <p className="mt-1 flex items-center gap-1 font-body text-xs uppercase tracking-widest text-cobalt opacity-0 transition-opacity group-hover:opacity-100">
                  Read <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
