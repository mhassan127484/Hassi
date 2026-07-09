"use client";

import { useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, User, Heart } from "lucide-react";

const links = [
  { href: "/shop", label: "New In" },
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[65] bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-y-0 right-0 z-[66] flex w-full max-w-sm flex-col bg-paper p-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between">
              <Link href="/" onClick={onClose} className="font-display text-2xl font-semibold tracking-tightest text-ink">
                Hassi<span className="text-cobalt">.</span>
              </Link>
              <button onClick={onClose} aria-label="Close menu" className="text-ink">
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>

            <nav className="mt-12 flex flex-col gap-6">
              {links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={onClose}
                  className="font-display text-3xl font-medium tracking-tightest text-ink transition-colors hover:text-cobalt"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex items-center gap-6 border-t border-ink/10 pt-6">
              <Link href="/account" onClick={onClose} className="flex items-center gap-2 font-body text-sm uppercase tracking-widest text-ink/70">
                <User className="h-4 w-4" strokeWidth={1.5} /> Account
              </Link>
              <Link href="/wishlist" onClick={onClose} className="flex items-center gap-2 font-body text-sm uppercase tracking-widest text-ink/70">
                <Heart className="h-4 w-4" strokeWidth={1.5} /> Wishlist
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
