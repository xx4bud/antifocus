"use client";

import { IconSearch, IconX } from "@tabler/icons-react";
import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchProps extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  onSubmit?: (query: string) => void;
  placeholder?: string;
}

function Search({
  className,
  placeholder = "Cari...",
  onSubmit,
  ...props
}: SearchProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(query);
  };

  return (
    <form
      aria-label="search form"
      className={cn("relative flex flex-1 items-center", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <button
        aria-label="Search"
        className="absolute left-2.5 text-primary hover:opacity-90"
        type="submit"
      >
        <IconSearch className="size-4" />
      </button>
      <Input
        className="bg-background pl-8 text-muted-foreground text-sm"
        name="search"
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        type="search"
        value={query}
      />
    </form>
  );
}

interface SearchTriggerProps {
  isOpen: boolean;
  onClick: () => void;
}

function SearchTrigger({ isOpen, onClick }: SearchTriggerProps) {
  return (
    <button
      aria-label={isOpen ? "clear search" : "open search"}
      className="text-background hover:opacity-90"
      onClick={onClick}
      type="button"
    >
      {isOpen ? (
        <IconX className="size-7" />
      ) : (
        <IconSearch className="size-7" />
      )}
    </button>
  );
}

export { Search, SearchTrigger };
