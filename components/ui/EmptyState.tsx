import { ArrowUpRight, LucideIcon } from "lucide-react";
import Button from "./Button";

export default function EmptyState({
  icon: Icon,
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink/[0.04]">
        <Icon className="h-7 w-7 text-ink/40" strokeWidth={1.5} />
      </div>
      <p className="mt-6 font-body text-xs uppercase tracking-widest text-stone">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tightest text-ink md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 font-body text-sm text-ink/60">{description}</p>
      {actionLabel && actionHref && (
        <Button href={actionHref} className="mt-8">
          {actionLabel}
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        </Button>
      )}
    </div>
  );
}
