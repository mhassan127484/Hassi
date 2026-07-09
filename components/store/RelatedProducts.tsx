import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

export default function RelatedProducts({ title = "You may also like", products }: { title?: string; products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10">
      <h2 className="border-b border-ink/10 pb-6 font-display text-4xl font-semibold tracking-tightest text-ink md:text-5xl">
        {title}
      </h2>
      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
