"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Instagram, Facebook, Check } from "lucide-react";
import { submitContactForm } from "@/lib/api";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";

const info = [
  { icon: Mail, label: "Email", value: "support@hassi.com" },
  { icon: Phone, label: "Phone", value: "+1 234 567 890" },
  { icon: MapPin, label: "Address", value: "123 Fashion Street, Karachi, Pakistan" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await submitContactForm(form);
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-28 md:px-10 md:pt-36">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <h1 className="mt-6 font-display text-6xl font-semibold tracking-tightest text-ink md:text-7xl">
        Get in Touch
      </h1>

      <div className="mt-12 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="max-w-sm font-body text-base text-ink/60">
            We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as we can.
          </p>
          <div className="mt-10 space-y-6">
            {info.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <item.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-cobalt" strokeWidth={1.5} />
                <div>
                  <p className="font-body text-xs uppercase tracking-widest text-stone">{item.label}</p>
                  <p className="mt-1 font-body text-sm text-ink">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex items-center gap-4 text-ink/50">
            <a href="#" aria-label="Instagram" className="transition-colors hover:text-ink"><Instagram className="h-5 w-5" strokeWidth={1.5} /></a>
            <a href="#" aria-label="Facebook" className="transition-colors hover:text-ink"><Facebook className="h-5 w-5" strokeWidth={1.5} /></a>
          </div>
        </div>

        <div>
          {submitted ? (
            <div className="flex flex-col items-start gap-4 rounded-sm border border-ink/10 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <Check className="h-6 w-6 text-emerald-600" strokeWidth={2.5} />
              </div>
              <h2 className="font-display text-2xl font-semibold tracking-tightest text-ink">Message sent.</h2>
              <p className="font-body text-sm text-ink/60">Thanks for reaching out — we&apos;ll get back to you within a day.</p>
              <Button variant="secondary" onClick={() => setSubmitted(false)}>Send another message</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <input
                required
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-sm border border-ink/20 bg-transparent px-4 py-3 font-body text-sm text-ink placeholder:text-ink/40 focus:border-ink/60 focus:outline-none"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-sm border border-ink/20 bg-transparent px-4 py-3 font-body text-sm text-ink placeholder:text-ink/40 focus:border-ink/60 focus:outline-none"
              />
              <input
                required
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="rounded-sm border border-ink/20 bg-transparent px-4 py-3 font-body text-sm text-ink placeholder:text-ink/40 focus:border-ink/60 focus:outline-none sm:col-span-2"
              />
              <textarea
                required
                rows={5}
                placeholder="Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="rounded-sm border border-ink/20 bg-transparent px-4 py-3 font-body text-sm text-ink placeholder:text-ink/40 focus:border-ink/60 focus:outline-none sm:col-span-2"
              />
              <Button type="submit" disabled={submitting} className="sm:col-span-2">
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
