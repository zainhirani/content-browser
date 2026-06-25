import { forwardRef, type InputHTMLAttributes } from "react";

const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-lg border border-white/10 bg-surface-raised py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-brand ${className}`}
      {...props}
    />
  );
});

export default Input;