import { Check } from "lucide-react";
import clsx from "clsx";

export default function Stepper({ steps, activeIndex }: { steps: readonly string[]; activeIndex: number }) {
  return (
    <div className="flex items-center">
      {steps.map((step, i) => {
        const done = i < activeIndex;
        const current = i === activeIndex;
        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={clsx(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 font-body text-xs transition-colors",
                  done && "border-ink bg-ink text-paper",
                  current && "border-cobalt bg-cobalt text-paper",
                  !done && !current && "border-ink/20 text-ink/40"
                )}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={2.5} /> : i + 1}
              </div>
              <span
                className={clsx(
                  "max-w-[5.5rem] text-center font-body text-[11px] uppercase tracking-wide",
                  done || current ? "text-ink" : "text-ink/40"
                )}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={clsx("mx-2 h-[2px] flex-1 rounded-full", i < activeIndex ? "bg-ink" : "bg-ink/15")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
