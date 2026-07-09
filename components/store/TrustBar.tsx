import { Truck, RotateCcw, ShieldCheck, Headset } from "lucide-react";

const items = [
  { icon: Truck, label: "Free Shipping", sub: "On orders over PKR 15,000" },
  { icon: RotateCcw, label: "Easy Returns", sub: "30-day return window" },
  { icon: ShieldCheck, label: "Secure Payment", sub: "COD · JazzCash · Easypaisa" },
  { icon: Headset, label: "24/7 Support", sub: "We reply within a day" },
];

export default function TrustBar() {
  return (
    <section className="border-b border-ink/10">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4 md:px-10">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <item.icon className="h-6 w-6 flex-shrink-0 text-cobalt" strokeWidth={1.5} />
            <div>
              <p className="font-body text-sm font-medium text-ink">{item.label}</p>
              <p className="font-body text-xs text-ink/50">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
