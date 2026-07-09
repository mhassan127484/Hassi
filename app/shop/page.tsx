"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import clsx from "clsx";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Modal from "@/components/ui/Modal";
import FiltersSidebar, { PRICE_MAX, PRICE_MIN, ShopFilters } from "@/components/store/FiltersSidebar";
import { getProducts } from "@/lib/actions/products";
import { Category, Product } from "@/types";

type Sort = "featured" | "price-asc" | "price-desc" | "newest" | "bestselling";

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = (searchParams.get("category") as Category) || null;
  const drop = searchParams.get("drop");
  const sort = (searchParams.get("sort") as Sort) || "featured";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    getProducts().then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).map((name) => ({ name })),
    [products]
  );
  const brandFacets = useMemo(() => Array.from(new Set(products.map((p) => p.brand))), [products]);
  const sizeFacets = useMemo(() => Array.from(new Set(products.flatMap((p) => p.sizes))), [products]);

  const setQuery = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null) params.delete(k);
      else params.set(k, v);
    });
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const filters: ShopFilters = { category, minPrice: PRICE_MIN, maxPrice, colors, sizes, brands: selectedBrands };

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice);
    if (category) list = list.filter((p) => p.category === category);
    if (drop) list = list.filter((p) => p.drop === decodeURIComponent(drop));
    if (colors.length) list = list.filter((p) => p.colors.some((c) => colors.includes(c.name)));
    if (sizes.length) list = list.filter((p) => p.sizes.some((s) => sizes.includes(s)));
    if (selectedBrands.length) list = list.filter((p) => selectedBrands.includes(p.brand));

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "newest") sorted.sort((a, b) => (b.tags.includes("new") ? 1 : 0) - (a.tags.includes("new") ? 1 : 0));
    else if (sort === "bestselling") sorted.sort((a, b) => (b.tags.includes("bestseller") ? 1 : 0) - (a.tags.includes("bestseller") ? 1 : 0));
    else sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    return sorted;
  }, [products, category, drop, maxPrice, colors, sizes, selectedBrands, sort]);

  const clearAll = () => {
    setMaxPrice(PRICE_MAX);
    setColors([]);
    setSizes([]);
    setSelectedBrands([]);
    router.push("/shop", { scroll: false });
  };

  const sidebarProps = {
    filters,
    categories,
    brands: brandFacets,
    sizes: sizeFacets,
    setCategory: (c: Category | null) => setQuery({ category: c }),
    setMaxPrice,
    toggleColor: (c: string) => toggle(colors, setColors, c),
    toggleSize: (s: string) => toggle(sizes, setSizes, s),
    toggleBrand: (b: string) => toggle(selectedBrands, setSelectedBrands, b),
    onClear: clearAll,
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-28 md:px-10 md:pt-36">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />

      <div className="mt-6 flex flex-col gap-6 border-b border-ink/10 pb-8 md:flex-row md:items-end md:justify-between">
        <h1 className="font-display text-6xl font-semibold tracking-tightest text-ink md:text-8xl">
          {category ?? "Shop All"}
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 font-body text-xs uppercase tracking-widest text-ink lg:hidden"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2} /> Filters
          </button>
          <select
            value={sort}
            onChange={(e) => setQuery({ sort: e.target.value })}
            className="rounded-full border border-ink/20 bg-paper px-4 py-2 font-body text-xs uppercase tracking-widest text-ink focus:outline-none"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="bestselling">Best Selling</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <FiltersSidebar {...sidebarProps} />
        </aside>

        <div>
          <p className="mb-6 font-body text-xs uppercase tracking-widest text-stone">
            {loading ? "Loading..." : `${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"}`}
          </p>
          {!loading && filtered.length === 0 ? (
            <div className="flex min-h-[30vh] flex-col items-center justify-center text-center">
              <p className="font-display text-2xl text-ink">No pieces match those filters.</p>
              <button onClick={clearAll} className="mt-4 font-body text-sm uppercase tracking-widest text-cobalt">
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <Modal open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} className="max-w-sm">
        <div className={clsx("max-h-[70vh] overflow-y-auto pr-2")}>
          <FiltersSidebar {...sidebarProps} />
        </div>
      </Modal>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}
