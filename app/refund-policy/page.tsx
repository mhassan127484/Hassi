import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-[820px] px-6 pb-24 pt-28 md:px-10 md:pt-36">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Refund & Return" }]} />
      <h1 className="mt-6 font-display text-6xl font-semibold tracking-tightest text-ink md:text-7xl">
        Refund & Return
      </h1>
      <p className="mt-4 font-body text-sm text-ink/50">Last updated {new Date().getFullYear()}</p>

      <div className="mt-12 space-y-8 font-body text-sm leading-relaxed text-ink/70">
        <section>
          <h2 className="font-display text-xl font-semibold text-ink">30-day returns</h2>
          <p className="mt-3">
            We accept returns within 30 days of delivery on unworn, unwashed pieces with tags still attached. Start a
            return from Account → Orders, or submit a request from the Returns page.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Refunds</h2>
          <p className="mt-3">
            Store credit is issued instantly once a return is approved. If you'd prefer a refund to your original
            payment method instead, it arrives within 5–7 business days of approval.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Exchanges</h2>
          <p className="mt-3">
            Need a different size or color? Request a return and place a new order — this gets the replacement moving
            faster than a direct exchange.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">What's not eligible</h2>
          <p className="mt-3">
            Worn, washed, or altered items, and pieces without their original tags, can't be accepted for return.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Questions</h2>
          <p className="mt-3">Reach out at support@hassi.com and we'll help sort it out.</p>
        </section>
      </div>
    </div>
  );
}
