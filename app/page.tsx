import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import TrustBar from "@/components/store/TrustBar";
import ProductRow from "@/components/store/ProductRow";
import { getFeaturedProducts, getNewArrivals, getBestSellers, getCategories, getProducts } from "@/lib/api/products";

export default async function Home() {
  const [featuredProducts, newArrivals, bestSellers, categories, allProducts] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getBestSellers(),
    getCategories(),
    getProducts(),
  ]);

  return (
    <>
      <Hero heroProduct={featuredProducts[0] ?? allProducts[0]} />
      <Marquee />
      <TrustBar />

      {/* Featured */}
      <ProductRow title="The drop" viewAllHref="/shop" products={featuredProducts} />

      {/* Manifesto */}
      <section className="bg-ink py-28 text-paper">
        <div className="mx-auto max-w-[1100px] px-6 md:px-10">
          <p className="font-body text-xs uppercase tracking-widest text-cobalt">The idea</p>
          <p className="mt-8 font-display text-3xl font-medium leading-[1.15] tracking-tight md:text-5xl">
            Hassi makes a small number of things, slowly. Fewer, better pieces —
            cut clean, dyed deep, and finished so you forget you&apos;re wearing
            them. No seasons chasing seasons. Just the work.
          </p>
        </div>
      </section>

      {/* Shop by category */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10">
        <h2 className="font-display text-4xl font-semibold tracking-tightest text-ink md:text-6xl">
          Shop by category
        </h2>
        <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.name}
              href={`/shop?category=${encodeURIComponent(c.name)}`}
              className="group relative flex aspect-[4/3] flex-col justify-between bg-paper p-6 transition-colors hover:bg-mist"
            >
              <span
                className="h-10 w-10 rounded-full"
                style={{ background: `linear-gradient(135deg, ${c.tile[0]}, ${c.tile[1]})` }}
              />
              <div>
                <p className="font-body text-xs uppercase tracking-widest text-stone">
                  {allProducts.filter((p) => p.category === c.name).length} pieces · {c.blurb}
                </p>
                <h3 className="mt-1 flex items-center gap-2 font-display text-2xl font-semibold tracking-tightest text-ink">
                  {c.name}
                  <ArrowUpRight
                    className="h-5 w-5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                    strokeWidth={2}
                  />
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ProductRow title="New arrivals" viewAllHref="/shop?sort=newest" products={newArrivals} />
      <ProductRow title="Best sellers" viewAllHref="/shop?sort=bestselling" products={bestSellers} />
    </>
  );
}
