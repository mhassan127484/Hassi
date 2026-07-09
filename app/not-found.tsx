import { ArrowUpRight } from "lucide-react";
import ProductTile from "@/components/ProductTile";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-[1400px] items-center px-6 md:px-10">
      <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="font-display text-[9rem] font-semibold leading-none tracking-tightest text-ink lg:text-[11rem]">
            404
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tightest text-ink md:text-4xl">
            Page Not Found
          </h1>
          <p className="mt-4 max-w-sm font-body text-base text-ink/60">
            Sorry, the page you are looking for doesn&apos;t exist. It may have been moved or the drop has ended.
          </p>
          <Button href="/" className="mt-8">
            Go Home
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </Button>
        </div>
        <ProductTile tile={["#8A8681", "#111114"]} className="aspect-square rounded-sm" />
      </div>
    </div>
  );
}
