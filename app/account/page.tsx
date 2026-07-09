"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Heart, Wallet } from "lucide-react";
import { getMyOrders } from "@/lib/actions/orders";
import { useWishlistStore } from "@/store/wishlist";
import { formatPrice } from "@/lib/data/products";
import { StatusPill } from "@/components/ui/Badge";
import { Order, User } from "@/types";
import { getMyProfile } from "@/lib/actions/profile";

export default function AccountDashboardPage() {
  const wishlistCount = useWishlistStore((s) => s.slugs.length);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getMyOrders().then(setOrders);
    getMyProfile().then(setUser);
  }, []);

  const totalSpent = orders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? o.total : 0), 0);

  const stats = [
    { icon: Package, label: "Orders", value: orders.length },
    { icon: Heart, label: "Wishlist", value: wishlistCount },
    { icon: Wallet, label: "Total Spent", value: formatPrice(totalSpent) },
  ];

  return (
    <div>
      <p className="font-body text-sm text-ink/60">
        Welcome back{user ? <>, <span className="text-ink">{user.name}</span></> : null}.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-sm border border-ink/10 p-5">
            <s.icon className="h-5 w-5 text-cobalt" strokeWidth={1.5} />
            <p className="mt-4 font-display text-2xl font-semibold tracking-tightest text-ink">{s.value}</p>
            <p className="mt-1 font-body text-xs uppercase tracking-widest text-stone">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <p className="font-body text-xs uppercase tracking-widest text-stone">Recent Orders</p>
          <Link href="/account/orders" className="font-body text-xs uppercase tracking-widest text-cobalt">
            View all
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="mt-4 font-body text-sm text-ink/50">No orders yet.</p>
        ) : (
          <div className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
            {orders.slice(0, 3).map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-body text-sm font-medium text-ink">#{o.number}</p>
                  <p className="font-body text-xs text-ink/50">
                    {new Date(o.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <StatusPill status={o.status} />
                <p className="font-body text-sm text-ink">{formatPrice(o.total)}</p>
                <Link href={`/track-order?order=${o.number}`} className="font-body text-xs uppercase tracking-widest text-cobalt">
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
