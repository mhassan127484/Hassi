import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import Chrome from "@/components/Chrome";

export const metadata: Metadata = {
  title: "Hassi — Vol. 01",
  description:
    "Hassi is a modern apparel house. Considered outerwear, knitwear, and denim, made to be worn hard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="grain antialiased">
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
