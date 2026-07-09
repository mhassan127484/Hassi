const items = [
  "Free shipping over PKR 15,000",
  "Vol. 01 — now live",
  "Made for Karachi weather",
  "COD · JazzCash · Easypaisa",
  "30-day returns",
];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-ink/10 bg-cobalt py-3 text-paper">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {row.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-body text-sm uppercase tracking-widest"
          >
            {t}
            <span aria-hidden className="text-paper/50">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
