import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";

export default function StatCard({
  icon: Icon,
  label,
  value,
  delta,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta: number;
}) {
  const positive = delta >= 0;
  return (
    <div className="rounded-sm border border-ink/10 bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cobalt/10">
          <Icon className="h-5 w-5 text-cobalt" strokeWidth={1.5} />
        </div>
        <span
          className={clsx(
            "flex items-center gap-1 font-body text-xs font-medium",
            positive ? "text-emerald-600" : "text-red-500"
          )}
        >
          {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {Math.abs(delta)}%
        </span>
      </div>
      <p className="mt-5 font-display text-3xl font-semibold tracking-tightest text-ink">{value}</p>
      <p className="mt-1 font-body text-xs uppercase tracking-widest text-stone">{label}</p>
    </div>
  );
}
