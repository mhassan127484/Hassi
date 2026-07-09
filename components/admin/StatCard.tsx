import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";

const TONES = {
  cobalt: "bg-cobalt/10 text-cobalt",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  rose: "bg-rose-100 text-rose-700",
} as const;

export default function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  tone = "cobalt",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta: number;
  tone?: keyof typeof TONES;
}) {
  const positive = delta >= 0;
  return (
    <div className="group rounded-sm border border-ink/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className={clsx("flex h-10 w-10 items-center justify-center rounded-full transition-transform group-hover:scale-105", TONES[tone])}>
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <span
          className={clsx(
            "flex items-center gap-1 rounded-full px-2 py-1 font-body text-xs font-medium",
            positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
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
