import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  secondary:
    "border border-white/15 bg-surface-raised text-neutral-100 hover:bg-surface-hover",
};
const Button = ({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`rounded-md px-4 py-2 text-sm font-medium transition disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}

export default Button;