"use client";

import { Separator } from "@/components/ui/separator";

export default function NotFound() {
  return (
    <div className="container relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden p-4">
      <div className="flex flex-col items-center">
        <div className="flex h-12 items-center space-x-5 text-center">
          <h1 className="font-bold text-3xl text-primary tracking-tight">
            404
          </h1>
          <Separator orientation="vertical" />
          <h2 className="font-medium text-muted-foreground text-sm leading-none">
            Tidak ditemukan
          </h2>
        </div>
      </div>
    </div>
  );
}
