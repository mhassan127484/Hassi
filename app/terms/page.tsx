import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[820px] px-6 pb-24 pt-28 md:px-10 md:pt-36">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]} />
      <h1 className="mt-6 font-display text-6xl font-semibold tracking-tightest text-ink md:text-7xl">
        Terms & Conditions
      </h1>
      <p className="mt-4 font-body text-sm text-ink/50">Last updated {new Date().getFullYear()}</p>

      <div className="mt-12 space-y-8 font-body text-sm leading-relaxed text-ink/70">
        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Using this site</h2>
          <p className="mt-3">
            By browsing or ordering from Hassi, you agree to these terms. We may update them from time to time; the
            version posted here is always the one in effect.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Orders and pricing</h2>
          <p className="mt-3">
            All prices are shown in USD and may change without notice. We reserve the right to limit quantities,
            refuse an order, or correct pricing errors before an order ships. Placing an order is an offer to
            purchase, which we accept once your order is confirmed.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Accounts</h2>
          <p className="mt-3">
            You're responsible for keeping your account credentials secure and for all activity under your account.
            Let us know immediately if you suspect unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Intellectual property</h2>
          <p className="mt-3">
            All product photography, designs, and content on this site belong to Hassi and may not be reproduced
            without permission.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Limitation of liability</h2>
          <p className="mt-3">
            Hassi isn't liable for indirect or incidental damages arising from use of this site or its products,
            beyond the value of the order in question.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Contact</h2>
          <p className="mt-3">Questions about these terms? Reach us at support@hassi.com.</p>
        </section>
      </div>
    </div>
  );
}
