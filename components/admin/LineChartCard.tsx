"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatPrice } from "@/lib/data/products";

export default function LineChartCard<T extends Record<string, unknown>>({
  title,
  data,
  dataKey,
  xKey,
  currency = true,
}: {
  title: string;
  data: T[];
  dataKey: string;
  xKey: string;
  /** Format tooltip values as PKR currency. Defaults to true since every current usage is a currency series. */
  currency?: boolean;
}) {
  return (
    <div className="rounded-sm border border-ink/10 bg-white p-6">
      <p className="font-body text-xs uppercase tracking-widest text-stone">{title}</p>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="#11111412" vertical={false} />
            <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#8A8681" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#8A8681" }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value) => (currency ? formatPrice(Number(value)) : String(value))}
              contentStyle={{ borderRadius: 4, border: "1px solid #11111420", fontSize: 12, fontFamily: "var(--font-body)" }}
            />
            <Line type="monotone" dataKey={dataKey} stroke="#2B4CF0" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
