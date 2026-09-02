"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "lg" | "sm";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary: "bg-ink text-ink-foreground hover:opacity-90 active:opacity-80 shadow-[0_10px_24px_-10px_rgba(30,27,46,0.5)]",
  secondary: "bg-surface-muted text-foreground hover:bg-border/60 border border-border",
  ghost: "bg-transparent text-foreground hover:bg-surface-muted",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm rounded-2xl",
  md: "h-12 px-6 text-base rounded-2xl",
  lg: "h-14 px-8 text-lg rounded-full",
};

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = "primary", size = "md", disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-bold transition-all duration-150 cursor-pointer",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

export default Button;
