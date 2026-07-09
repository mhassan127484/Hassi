import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductTile from "@/components/ProductTile";

const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "50+", label: "Stockists" },
  { value: "100%", label: "Quality Promise" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-28 md:px-10 md:pt-36">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="font-body text-xs uppercase tracking-widest text-cobalt">The studio</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] tracking-tightest text-ink md:text-6xl">
            Redefining Style.
            <br />
            Elevating Confidence.
          </h1>
          <div className="mt-8 space-y-5 font-body text-base leading-relaxed text-ink/70">
            <p>
              Hassi started as a question: could a small studio make pieces that stood next
              to anything coming out of Milan or Tokyo, without pretending to be from either place.
            </p>
            <p>
              We make a small number of things, slowly — considered outerwear, knitwear, denim, and the
              accessories that finish a rotation. Every piece is built from fabric that ages toward
              character, cut to move, and finished so you forget you&apos;re wearing it.
            </p>
            <p>
              No seasons chasing seasons. Two drops a year, each smaller than the last season&apos;s noise
              and larger in what it actually replaces in your closet.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-ink/10 pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-semibold tracking-tightest text-ink md:text-4xl">{s.value}</p>
                <p className="mt-1 font-body text-xs uppercase tracking-widest text-stone">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <ProductTile tile={["#111114", "#2A2A30"]} className="aspect-[4/5] rounded-sm lg:sticky lg:top-28 lg:self-start" />
      </div>
    </div>
  );
}
