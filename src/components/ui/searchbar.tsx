"use client";

import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const SearchBar = forwardRef<HTMLFormElement>(
  ({ ...props }, ref) => {
    const router = useRouter();

    const handleSubmit = (
      e: React.FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault();
      const form = e.currentTarget;
      const q = (
        form.elements.namedItem("q") as HTMLInputElement
      )?.value.trim();
      if (!q) return;
      router.push(`/search?q=${encodeURIComponent(q)}`);
    };

    return (
      <form
        className={cn("relative flex flex-1")}
        ref={ref}
        onSubmit={handleSubmit}
        {...props}
      >
        <Input
          name="q"
          placeholder="Search . . ."
          className="bg-secondary pe-10 text-secondary-foreground"
        />
        <Separator
          orientation="vertical"
          className="absolute right-10 top-1/2 h-5 -translate-y-1/2"
        />
        <SearchIcon className="absolute right-2.5 top-1/2 size-5 -translate-y-1/2 text-secondary-foreground" />
      </form>
    );
  }
);
SearchBar.displayName = "SearchBar";

export { SearchBar };
