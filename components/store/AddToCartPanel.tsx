"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import clsx from "clsx";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart";
import { useToastStore } from "@/store/toast";
import Magnetic from "@/components/Magnetic";
import QuantityStepper from "@/components/ui/QuantityStepper";
import Button from "@/components/ui/Button";

export default function AddToCartPanel({
  product,
  activeColorIndex,
  onColorChange,
}: {
  product: Product;
  activeColorIndex: number;
  onColorChange: (i: number) => void;
}) {
  const router = useRouter();
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const push = useToastStore((s) => s.push);

  const activeColor = product.colors[activeColorIndex] ?? product.colors[0];
  const outOfStock = product.stock <= 0;

  const buildLine = () => ({
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    color: activeColor.name,
    colorTile: activeColor.tile,
    size: size!,
    qty,
  });

  const handleAdd = () => {
    if (!size) return;
    addItem(buildLine());
    setAdded(true);
    push(`${product.name} added to bag`, "success");
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    if (!size) return;
    addItem(buildLine());
    router.push("/checkout");
  };

  return (
    <div className="mt-10">
      <p className="font-body text-xs uppercase tracking-widest text-stone">
        Color — {activeColor.name}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {product.colors.map((c, i) => (
          <button
            key={c.name}
            onClick={() => onColorChange(i)}
            aria-label={c.name}
            aria-pressed={i === activeColorIndex}
            className={clsx(
              "h-9 w-9 rounded-full border-2 transition-all",
              i === activeColorIndex ? "border-cobalt" : "border-transparent hover:border-ink/30"
            )}
            style={{ background: c.hex }}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="font-body text-xs uppercase tracking-widest text-stone">Size</p>
        <span className="font-body text-xs text-ink/50">{outOfStock ? "Out of stock" : `${product.stock} in stock`}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {product.sizes.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            disabled={outOfStock}
            className={clsx(
              "flex h-11 min-w-[2.75rem] items-center justify-center rounded-full border px-3 font-body text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40",
              size === s ? "border-ink bg-ink text-paper" : "border-ink/20 text-ink hover:border-ink/50"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <p className="font-body text-xs uppercase tracking-widest text-stone">Qty</p>
        <QuantityStepper value={qty} onChange={setQty} max={product.stock || 1} />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Magnetic className="flex-1">
          <button
            onClick={handleAdd}
            disabled={!size || outOfStock}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-cobalt px-8 py-4 font-body text-sm uppercase tracking-widest text-paper transition-all hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            {added ? (
              <>
                <Check className="h-4 w-4" strokeWidth={2.5} /> Added
              </>
            ) : outOfStock ? (
              "Out of stock"
            ) : size ? (
              "Add to Cart"
            ) : (
              "Select a size"
            )}
          </button>
        </Magnetic>
        <Button variant="secondary" size="lg" onClick={handleBuyNow} disabled={!size || outOfStock} className="flex-1">
          Buy Now
        </Button>
      </div>
    </div>
  );
}
