import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

const items = [
  { icon: Truck, label: "Free Shipping", sub: "Orders over PKR 15,000" },
  { icon: RotateCcw, label: "Easy Returns", sub: "30-day window" },
  { icon: ShieldCheck, label: "Secure Payment", sub: "COD available" },
];

export default function ProductTrustRow() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-4 rounded-sm border border-ink/10 p-5 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <item.icon className="h-5 w-5 flex-shrink-0 text-cobalt" strokeWidth={1.5} />
          <div>
            <p className="font-body text-xs font-medium text-ink">{item.label}</p>
            <p className="font-body text-[11px] text-ink/50">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
