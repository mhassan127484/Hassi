"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic";
import ProductTile from "./ProductTile";
import { Product } from "@/types";

const line = {
  hidden: { opacity: 0, y: "110%" },
  show: (i: number) => ({
    opacity: 1,
    y: "0%",
    transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero({ heroProduct }: { heroProduct?: Product }) {
  const hero = heroProduct;

  return (
    <section className="relative mx-auto max-w-[1400px] px-6 pb-16 pt-32 md:px-10 md:pt-40">
      <div className="flex items-end justify-between">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-body text-xs uppercase tracking-widest text-stone"
        >
          Autumn / Winter
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="hidden font-body text-xs uppercase tracking-widest text-stone md:block"
        >
          Karachi, PK
        </motion.p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
        {/* headline */}
        <div className="lg:col-span-8">
          <h1 className="font-display text-[15vw] font-semibold leading-[0.85] tracking-tightest text-ink lg:text-[11rem]">
            {["Wear it", "hard."].map((l, i) => (
              <span key={l} className="block overflow-hidden">
                <motion.span
                  className="block"
                  custom={i}
                  variants={line}
                  initial="hidden"
                  animate="show"
                >
                  {i === 1 ? (
                    <>
                      hard<span className="text-cobalt">.</span>
                    </>
                  ) : (
                    l
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
            <Magnetic>
              <Link
                href="/shop"
                className="group flex items-center gap-3 rounded-full bg-ink px-7 py-4 font-body text-sm uppercase tracking-widest text-paper transition-colors hover:bg-cobalt"
              >
                Shop Now
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </Link>
            </Magnetic>
            <p className="max-w-xs font-body text-sm text-ink/70">
              Considered outerwear, knitwear and denim. Built once, worn for years.
            </p>
          </div>
        </div>

        {/* hero tile */}
        {hero && hero.colors[0] && (
          <motion.div
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4"
          >
            <Link href={`/product/${hero.slug}`} data-cursor>
              <ProductTile
                tile={hero.colors[0].tile}
                label={hero.drop}
                className="aspect-[3/4] rounded-sm lg:aspect-auto lg:h-full lg:min-h-[26rem]"
              />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
