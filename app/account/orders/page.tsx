"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { getMyOrders } from "@/lib/actions/orders";
import { formatPrice } from "@/lib/data/products";
import { StatusPill } from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { Order } from "@/types";

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    getMyOrders().then(setOrders);
  }, []);

  if (orders === null) return <p className="font-body text-sm text-ink/50">Loading...</p>;

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        eyebrow="Orders"
        title="No orders yet."
        description="Once you place an order, it will show up here."
        actionLabel="Start shopping"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr className="border-b border-ink/10 text-left font-body text-xs uppercase tracking-widest text-stone">
            <th className="py-3 pr-4">Order</th>
            <th className="py-3 pr-4">Date</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4">Total</th>
            <th className="py-3 pr-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/10">
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="py-4 pr-4 font-body text-sm font-medium text-ink">#{o.number}</td>
              <td className="py-4 pr-4 font-body text-sm text-ink/60">
                {new Date(o.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </td>
              <td className="py-4 pr-4">
                <StatusPill status={o.status} />
              </td>
              <td className="py-4 pr-4 font-body text-sm text-ink">{formatPrice(o.total)}</td>
              <td className="py-4 pr-4">
                <Link href={`/track-order?order=${o.number}`} className="font-body text-xs uppercase tracking-widest text-cobalt">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
