"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface SearchFieldProps {
  className?: string;
}

export default function SearchField({ className }: SearchFieldProps) {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className={cn("relative md:max-w-md flex-1", className)}>
      <form onSubmit={handleSubmit} method="GET" action="/search">
        <Input
          name="q"
          placeholder="Search . . ."
          className="bg-secondary pe-10 text-muted-foreground"
        />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-primary" />
      </form>
    </div>
  );
}
