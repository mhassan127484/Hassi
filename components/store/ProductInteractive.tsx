"use client";

import { useState } from "react";
import { Product } from "@/types";
import ProductGallery from "./ProductGallery";
import AddToCartPanel from "./AddToCartPanel";

export default function ProductInteractive({
  product,
  children,
  after,
}: {
  product: Product;
  children: React.ReactNode;
  after: React.ReactNode;
}) {
  const [activeColorIndex, setActiveColorIndex] = useState(0);

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
      <ProductGallery
        colors={product.colors}
        activeIndex={activeColorIndex}
        onSelect={setActiveColorIndex}
        drop={product.drop}
        indexLabel={product.id}
      />

      <div className="max-w-xl">
        {children}
        <AddToCartPanel product={product} activeColorIndex={activeColorIndex} onColorChange={setActiveColorIndex} />
        {after}
      </div>
    </div>
  );
}
