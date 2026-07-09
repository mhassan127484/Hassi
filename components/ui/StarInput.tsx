"use client";

import { Star } from "lucide-react";

export default function StarInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const n = i + 1;
        return (
          <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} star`}>
            <Star
              className={n <= value ? "h-6 w-6 fill-cobalt text-cobalt" : "h-6 w-6 text-ink/25"}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}
