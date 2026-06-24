"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/states";

export default function ErrorBoundary({
  error,
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      message="Something went wrong while loading this page."
      onRetry={reset}
    />
  );
}