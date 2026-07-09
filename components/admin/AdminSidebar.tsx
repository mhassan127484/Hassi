"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Newspaper, LogOut } from "lucide-react";
import clsx from "clsx";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex h-full w-full flex-col bg-ink px-5 py-8 text-paper">
      <Link href="/admin/dashboard" className="font-display text-2xl font-semibold tracking-tightest">
        Hassi<span className="text-cobalt">.</span>
      </Link>
      <nav className="mt-12 flex flex-col gap-1">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "flex items-center gap-3 rounded-sm px-4 py-3 font-body text-sm transition-colors",
                active ? "bg-paper/10 text-paper" : "text-paper/60 hover:bg-paper/5 hover:text-paper"
              )}
            >
              <l.icon className="h-4 w-4" strokeWidth={1.5} />
              {l.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={async () => {
          const supabase = createClient();
          await supabase.auth.signOut();
          router.push("/admin/login");
          router.refresh();
        }}
        className="mt-auto flex items-center gap-3 rounded-sm px-4 py-3 font-body text-sm text-paper/60 transition-colors hover:bg-paper/5 hover:text-paper"
      >
        <LogOut className="h-4 w-4" strokeWidth={1.5} />
        Logout
      </button>
    </aside>
  );
}
