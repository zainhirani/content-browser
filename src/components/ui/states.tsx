import type { ReactNode } from "react";
import { Button } from "./index";

const Centered = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-white/10 bg-surface-raised px-6 py-16 text-center">
      {children}
    </div>
  );
}

const ErrorState = ({
  message = "Something went wrong.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) => {
  return (
    <Centered>
      <p className="text-sm text-neutral-300">{message}</p>
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </Centered>
  );
}

const EmptyState = ({ message }: { message: string }) => {
  return (
    <Centered>
      <p className="text-sm text-neutral-400">{message}</p>
    </Centered>
  );
}

export { ErrorState, EmptyState };