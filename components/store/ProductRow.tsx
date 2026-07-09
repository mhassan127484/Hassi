import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

export default function ProductRow({
  title,
  viewAllHref,
  products,
}: {
  title: string;
  viewAllHref: string;
  products: Product[];
}) {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10">
      <div className="flex items-end justify-between border-b border-ink/10 pb-6">
        <h2 className="font-display text-4xl font-semibold tracking-tightest text-ink md:text-6xl">
          {title}
        </h2>
        <Link href={viewAllHref} className="group flex items-center gap-2 font-body text-sm uppercase tracking-widest text-ink">
          View all
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
