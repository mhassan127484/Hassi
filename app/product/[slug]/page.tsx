import { notFound } from "next/navigation";
import { getProduct, getRelatedProducts } from "@/lib/api/products";
import { formatPrice } from "@/lib/data/products";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Stars from "@/components/ui/Stars";
import Tabs from "@/components/ui/Tabs";
import ProductInteractive from "@/components/store/ProductInteractive";
import ProductTrustRow from "@/components/store/ProductTrustRow";
import RelatedProducts from "@/components/store/RelatedProducts";
import ReviewList from "@/components/store/ReviewList";
import WriteReviewSection from "@/components/store/WriteReviewSection";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-28 md:px-10 md:pt-36">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.category, href: `/shop?category=${encodeURIComponent(product.category)}` },
          { label: product.name },
        ]}
      />

      <ProductInteractive
        product={product}
        after={
          <>
            <ProductTrustRow />
            <div className="mt-12">
              <Tabs
                tabs={[
                  {
                    label: "Description",
                    content: <p className="max-w-xl font-body text-sm leading-relaxed text-ink/70">{product.description}</p>,
                  },
                  {
                    label: "Details",
                    content: (
                      <ul className="space-y-2">
                        {product.highlights.map((h) => (
                          <li key={h} className="flex gap-3 font-body text-sm text-ink/70">
                            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-cobalt" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                  {
                    label: "Size & Fit",
                    content: (
                      <dl className="divide-y divide-ink/10">
                        {Object.entries(product.details).map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-6 py-3">
                            <dt className="font-body text-xs uppercase tracking-widest text-stone">{k}</dt>
                            <dd className="text-right font-body text-sm text-ink">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    ),
                  },
                  {
                    label: "Shipping",
                    content: <p className="max-w-xl font-body text-sm leading-relaxed text-ink/70">{product.shipping}</p>,
                  },
                  {
                    label: "Returns",
                    content: <p className="max-w-xl font-body text-sm leading-relaxed text-ink/70">{product.returns}</p>,
                  },
                ]}
              />
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                <p className="font-body text-xs uppercase tracking-widest text-stone">
                  Reviews ({product.reviewCount})
                </p>
                <Stars rating={product.rating} />
              </div>
              <div className="mt-4">
                <WriteReviewSection productSlug={product.slug} />
              </div>
              <ReviewList reviews={product.reviews} />
            </div>
          </>
        }
      >
        <p className="font-body text-xs uppercase tracking-widest text-cobalt">
          {product.brand} · {product.drop}
        </p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tightest text-ink md:text-7xl">
          {product.name}
        </h1>
        <div className="mt-3">
          <Stars rating={product.rating} count={product.reviewCount} />
        </div>
        <p className="mt-4 flex items-baseline gap-3 font-body text-2xl text-ink">
          {formatPrice(product.price)}
          {product.compareAtPrice && (
            <span className="text-base text-ink/40 line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </p>
        <ul className="mt-6 space-y-1.5">
          {product.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex gap-2 font-body text-sm text-ink/70">
              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-ink/40" />
              {h}
            </li>
          ))}
        </ul>
      </ProductInteractive>

      <RelatedProducts products={related} />
    </div>
  );
}
