import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Accordion from "@/components/ui/Accordion";

const faqs = [
  {
    question: "How can I track my order?",
    answer:
      "Head to the Track Order page and enter your order number — you'll see live status from Order Placed through Delivered. You can also find every order under Account → Orders.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer 30-day returns on unworn pieces with tags attached. Store credit is issued instantly; refunds to your original payment method arrive within 5–7 business days.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 5–7 business days and is free on orders over $50. Express shipping arrives in 2–3 business days for a flat $5.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes — we currently ship to the United States, United Kingdom, United Arab Emirates, Canada, and Pakistan, with more regions added each season.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "Reach us anytime via the Contact page, email support@hassi.com, or call +1 234 567 890. We reply within a day.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 pb-24 pt-28 md:px-10 md:pt-36">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
      <h1 className="mt-6 font-display text-6xl font-semibold tracking-tightest text-ink md:text-7xl">
        FAQ
      </h1>
      <p className="mt-4 max-w-md font-body text-base text-ink/60">
        Everything you need to know about shopping with Hassi.
      </p>
      <div className="mt-12">
        <Accordion items={faqs} />
      </div>
    </div>
  );
}
