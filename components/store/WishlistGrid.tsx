"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, X } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { useToastStore } from "@/store/toast";
import { formatPrice } from "@/lib/data/products";
import { getProducts } from "@/lib/actions/products";
import { Product } from "@/types";
import ProductTile from "@/components/ProductTile";
import Stars from "@/components/ui/Stars";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

export default function WishlistGrid() {
  const slugs = useWishlistStore((s) => s.slugs);
  const remove = useWishlistStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);
  const push = useToastStore((s) => s.push);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((p) => {
      setAllProducts(p);
      setLoading(false);
    });
  }, []);

  const items = slugs.map((slug) => allProducts.find((p) => p.slug === slug)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (loading) return <p className="font-body text-sm text-ink/50">Loading...</p>;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        eyebrow="Wishlist"
        title="Your wishlist is empty."
        description="Tap the heart on anything you love to save it here."
        actionLabel="Browse the shop"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((product) => (
        <div key={product.id}>
          <div className="relative overflow-hidden rounded-sm">
            <Link href={`/product/${product.slug}`}>
              <ProductTile tile={product.colors[0].tile} image={product.colors[0].image} className="aspect-[4/5]" />
            </Link>
            <button
              onClick={() => { remove(product.slug); push("Removed from wishlist"); }}
              aria-label="Remove from wishlist"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink transition-colors hover:bg-paper"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
          <Link href={`/product/${product.slug}`} className="mt-4 block">
            <h3 className="font-body text-sm font-medium text-ink">{product.name}</h3>
            <Stars rating={product.rating} count={product.reviewCount} className="mt-1" size={12} />
            <p className="mt-1 font-body text-sm text-ink">{formatPrice(product.price)}</p>
          </Link>
          <Button
            size="sm"
            variant="secondary"
            className="mt-3 w-full"
            onClick={() => {
              addItem({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                color: product.colors[0].name,
                colorTile: product.colors[0].tile,
                size: product.sizes[0],
                qty: 1,
              });
              push(`${product.name} added to bag`, "success");
            }}
          >
            Add to Cart
          </Button>
        </div>
      ))}
    </div>
  );
}
