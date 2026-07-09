"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import ProductTile from "@/components/ProductTile";
import { ProductColor } from "@/types";

export default function ProductGallery({
  colors,
  activeIndex,
  onSelect,
  drop,
  indexLabel,
}: {
  colors: ProductColor[];
  activeIndex: number;
  onSelect: (i: number) => void;
  drop: string;
  indexLabel: string;
}) {
  const active = colors[activeIndex] ?? colors[0];

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <motion.div key={active.name} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
        <ProductTile
          tile={active.tile}
          image={active.image}
          label={`${drop} · ${active.name}`}
          indexLabel={indexLabel}
          className="aspect-[4/5] rounded-sm"
        />
      </motion.div>

      {colors.length > 1 && (
        <div className="mt-4 flex gap-3">
          {colors.map((c, i) => (
            <button
              key={c.name}
              onClick={() => onSelect(i)}
              aria-label={`View ${c.name}`}
              aria-current={i === activeIndex}
              className={clsx(
                "h-20 w-16 flex-shrink-0 overflow-hidden rounded-sm border-2 transition-colors",
                i === activeIndex ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <ProductTile tile={c.tile} image={c.image} className="h-full w-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
