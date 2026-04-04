"use client";

import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Spinner />
        <p className="text-muted-foreground text-sm">Memuat...</p>
      </div>
    </div>
  );
}
