"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, ShoppingBag, Heart, User, Menu } from "lucide-react";
import clsx from "clsx";
import { useCartStore, cartCount } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import SearchOverlay from "./store/SearchOverlay";
import MobileDrawer from "./store/MobileDrawer";

const navLinks = [
  { href: "/shop", label: "New In" },
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const items = useCartStore((s) => s.items);
  const wishlistCount = useWishlistStore((s) => s.slugs.length);
  const bagCount = cartCount(items);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-40 transition-all duration-500",
          scrolled
            ? "border-b border-ink/10 bg-paper/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
          <Link href="/" className="font-display text-2xl font-semibold tracking-tightest text-ink">
            Hassi<span className="text-cobalt">.</span>
          </Link>

          <div className="hidden items-center gap-9 font-body text-sm uppercase tracking-widest text-ink/70 lg:flex">
            {navLinks.map((l) => (
              <Link key={l.label} href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-5 text-ink">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="transition-colors hover:text-cobalt"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <Link href="/wishlist" aria-label="Wishlist" className="relative hidden transition-colors hover:text-cobalt sm:block">
              <Heart className="h-5 w-5" strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-cobalt text-[10px] font-medium text-paper">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/account" aria-label="Account" className="hidden transition-colors hover:text-cobalt sm:block">
              <User className="h-5 w-5" strokeWidth={1.5} />
            </Link>

            <Link href="/cart" aria-label="Cart" className="group relative flex items-center gap-2 font-body text-sm uppercase tracking-widest">
              <span className="relative">
                <ShoppingBag className="h-5 w-5 transition-colors group-hover:text-cobalt" strokeWidth={1.5} />
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-cobalt text-[10px] font-medium text-paper">
                  {bagCount}
                </span>
              </span>
            </Link>

            <button aria-label="Open menu" onClick={() => setDrawerOpen(true)} className="lg:hidden">
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </nav>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
