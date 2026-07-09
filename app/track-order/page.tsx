"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { getOrderByNumber } from "@/lib/actions/orders";
import { ORDER_STEPS, stepIndexForStatus } from "@/lib/data/orders";
import { formatPrice } from "@/lib/data/products";
import { Order } from "@/types";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Stepper from "@/components/ui/Stepper";
import Button from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/Badge";
import ProductTile from "@/components/ProductTile";

function TrackOrderContent() {
  const initial = useSearchParams().get("order") ?? "";
  const [input, setInput] = useState(initial);
  const [result, setResult] = useState<Order | null | undefined>(undefined);

  const runTrack = async (value: string) => {
    if (!value.trim()) return;
    setResult(await getOrderByNumber(value));
  };

  useEffect(() => {
    if (initial) runTrack(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-[900px] px-6 pb-24 pt-28 md:px-10 md:pt-36">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Track Order" }]} />

      <h1 className="mt-6 font-display text-5xl font-semibold tracking-tightest text-ink md:text-6xl">
        Track Order
      </h1>
      <p className="mt-3 max-w-md font-body text-sm text-ink/60">
        Enter your order number to see its current status. Try{" "}
        <button onClick={() => { setInput("HASSI123456"); runTrack("HASSI123456"); }} className="text-cobalt underline">
          #HASSI123456
        </button>
        .
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          runTrack(input);
        }}
        className="mt-8 flex items-center gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" strokeWidth={1.5} />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your order number"
            className="w-full rounded-full border border-ink/20 bg-transparent py-3.5 pl-11 pr-4 font-body text-sm text-ink placeholder:text-ink/40 focus:border-ink/60 focus:outline-none"
          />
        </div>
        <Button type="submit">Track</Button>
      </form>

      {result === null && (
        <p className="mt-8 font-body text-sm text-red-500">
          We couldn&apos;t find an order with that number. Double check and try again.
        </p>
      )}

      {result && (
        <div className="mt-12 space-y-10">
          <div className="rounded-sm border border-ink/10 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-body text-xs uppercase tracking-widest text-stone">Order #{result.number}</p>
                <p className="mt-1 font-body text-sm text-ink/60">
                  Placed on {new Date(result.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <StatusPill status={result.status} />
            </div>

            <div className="mt-10">
              <Stepper steps={ORDER_STEPS} activeIndex={stepIndexForStatus(result.status)} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-sm border border-ink/10 p-6">
              <p className="font-body text-xs uppercase tracking-widest text-stone">Order Details</p>
              <div className="mt-4 space-y-4">
                {result.items.map((item) => (
                  <div key={`${item.productId}-${item.color}-${item.size}`} className="flex items-center gap-3">
                    <ProductTile tile={item.colorTile} className="h-12 w-10 flex-shrink-0 rounded-sm" />
                    <div className="flex-1">
                      <p className="font-body text-sm text-ink">{item.name}</p>
                      <p className="font-body text-xs text-ink/50">{item.color} · {item.size} · Qty {item.qty}</p>
                    </div>
                    <p className="font-body text-sm text-ink">{formatPrice(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 font-body text-sm font-medium text-ink">
                <span>Total</span>
                <span>{formatPrice(result.total)}</span>
              </div>
            </div>

            <div className="rounded-sm border border-ink/10 p-6">
              <p className="font-body text-xs uppercase tracking-widest text-stone">Shipping Address</p>
              <div className="mt-4 font-body text-sm leading-relaxed text-ink/70">
                <p className="text-ink">{result.address.fullName}</p>
                <p>{result.address.address}{result.address.apartment ? `, ${result.address.apartment}` : ""}</p>
                <p>{result.address.city}, {result.address.state} {result.address.zip}</p>
                <p>{result.address.country}</p>
                <p className="mt-2">{result.address.phone}</p>
              </div>
              <p className="mt-6 font-body text-xs uppercase tracking-widest text-stone">Shipping Method</p>
              <p className="mt-2 font-body text-sm text-ink/70">{result.shippingMethod} Shipping</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={null}>
      <TrackOrderContent />
    </Suspense>
  );
}
