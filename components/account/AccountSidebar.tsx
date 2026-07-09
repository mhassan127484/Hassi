"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, User, MapPin, Heart, Star, RotateCcw, LogOut } from "lucide-react";
import clsx from "clsx";
import { useToastStore } from "@/store/toast";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/reviews", label: "Reviews", icon: Star },
  { href: "/account/returns", label: "Returns", icon: RotateCcw },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const push = useToastStore((s) => s.push);

  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "flex flex-shrink-0 items-center gap-3 whitespace-nowrap rounded-full px-4 py-2.5 font-body text-sm transition-colors lg:rounded-sm",
                active ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/[0.05] hover:text-ink"
              )}
            >
              <l.icon className="h-4 w-4" strokeWidth={1.5} />
              {l.label}
            </Link>
          );
        })}
        <button
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            push("Logged out");
            router.push("/");
            router.refresh();
          }}
          className="flex flex-shrink-0 items-center gap-3 whitespace-nowrap rounded-full px-4 py-2.5 font-body text-sm text-ink/70 transition-colors hover:bg-ink/[0.05] hover:text-ink lg:rounded-sm"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
          Logout
        </button>
      </nav>
    </aside>
  );
}
