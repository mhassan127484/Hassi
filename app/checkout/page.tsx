"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { CreditCard } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/store/cart";
import { createOrder } from "@/lib/actions/orders";
import { formatPrice } from "@/lib/data/products";
import { Address } from "@/types";
import ProductTile from "@/components/ProductTile";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { ShoppingBag } from "lucide-react";

type FormState = Address & { email: string };

const FREE_SHIPPING_THRESHOLD = 50;
const EXPRESS_COST = 5;

const initialForm: FormState = {
  email: "",
  fullName: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  phone: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, promo, clear } = useCartStore();

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [shippingMethod, setShippingMethod] = useState<"Standard" | "Express">("Standard");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = useMemo(() => cartSubtotal(items), [items]);
  const baseShipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 5;
  const shipping = shippingMethod === "Express" ? baseShipping + EXPRESS_COST : baseShipping;
  const discount = promo ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discount;

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.fullName.trim()) next.fullName = "Required";
    if (!form.address.trim()) next.address = "Required";
    if (!form.city.trim()) next.city = "Required";
    if (!form.state.trim()) next.state = "Required";
    if (!form.zip.trim()) next.zip = "Required";
    if (!form.phone.trim()) next.phone = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || items.length === 0) return;
    setSubmitting(true);

    const address: Address = {
      fullName: form.fullName,
      address: form.address,
      apartment: form.apartment,
      city: form.city,
      state: form.state,
      zip: form.zip,
      country: form.country,
      phone: form.phone,
    };

    try {
      const { number } = await createOrder({
        items,
        email: form.email,
        address,
        shippingMethod,
        subtotal,
        shipping,
        discount,
        total,
      });
      clear();
      router.push(`/checkout/success?order=${number}`);
    } catch {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-16">
        <EmptyState
          icon={ShoppingBag}
          eyebrow="Checkout"
          title="Your bag is empty."
          description="Add something to your bag before checking out."
          actionLabel="Go to shop"
          actionHref="/shop"
        />
      </div>
    );
  }

  const inputClass = (key: keyof FormState) =>
    clsx(
      "w-full rounded-sm border bg-transparent px-4 py-3 font-body text-sm text-ink placeholder:text-ink/40 focus:outline-none",
      errors[key] ? "border-red-400" : "border-ink/20 focus:border-ink/60"
    );

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-28 md:px-10 md:pt-36">
      <h1 className="font-display text-5xl font-semibold tracking-tightest text-ink md:text-7xl">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10">
          <section>
            <h2 className="font-body text-xs uppercase tracking-widest text-stone">Contact Information</h2>
            <div className="mt-4">
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={update("email")}
                className={inputClass("email")}
              />
              {errors.email && <p className="mt-1 font-body text-xs text-red-500">{errors.email}</p>}
              <label className="mt-3 flex items-center gap-2 font-body text-xs text-ink/50">
                <input type="checkbox" className="h-3.5 w-3.5 accent-cobalt" defaultChecked />
                Email me with news and offers
              </label>
            </div>
          </section>

          <section>
            <h2 className="font-body text-xs uppercase tracking-widest text-stone">Shipping Address</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <input placeholder="Full name" value={form.fullName} onChange={update("fullName")} className={inputClass("fullName")} />
                {errors.fullName && <p className="mt-1 font-body text-xs text-red-500">{errors.fullName}</p>}
              </div>
              <div className="sm:col-span-2">
                <input placeholder="Address" value={form.address} onChange={update("address")} className={inputClass("address")} />
                {errors.address && <p className="mt-1 font-body text-xs text-red-500">{errors.address}</p>}
              </div>
              <div className="sm:col-span-2">
                <input placeholder="Apartment, suite, etc. (optional)" value={form.apartment} onChange={update("apartment")} className={inputClass("apartment")} />
              </div>
              <div>
                <input placeholder="City" value={form.city} onChange={update("city")} className={inputClass("city")} />
                {errors.city && <p className="mt-1 font-body text-xs text-red-500">{errors.city}</p>}
              </div>
              <div>
                <input placeholder="State / Province" value={form.state} onChange={update("state")} className={inputClass("state")} />
                {errors.state && <p className="mt-1 font-body text-xs text-red-500">{errors.state}</p>}
              </div>
              <div>
                <input placeholder="ZIP / Postal code" value={form.zip} onChange={update("zip")} className={inputClass("zip")} />
                {errors.zip && <p className="mt-1 font-body text-xs text-red-500">{errors.zip}</p>}
              </div>
              <div>
                <select value={form.country} onChange={update("country")} className={inputClass("country")}>
                  <option>United States</option>
                  <option>Pakistan</option>
                  <option>United Kingdom</option>
                  <option>United Arab Emirates</option>
                  <option>Canada</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <input placeholder="Phone number" value={form.phone} onChange={update("phone")} className={inputClass("phone")} />
                {errors.phone && <p className="mt-1 font-body text-xs text-red-500">{errors.phone}</p>}
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-body text-xs uppercase tracking-widest text-stone">Shipping Method</h2>
            <div className="mt-4 space-y-3">
              {(["Standard", "Express"] as const).map((m) => (
                <label
                  key={m}
                  className={clsx(
                    "flex cursor-pointer items-center justify-between rounded-sm border p-4 transition-colors",
                    shippingMethod === m ? "border-ink" : "border-ink/15 hover:border-ink/30"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === m}
                      onChange={() => setShippingMethod(m)}
                      className="h-4 w-4 accent-cobalt"
                    />
                    <span className="font-body text-sm text-ink">
                      {m === "Standard" ? "Standard Shipping — 5–7 business days" : "Express Shipping — 2–3 business days"}
                    </span>
                  </span>
                  <span className="font-body text-sm text-ink/70">
                    {m === "Standard" ? (baseShipping === 0 ? "Free" : formatPrice(baseShipping)) : formatPrice(baseShipping + EXPRESS_COST)}
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-sm border border-ink/10 p-6">
            <p className="font-body text-xs uppercase tracking-widest text-stone">Order Summary</p>
            <div className="mt-4 space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.color}-${item.size}`} className="flex items-center gap-3">
                  <ProductTile tile={item.colorTile} className="h-14 w-12 flex-shrink-0 rounded-sm" />
                  <div className="flex-1">
                    <p className="font-body text-sm text-ink">{item.name}</p>
                    <p className="font-body text-xs text-ink/50">
                      {item.color} · {item.size} · Qty {item.qty}
                    </p>
                  </div>
                  <p className="font-body text-sm text-ink">{formatPrice(item.price * item.qty)}</p>
                </div>
              ))}
            </div>
            <dl className="mt-6 space-y-3 border-t border-ink/10 pt-6">
              <div className="flex justify-between font-body text-sm text-ink/70">
                <dt>Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between font-body text-sm text-ink/70">
                <dt>Shipping</dt>
                <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between font-body text-sm text-cobalt">
                  <dt>Discount</dt>
                  <dd>-{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-ink/10 pt-3 font-body text-base font-medium text-ink">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-sm border border-ink/10 p-6">
            <p className="font-body text-xs uppercase tracking-widest text-stone">Payment Method</p>
            <div className="mt-4 space-y-3">
              <label
                className={clsx(
                  "flex cursor-pointer items-center justify-between rounded-sm border p-4 transition-colors",
                  paymentMethod === "card" ? "border-ink" : "border-ink/15 hover:border-ink/30"
                )}
              >
                <span className="flex items-center gap-3">
                  <input type="radio" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="h-4 w-4 accent-cobalt" />
                  <CreditCard className="h-4 w-4 text-ink/60" strokeWidth={1.5} />
                  <span className="font-body text-sm text-ink">Card ending 4242</span>
                </span>
              </label>
              <label
                className={clsx(
                  "flex cursor-pointer items-center justify-between rounded-sm border p-4 transition-colors",
                  paymentMethod === "cod" ? "border-ink" : "border-ink/15 hover:border-ink/30"
                )}
              >
                <span className="flex items-center gap-3">
                  <input type="radio" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="h-4 w-4 accent-cobalt" />
                  <span className="font-body text-sm text-ink">Cash on Delivery</span>
                </span>
              </label>
            </div>
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Placing order..." : "Pay Now"}
          </Button>
          <Link href="/cart" className="block text-center font-body text-xs uppercase tracking-widest text-ink/50 hover:text-ink">
            Back to bag
          </Link>
        </div>
      </form>
    </div>
  );
}
