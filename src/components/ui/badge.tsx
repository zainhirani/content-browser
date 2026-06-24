import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-neutral-300">
      {children}
    </span>
  );
}
