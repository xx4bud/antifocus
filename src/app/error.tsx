// src/app/error.tsx
"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen flex-1 flex-col items-center justify-center gap-3">
      <h1 className="-m-2 text-xl font-bold text-destructive">
        Error!
      </h1>
      <p>{error.message}</p>
      <Button onClick={reset} size={"sm"}>Try Again</Button>
    </div>
  );
}
