"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { getCategories, getProducts } from "@/lib/actions/products";
import { Category, Product } from "@/types";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function CollectionsPage() {
  const [active, setActive] = useState<Category | "All">("All");
  const [categories, setCategories] = useState<{ name: Category; blurb: string; tile: [string, string]; image?: string }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    Promise.all([getCategories(), getProducts()]).then(([c, p]) => {
      setCategories(c);
      setProducts(p);
    });
  }, []);

  const tabs: (Category | "All")[] = useMemo(() => ["All", ...categories.map((c) => c.name)], [categories]);

  const collections = useMemo(
    () => categories.map((c) => ({ title: c.name, href: `/shop?category=${encodeURIComponent(c.name)}`, category: c.name as Category, tile: c.tile, image: c.image })),
    [categories]
  );

  const visible = useMemo(
    () => (active === "All" ? collections : collections.filter((c) => c.category === active)),
    [active, collections]
  );

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-28 md:px-10 md:pt-36">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Collections" }]} />

      <h1 className="mt-6 font-display text-6xl font-semibold tracking-tightest text-ink md:text-8xl">
        Our Collections
      </h1>
      <p className="mt-4 max-w-md font-body text-base text-ink/60">
        Timeless pieces. Endless possibilities.
      </p>

      <div className="mt-10 flex flex-wrap gap-2 border-b border-ink/10 pb-8">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={clsx(
              "rounded-full border px-4 py-2 font-body text-xs uppercase tracking-widest transition-colors",
              active === t ? "border-ink bg-ink text-paper" : "border-ink/20 text-ink/70 hover:border-ink/50"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((c, i) => (
          <motion.div
            key={c.title}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={c.href}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-sm"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={
                  c.image
                    ? { backgroundImage: `url(${c.image})` }
                    : { background: `radial-gradient(120% 120% at 25% 15%, ${c.tile[0]} 0%, ${c.tile[1]} 70%)` }
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0" />
              <div className="relative z-10 p-6 text-paper">
                <p className="font-body text-xs uppercase tracking-widest text-paper/70">
                  {products.filter((p) => p.category === c.category).length} pieces
                </p>
                <h3 className="mt-1 font-display text-3xl font-semibold tracking-tightest">{c.title}</h3>
                <span className="mt-4 inline-flex items-center gap-2 font-body text-xs uppercase tracking-widest">
                  Shop Now
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
