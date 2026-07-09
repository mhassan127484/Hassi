"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Cursor from "./Cursor";
import Toaster from "./ui/Toaster";

export default function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Cursor />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <Toaster />
    </>
  );
}
