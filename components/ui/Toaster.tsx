"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useToastStore } from "@/store/toast";

export default function Toaster() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[80] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center justify-between gap-4 rounded-full bg-ink px-5 py-3 text-paper shadow-xl"
          >
            <span className="flex items-center gap-2 font-body text-sm">
              {t.tone === "success" && <Check className="h-4 w-4 text-cobalt" strokeWidth={2.5} />}
              {t.message}
            </span>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-paper/50 hover:text-paper">
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
