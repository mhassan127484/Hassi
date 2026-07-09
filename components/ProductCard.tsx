"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { formatPrice } from "@/lib/data/products";
import ProductTile from "./ProductTile";
import { Badge } from "./ui/Badge";
import Stars from "./ui/Stars";
import WishlistButton from "./store/WishlistButton";

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const isNew = product.tags.includes("new");
  const isBestseller = product.tags.includes("bestseller");
  const lowStock = product.tags.includes("low-stock") || product.stock <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-sm">
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProductTile tile={product.colors[0].tile} image={product.colors[0].image} className="aspect-[4/5]" />
          </motion.div>

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {isNew && <Badge tone="cobalt">New</Badge>}
            {isBestseller && <Badge tone="ink">Bestseller</Badge>}
            {lowStock && <Badge tone="outline" className="bg-paper/90">Low stock</Badge>}
          </div>

          <WishlistButton slug={product.slug} className="absolute right-3 top-3" />
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-body text-sm font-medium text-ink">{product.name}</h3>
            <p className="mt-0.5 font-body text-xs uppercase tracking-widest text-stone">
              {product.category} · {product.colors[0].name}
            </p>
            <Stars rating={product.rating} count={product.reviewCount} className="mt-1.5" size={12} />
          </div>
          <div className="whitespace-nowrap text-right font-body text-sm text-ink">
            {product.compareAtPrice && (
              <span className="mr-1.5 text-ink/40 line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
            {formatPrice(product.price)}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
