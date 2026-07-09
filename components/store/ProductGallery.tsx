"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import ProductTile from "@/components/ProductTile";
import { ProductColor } from "@/types";

const FALLBACK_TILE: [string, string] = ["#111114", "#2A2A30"];

export default function ProductGallery({
  colors,
  images = [],
  activeIndex,
  onSelect,
  drop,
  indexLabel,
}: {
  colors: ProductColor[];
  images?: string[];
  activeIndex: number;
  onSelect: (i: number) => void;
  drop: string;
  indexLabel: string;
}) {
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const active = colors[activeIndex] ?? colors[0];
  const showPhoto = activePhoto !== null;
  const heroImage = showPhoto ? images[activePhoto] : active.image;
  const heroTile = showPhoto ? FALLBACK_TILE : active.tile;

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <motion.div key={showPhoto ? `photo-${activePhoto}` : active.name} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
        <ProductTile
          tile={heroTile}
          image={heroImage}
          label={showPhoto ? drop : `${drop} · ${active.name}`}
          indexLabel={indexLabel}
          className="aspect-[4/5] rounded-sm"
        />
      </motion.div>

      {(images.length > 0 || colors.length > 1) && (
        <div className="mt-4 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <button
              key={`photo-${i}`}
              onClick={() => setActivePhoto(i)}
              aria-label={`View photo ${i + 1}`}
              aria-current={showPhoto && i === activePhoto}
              className={clsx(
                "h-20 w-16 flex-shrink-0 overflow-hidden rounded-sm border-2 transition-colors",
                showPhoto && i === activePhoto ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <ProductTile tile={FALLBACK_TILE} image={img} className="h-full w-full" />
            </button>
          ))}
          {colors.map((c, i) => (
            <button
              key={c.name}
              onClick={() => {
                setActivePhoto(null);
                onSelect(i);
              }}
              aria-label={`View ${c.name}`}
              aria-current={!showPhoto && i === activeIndex}
              className={clsx(
                "h-20 w-16 flex-shrink-0 overflow-hidden rounded-sm border-2 transition-colors",
                !showPhoto && i === activeIndex ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
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
