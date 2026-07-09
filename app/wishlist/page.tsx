import Breadcrumbs from "@/components/ui/Breadcrumbs";
import WishlistGrid from "@/components/store/WishlistGrid";

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-28 md:px-10 md:pt-36">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <h1 className="mt-6 font-display text-6xl font-semibold tracking-tightest text-ink md:text-8xl">
        Wishlist
      </h1>
      <div className="mt-12">
        <WishlistGrid />
      </div>
    </div>
  );
}
