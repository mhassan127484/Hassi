import clsx from "clsx";

export function Badge({
  children,
  tone = "ink",
  className,
}: {
  children: React.ReactNode;
  tone?: "ink" | "cobalt" | "stone" | "outline";
  className?: string;
}) {
  const tones: Record<string, string> = {
    ink: "bg-ink text-paper",
    cobalt: "bg-cobalt text-paper",
    stone: "bg-stone text-paper",
    outline: "border border-ink/20 text-ink",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 font-body text-[10px] uppercase tracking-widest",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const STATUS_TONES: Record<string, string> = {
  Delivered: "bg-emerald-100 text-emerald-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Placed: "bg-stone/20 text-ink/70",
  "Out for Delivery": "bg-cobalt/10 text-cobalt",
  Cancelled: "bg-red-100 text-red-600",
  Active: "bg-emerald-100 text-emerald-700",
  Draft: "bg-stone/20 text-ink/70",
  Archived: "bg-red-100 text-red-600",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 font-body text-xs font-medium",
        STATUS_TONES[status] ?? "bg-stone/20 text-ink/70"
      )}
    >
      {status}
    </span>
  );
}
