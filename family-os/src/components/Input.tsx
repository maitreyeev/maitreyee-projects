import clsx from "clsx";
import { InputHTMLAttributes, forwardRef, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

const fieldClass =
  "w-full rounded-2xl bg-surface-muted border border-border px-4 py-3 text-base outline-none focus:border-accent transition-colors placeholder:text-muted";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={clsx(fieldClass, className)} {...props} />;
  }
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={clsx(fieldClass, "resize-none", className)} {...props} />;
  }
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, ...props }, ref) {
    return <select ref={ref} className={clsx(fieldClass, "cursor-pointer", className)} {...props} />;
  }
);

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-bold text-foreground mb-1.5 block">{children}</label>;
}
