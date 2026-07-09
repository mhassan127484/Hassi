"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Twitter, Facebook } from "lucide-react";
import { useToastStore } from "@/store/toast";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";

const columns = [
  { h: "Shop", links: [{ l: "Outerwear", href: "/shop?category=Outerwear" }, { l: "Knitwear", href: "/shop?category=Knitwear" }, { l: "Denim", href: "/shop?category=Denim" }, { l: "Accessories", href: "/shop?category=Accessories" }] },
  { h: "Collections", links: [{ l: "Vol. 01", href: "/collections" }, { l: "Vol. 02", href: "/collections" }, { l: "New Arrivals", href: "/shop" }, { l: "Best Sellers", href: "/shop" }] },
  { h: "Customer Service", links: [{ l: "Shipping", href: "/faq" }, { l: "Returns", href: "/faq" }, { l: "Track Order", href: "/track-order" }, { l: "Contact", href: "/contact" }] },
  { h: "Company", links: [{ l: "About", href: "/about" }, { l: "Blog", href: "/blog" }, { l: "FAQ", href: "/faq" }, { l: "Careers", href: "/about" }] },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const push = useToastStore((s) => s.push);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      const { alreadySubscribed } = await subscribeToNewsletter(email.trim());
      push(alreadySubscribed ? "You're already on the list." : "You're on the list. First look, coming soon.", "success");
      setEmail("");
    } catch {
      push("Something went wrong — try again.");
    }
  };

  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="mx-auto max-w-[1400px] px-6 pt-24 md:px-10">
        <div className="grid gap-12 md:grid-cols-6">
          <div className="md:col-span-2">
            <p className="font-display text-2xl">Join the list.</p>
            <p className="mt-3 max-w-xs font-body text-sm text-paper/60">
              First look at every drop. No noise, no daily emails — just the work.
            </p>
            <form onSubmit={subscribe} className="mt-6 flex items-center gap-3 border-b border-paper/25 pb-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full bg-transparent font-body text-sm text-paper placeholder:text-paper/40 focus:outline-none"
              />
              <button type="submit" className="font-body text-sm uppercase tracking-widest text-cobalt">
                Send
              </button>
            </form>
            <div className="mt-6 flex items-center gap-4 text-paper/60">
              <a href="#" aria-label="Instagram" className="transition-colors hover:text-paper"><Instagram className="h-4 w-4" strokeWidth={1.5} /></a>
              <a href="#" aria-label="Twitter" className="transition-colors hover:text-paper"><Twitter className="h-4 w-4" strokeWidth={1.5} /></a>
              <a href="#" aria-label="Facebook" className="transition-colors hover:text-paper"><Facebook className="h-4 w-4" strokeWidth={1.5} /></a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-4 md:grid-cols-4">
            {columns.map((col) => (
              <div key={col.h}>
                <p className="font-body text-xs uppercase tracking-widest text-paper/40">{col.h}</p>
                <ul className="mt-4 space-y-2">
                  {col.links.map((item) => (
                    <li key={item.l}>
                      <Link href={item.href} className="font-body text-sm text-paper/80 transition-colors hover:text-paper">
                        {item.l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          drag="x"
          dragConstraints={{ left: -120, right: 120 }}
          dragElastic={0.15}
          className="mt-16 cursor-grab select-none active:cursor-grabbing"
          data-cursor
        >
          <p className="font-display text-[22vw] font-semibold leading-none tracking-tightest text-paper">
            HASSI
          </p>
        </motion.div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-paper/15 py-8 font-body text-xs uppercase tracking-widest text-paper/50 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Hassi. Karachi.</span>
          <div className="flex items-center gap-3 text-paper/40">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>JazzCash</span>
            <span>Easypaisa</span>
            <span>COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
