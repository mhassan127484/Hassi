import { DollarSign, ShoppingCart, Percent } from "lucide-react";
import { getAllOrdersForAdmin } from "@/lib/actions/orders";
import { revenueOverview } from "@/lib/data/analytics";
import { formatPrice } from "@/lib/data/products";
import StatCard from "@/components/admin/StatCard";
import LineChartCard from "@/components/admin/LineChartCard";
import CategoryDonut from "@/components/admin/CategoryDonut";

export default async function AdminAnalyticsPage() {
  const orders = await getAllOrdersForAdmin();
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { icon: DollarSign, label: "Total Revenue", value: formatPrice(totalRevenue), delta: 14 },
    { icon: ShoppingCart, label: "Total Orders", value: String(orders.length), delta: 8 },
    { icon: Percent, label: "Conversion Rate", value: "3.45%", delta: 2 },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tightest text-ink">Analytics</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <LineChartCard title="Revenue Overview" data={revenueOverview} dataKey="revenue" xKey="month" />
        <CategoryDonut />
      </div>
    </div>
  );
}
