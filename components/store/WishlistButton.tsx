"use client";

import { Heart } from "lucide-react";
import clsx from "clsx";
import { useWishlistStore } from "@/store/wishlist";
import { useToastStore } from "@/store/toast";

export default function WishlistButton({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const has = useWishlistStore((s) => s.has(slug));
  const toggle = useWishlistStore((s) => s.toggle);
  const push = useToastStore((s) => s.push);

  return (
    <button
      type="button"
      aria-label={has ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={has}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
        push(has ? "Removed from wishlist" : "Added to wishlist", "success");
      }}
      className={clsx(
        "flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 backdrop-blur transition-colors hover:bg-paper",
        className
      )}
    >
      <Heart
        className={clsx("h-4 w-4 transition-colors", has ? "fill-cobalt text-cobalt" : "text-ink")}
        strokeWidth={1.5}
      />
    </button>
  );
}
