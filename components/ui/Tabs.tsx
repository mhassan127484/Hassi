"use client";

import { useState } from "react";
import clsx from "clsx";

export default function Tabs({
  tabs,
}: {
  tabs: { label: string; content: React.ReactNode }[];
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex gap-8 overflow-x-auto border-b border-ink/10">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActive(i)}
            className={clsx(
              "relative whitespace-nowrap py-4 font-body text-xs uppercase tracking-widest transition-colors",
              active === i ? "text-ink" : "text-ink/40 hover:text-ink/70"
            )}
          >
            {t.label}
            {active === i && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] bg-ink" />
            )}
          </button>
        ))}
      </div>
      <div className="py-8">{tabs[active].content}</div>
    </div>
  );
}
