import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-[820px] px-6 pb-24 pt-28 md:px-10 md:pt-36">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <h1 className="mt-6 font-display text-6xl font-semibold tracking-tightest text-ink md:text-7xl">
        Privacy Policy
      </h1>
      <p className="mt-4 font-body text-sm text-ink/50">Last updated {new Date().getFullYear()}</p>

      <div className="mt-12 space-y-8 font-body text-sm leading-relaxed text-ink/70">
        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Information we collect</h2>
          <p className="mt-3">
            When you create an account, place an order, or contact us, we collect the information you provide directly —
            your name, email, shipping address, phone number, and payment details. We also collect basic usage data
            (pages visited, device type, browser) to keep the site running smoothly and secure.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">How we use it</h2>
          <p className="mt-3">
            We use your information to process orders, provide customer support, send order and shipping updates, and —
            only if you opt in — send occasional news about new drops. We never sell your personal information to
            third parties.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Cookies</h2>
          <p className="mt-3">
            We use cookies to keep you signed in, remember your cart and wishlist, and understand how the site is used
            so we can improve it. You can disable cookies in your browser settings, though some features (like your
            cart) may stop working correctly.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Data sharing</h2>
          <p className="mt-3">
            We share information only with the services that help us operate — payment processors, shipping carriers,
            and infrastructure providers — and only to the extent needed to fulfill your order.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Your rights</h2>
          <p className="mt-3">
            You can request a copy of your data, ask us to correct it, or ask us to delete your account at any time by
            contacting support@hassi.com.
          </p>
        </section>
      </div>
    </div>
  );
}
