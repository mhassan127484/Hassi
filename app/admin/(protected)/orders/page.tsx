"use client";

import { useEffect, useState } from "react";
import { getAllOrdersForAdmin, updateOrderStatus } from "@/lib/actions/orders";
import { useToastStore } from "@/store/toast";
import { formatPrice } from "@/lib/data/products";
import { Order, OrderStatus } from "@/types";
import { StatusPill } from "@/components/ui/Badge";

const STATUSES: OrderStatus[] = ["Placed", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const push = useToastStore((s) => s.push);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getAllOrdersForAdmin().then((o) => {
      setOrders(o);
      setLoading(false);
    });
  }, []);

  const filtered = orders.filter(
    (o) => o.number.toLowerCase().includes(query.toLowerCase()) || o.address.fullName.toLowerCase().includes(query.toLowerCase())
  );

  const handleStatusChange = async (order: Order, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    try {
      await updateOrderStatus(order.id, status);
      push(`Order #${order.number} marked ${status}`, "success");
    } catch (err) {
      push(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  if (loading) return <p className="font-body text-sm text-ink/50">Loading...</p>;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tightest text-ink">Orders</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by order # or customer..."
        className="mt-6 w-full max-w-sm rounded-full border border-ink/20 bg-white px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink/40 focus:border-ink/50 focus:outline-none"
      />

      <div className="mt-6 overflow-x-auto rounded-sm border border-ink/10 bg-white">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="border-b border-ink/10 text-left font-body text-xs uppercase tracking-widest text-stone">
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {filtered.map((o) => (
              <tr key={o.id}>
                <td className="p-4 font-body text-sm font-medium text-ink">#{o.number}</td>
                <td className="p-4 font-body text-sm text-ink/70">{o.address.fullName}</td>
                <td className="p-4 font-body text-sm text-ink/70">
                  {new Date(o.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="p-4 font-body text-sm text-ink/70">{formatPrice(o.total)}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <StatusPill status={o.status} />
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o, e.target.value as OrderStatus)}
                      className="rounded-full border border-ink/20 bg-transparent px-3 py-1.5 font-body text-xs text-ink focus:outline-none"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-center font-body text-sm text-ink/50">No orders match your search.</p>
        )}
      </div>
    </div>
  );
}
