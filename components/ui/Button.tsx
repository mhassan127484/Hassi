import Link from "next/link";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-body text-sm uppercase tracking-widest transition-colors disabled:cursor-not-allowed disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-cobalt",
  secondary: "border border-ink/20 text-ink hover:border-ink/60 hover:bg-ink/[0.03]",
  ghost: "text-ink hover:text-cobalt",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3.5",
  lg: "px-7 py-4",
};

interface ButtonOwnProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

type ButtonProps = ButtonOwnProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkButtonProps = ButtonOwnProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function Button(props: ButtonProps | LinkButtonProps) {
  const { variant = "primary", size = "md", className, ...rest } = props;
  const cls = clsx(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    const { href, ...anchorRest } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link href={props.href} className={cls} {...anchorRest}>
        {props.children}
      </Link>
    );
  }

  const buttonRest = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={cls} {...buttonRest}>
      {props.children}
    </button>
  );
}
