"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { formatPrice } from "@/lib/data/products";
import { searchProducts } from "@/lib/actions/products";
import { Product } from "@/types";
import ProductTile from "@/components/ProductTile";

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!open) setQuery("");
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      searchProducts(query).then(setResults);
    }, 200);
    return () => clearTimeout(timeout);
  }, [query]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] bg-paper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="mx-auto max-w-[1100px] px-6 pt-24 md:px-10 md:pt-32">
            <div className="flex items-center justify-between gap-6 border-b border-ink/15 pb-4">
              <div className="flex flex-1 items-center gap-4">
                <Search className="h-5 w-5 flex-shrink-0 text-ink/40" strokeWidth={1.5} />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories..."
                  className="w-full bg-transparent font-display text-2xl text-ink placeholder:text-ink/30 focus:outline-none md:text-4xl"
                />
              </div>
              <button
                onClick={onClose}
                aria-label="Close search"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink/40"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            <div className="mt-8 pb-24">
              {query.trim() && results.length === 0 && (
                <p className="font-body text-sm text-ink/50">No results for &ldquo;{query}&rdquo;.</p>
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {results.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    onClick={onClose}
                    className="group flex items-center gap-4 rounded-sm p-2 transition-colors hover:bg-ink/[0.03]"
                  >
                    <ProductTile tile={p.colors[0].tile} image={p.colors[0].image ?? p.images[0]} className="h-16 w-16 flex-shrink-0 rounded-sm" />
                    <div>
                      <p className="font-body text-sm font-medium text-ink">{p.name}</p>
                      <p className="mt-0.5 font-body text-xs text-ink/50">{formatPrice(p.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
              {!query.trim() && (
                <div>
                  <p className="font-body text-xs uppercase tracking-widest text-stone">Try searching</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Overcoat", "Denim", "Sneaker", "Tote", "Knitwear"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="rounded-full border border-ink/15 px-4 py-2 font-body text-xs uppercase tracking-widest text-ink/70 transition-colors hover:border-ink/40 hover:text-ink"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
