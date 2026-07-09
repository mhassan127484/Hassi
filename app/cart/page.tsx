"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag, X } from "lucide-react";
import { useCartStore, cartSubtotal, PROMO_DISCOUNT_RATE } from "@/store/cart";
import { useToastStore } from "@/store/toast";
import { formatPrice } from "@/lib/data/products";
import { getBestSellers } from "@/lib/actions/products";
import { Product } from "@/types";
import ProductTile from "@/components/ProductTile";
import QuantityStepper from "@/components/ui/QuantityStepper";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import RelatedProducts from "@/components/store/RelatedProducts";

const FREE_SHIPPING_THRESHOLD = 15000;
const SHIPPING_FLAT = 1500;

export default function CartPage() {
  const { items, promo, updateQty, removeItem, applyPromo, clearPromo } = useCartStore();
  const push = useToastStore((s) => s.push);
  const [code, setCode] = useState("");
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  useEffect(() => {
    getBestSellers().then((p) => setBestSellers(p.slice(0, 4)));
  }, []);

  const subtotal = useMemo(() => cartSubtotal(items), [items]);
  const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const discount = promo ? Math.round(subtotal * PROMO_DISCOUNT_RATE) : 0;
  const total = subtotal + shipping - discount;

  const handlePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyPromo(code)) {
      push("Promo code applied — 10% off", "success");
    } else {
      push("That promo code isn't valid");
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-16">
        <EmptyState
          icon={ShoppingBag}
          eyebrow="Your bag"
          title="Nothing here yet."
          description="Add a few pieces from the current drop — your bag saves automatically."
          actionLabel="Start with the drop"
          actionHref="/shop"
        />
        <RelatedProducts title="You may also like" products={bestSellers} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-28 md:px-10 md:pt-36">
      <h1 className="font-display text-5xl font-semibold tracking-tightest text-ink md:text-7xl">Your Bag</h1>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {items.map((item) => (
            <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-5 py-6">
              <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                <ProductTile tile={item.colorTile} className="h-24 w-20 rounded-sm" />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link href={`/product/${item.slug}`} className="font-body text-sm font-medium text-ink hover:text-cobalt">
                      {item.name}
                    </Link>
                    <p className="mt-1 font-body text-xs uppercase tracking-widest text-stone">
                      {item.color} · Size {item.size}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.color, item.size)}
                    aria-label="Remove item"
                    className="text-ink/40 transition-colors hover:text-ink"
                  >
                    <X className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <QuantityStepper
                    value={item.qty}
                    onChange={(q) => updateQty(item.productId, item.color, item.size, q)}
                  />
                  <p className="font-body text-sm text-ink">{formatPrice(item.price * item.qty)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-sm border border-ink/10 p-6 lg:sticky lg:top-28 lg:self-start">
          <p className="font-body text-xs uppercase tracking-widest text-stone">Order Summary</p>

          <form onSubmit={handlePromo} className="mt-5 flex items-center gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Promo code"
              className="w-full rounded-full border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink/40 focus:border-ink/50 focus:outline-none"
            />
            <button type="submit" className="whitespace-nowrap font-body text-xs uppercase tracking-widest text-cobalt">
              Apply
            </button>
          </form>
          {promo && (
            <div className="mt-2 flex items-center justify-between font-body text-xs text-ink/50">
              <span>Code &ldquo;{promo}&rdquo; applied</span>
              <button onClick={clearPromo} className="text-cobalt">Remove</button>
            </div>
          )}
          <p className="mt-1 font-body text-[11px] text-ink/40">Try HASSI10 for 10% off.</p>

          <dl className="mt-6 space-y-3 border-t border-ink/10 pt-6">
            <div className="flex justify-between font-body text-sm text-ink/70">
              <dt>Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between font-body text-sm text-ink/70">
              <dt>Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between font-body text-sm text-cobalt">
                <dt>Discount</dt>
                <dd>-{formatPrice(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-ink/10 pt-3 font-body text-base font-medium text-ink">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>

          <Button href="/checkout" className="mt-6 w-full">
            Checkout
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </Button>
          <Button href="/shop" variant="secondary" className="mt-3 w-full">
            Continue Shopping
          </Button>
        </div>
      </div>

      <RelatedProducts title="You may also like" products={bestSellers} />
    </div>
  );
}
