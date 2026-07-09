"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { getOrderByNumber } from "@/lib/actions/orders";
import { formatPrice } from "@/lib/data/products";
import ProductTile from "@/components/ProductTile";
import Button from "@/components/ui/Button";
import { Order } from "@/types";

function SuccessContent() {
  const number = useSearchParams().get("order") ?? "";
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (number) getOrderByNumber(number).then(setOrder);
  }, [number]);

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-32 text-center md:px-10 md:pt-40">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"
      >
        <Check className="h-10 w-10 text-emerald-600" strokeWidth={2.5} />
      </motion.div>

      <h1 className="mt-8 font-display text-5xl font-semibold tracking-tightest text-ink md:text-6xl">
        Thank You!
      </h1>
      <p className="mt-3 font-body text-base text-ink/60">
        Your order has been placed successfully. You&apos;ll receive a confirmation email shortly.
      </p>

      <p className="mt-6 font-body text-xs uppercase tracking-widest text-stone">Order Number</p>
      <p className="mt-1 font-display text-2xl font-semibold tracking-tightest text-ink">
        #{order?.number ?? number}
      </p>

      {order && (
        <div className="mt-10 rounded-sm border border-ink/10 p-6 text-left">
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={`${item.productId}-${item.color}-${item.size}`} className="flex items-center gap-3">
                <ProductTile tile={item.colorTile} className="h-14 w-12 flex-shrink-0 rounded-sm" />
                <div className="flex-1">
                  <p className="font-body text-sm text-ink">{item.name}</p>
                  <p className="font-body text-xs text-ink/50">
                    {item.color} · {item.size} · Qty {item.qty}
                  </p>
                </div>
                <p className="font-body text-sm text-ink">{formatPrice(item.price * item.qty)}</p>
              </div>
            ))}
          </div>
          <dl className="mt-6 space-y-2 border-t border-ink/10 pt-4">
            <div className="flex justify-between font-body text-sm text-ink/70">
              <dt>Subtotal</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between font-body text-sm text-ink/70">
              <dt>Shipping</dt>
              <dd>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between font-body text-sm text-cobalt">
                <dt>Discount</dt>
                <dd>-{formatPrice(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-ink/10 pt-3 font-body text-base font-medium text-ink">
              <dt>Total</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>
      )}

      <Button href="/shop" className="mt-10">
        Continue Shopping
      </Button>
      <p className="mt-4">
        <Link href={`/track-order?order=${order?.number ?? number}`} className="font-body text-xs uppercase tracking-widest text-ink/50 hover:text-ink">
          Track this order
        </Link>
      </p>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
