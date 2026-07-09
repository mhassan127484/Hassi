import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, getBlogPosts } from "@/lib/api/blog";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductTile from "@/components/ProductTile";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  if (!post) notFound();

  const allPosts = await getBlogPosts();
  const more = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-[800px] px-6 pb-24 pt-28 md:px-10 md:pt-36">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]} />

      <p className="mt-6 font-body text-xs uppercase tracking-widest text-cobalt">{post.category}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tightest text-ink md:text-6xl">
        {post.title}
      </h1>
      <p className="mt-4 font-body text-xs uppercase tracking-widest text-stone">
        {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {post.author}
      </p>

      <ProductTile tile={post.tile} image={post.image} className="mt-8 aspect-[16/9] rounded-sm" />

      <div className="mt-10 space-y-6 font-body text-base leading-relaxed text-ink/75">
        {post.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <div className="mt-16 border-t border-ink/10 pt-10">
        <p className="font-body text-xs uppercase tracking-widest text-stone">More from the journal</p>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {more.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
              <ProductTile tile={p.tile} image={p.image} className="aspect-[4/3] rounded-sm" />
              <h3 className="mt-3 font-body text-sm font-medium text-ink transition-colors group-hover:text-cobalt">
                {p.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
