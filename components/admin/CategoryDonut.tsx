"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { salesByCategory } from "@/lib/data/analytics";

export default function CategoryDonut() {
  return (
    <div className="rounded-sm border border-ink/10 bg-white p-6">
      <p className="font-body text-xs uppercase tracking-widest text-stone">Sales by Category</p>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={salesByCategory} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
              {salesByCategory.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value}%`, String(name)]}
              contentStyle={{ borderRadius: 4, border: "1px solid #11111420", fontSize: 12 }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span className="font-body text-xs text-ink/70">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
