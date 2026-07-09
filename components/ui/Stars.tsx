import { Star } from "lucide-react";
import clsx from "clsx";

export default function Stars({
  rating,
  count,
  size = 14,
  className,
}: {
  rating: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i + 1 <= Math.round(rating);
          return (
            <Star
              key={i}
              width={size}
              height={size}
              strokeWidth={1.5}
              className={filled ? "fill-cobalt text-cobalt" : "fill-transparent text-ink/25"}
            />
          );
        })}
      </div>
      {typeof count === "number" && (
        <span className="font-body text-xs text-ink/50">({count})</span>
      )}
    </div>
  );
}
