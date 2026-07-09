import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { getAllOrdersForAdmin } from "@/lib/actions/orders";
import { getAdminProducts } from "@/lib/actions/admin-products";
import { salesOverview } from "@/lib/data/analytics";
import { formatPrice } from "@/lib/data/products";
import StatCard from "@/components/admin/StatCard";
import LineChartCard from "@/components/admin/LineChartCard";
import ProductTile from "@/components/ProductTile";

export default async function AdminDashboardPage() {
  const [orders, products] = await Promise.all([getAllOrdersForAdmin(), getAdminProducts()]);

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const topProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);

  const stats = [
    { icon: DollarSign, label: "Total Sales", value: formatPrice(totalSales), delta: 12 },
    { icon: ShoppingCart, label: "Orders", value: String(orders.length), delta: 8 },
    { icon: Users, label: "Customers", value: String(new Set(orders.map((o) => o.email)).size), delta: 15 },
    { icon: TrendingUp, label: "Revenue", value: formatPrice(totalSales), delta: 10 },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tightest text-ink">Dashboard</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <LineChartCard title="Sales Overview" data={salesOverview} dataKey="sales" xKey="month" />

        <div className="rounded-sm border border-ink/10 bg-white p-6">
          <p className="font-body text-xs uppercase tracking-widest text-stone">Top Products</p>
          {topProducts.length === 0 ? (
            <p className="mt-4 font-body text-sm text-ink/50">No products yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {topProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <ProductTile tile={p.colors[0]?.tile ?? ["#111114", "#2A2A30"]} image={p.colors[0]?.image ?? p.images[0]} className="h-12 w-10 flex-shrink-0 rounded-sm" />
                  <div className="flex-1">
                    <p className="font-body text-sm text-ink">{p.name}</p>
                    <p className="font-body text-xs text-ink/50">{p.reviewCount} reviews</p>
                  </div>
                  <p className="font-body text-sm text-ink">{formatPrice(p.price)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
