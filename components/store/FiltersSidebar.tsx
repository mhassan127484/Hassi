import clsx from "clsx";
import { Category } from "@/types";
import { formatPrice } from "@/lib/data/products";

export const PRICE_MIN = 3000;
export const PRICE_MAX = 28000;

const swatchHexByName: Record<string, string> = {
  "Ink / Cobalt": "#111114",
  Ink: "#111114",
  Bone: "#E4E7F5",
  "Raw Indigo": "#1c2b6b",
  Charcoal: "#2A2A30",
  Stone: "#8A8681",
  Cobalt: "#2B4CF0",
  Clay: "#C9C2B4",
  Sand: "#E8E2D9",
  Moss: "#525F45",
  Rust: "#B5502D",
  Black: "#111114",
};

export const colorFacets = Array.from(new Set(Object.keys(swatchHexByName)));

export interface ShopFilters {
  category: Category | null;
  minPrice: number;
  maxPrice: number;
  colors: string[];
  sizes: string[];
  brands: string[];
}

export default function FiltersSidebar({
  filters,
  categories,
  brands,
  sizes: allSizes,
  setCategory,
  setMaxPrice,
  toggleColor,
  toggleSize,
  toggleBrand,
  onClear,
}: {
  filters: ShopFilters;
  categories: { name: Category }[];
  brands: string[];
  sizes: string[];
  setCategory: (c: Category | null) => void;
  setMaxPrice: (n: number) => void;
  toggleColor: (c: string) => void;
  toggleSize: (s: string) => void;
  toggleBrand: (b: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <p className="font-body text-xs uppercase tracking-widest text-stone">Filters</p>
        <button onClick={onClear} className="font-body text-xs uppercase tracking-widest text-cobalt">
          Clear all
        </button>
      </div>

      <div>
        <p className="font-body text-xs uppercase tracking-widest text-stone">Categories</p>
        <div className="mt-3 space-y-2">
          <button
            onClick={() => setCategory(null)}
            className={clsx(
              "block font-body text-sm transition-colors",
              filters.category === null ? "font-medium text-ink" : "text-ink/60 hover:text-ink"
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => setCategory(c.name)}
              className={clsx(
                "block font-body text-sm transition-colors",
                filters.category === c.name ? "font-medium text-ink" : "text-ink/60 hover:text-ink"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-body text-xs uppercase tracking-widest text-stone">Price</p>
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={500}
          value={filters.maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="mt-4 w-full accent-cobalt"
        />
        <div className="mt-1 flex justify-between font-body text-xs text-ink/50">
          <span>{formatPrice(PRICE_MIN)}</span>
          <span>Up to {formatPrice(filters.maxPrice)}</span>
        </div>
      </div>

      <div>
        <p className="font-body text-xs uppercase tracking-widest text-stone">Colors</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {colorFacets.map((name) => {
            const active = filters.colors.includes(name);
            return (
              <button
                key={name}
                aria-label={name}
                aria-pressed={active}
                title={name}
                onClick={() => toggleColor(name)}
                className={clsx(
                  "h-7 w-7 rounded-full border-2 transition-all",
                  active ? "border-cobalt" : "border-transparent hover:border-ink/30"
                )}
                style={{ background: swatchHexByName[name] }}
              />
            );
          })}
        </div>
      </div>

      <div>
        <p className="font-body text-xs uppercase tracking-widest text-stone">Size</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {allSizes.map((s) => {
            const active = filters.sizes.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleSize(s)}
                className={clsx(
                  "rounded-full border px-3 py-1.5 font-body text-xs transition-colors",
                  active ? "border-ink bg-ink text-paper" : "border-ink/20 text-ink/70 hover:border-ink/50"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="font-body text-xs uppercase tracking-widest text-stone">Brand</p>
        <div className="mt-3 space-y-2">
          {brands.map((b) => {
            const active = filters.brands.includes(b);
            return (
              <label key={b} className="flex items-center gap-2 font-body text-sm text-ink/70">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleBrand(b)}
                  className="h-4 w-4 accent-cobalt"
                />
                {b}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
