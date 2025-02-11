"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen flex-1 items-center justify-center">
      <Loader2 className="size-6 animate-spin" />
    </div>
  );
}
