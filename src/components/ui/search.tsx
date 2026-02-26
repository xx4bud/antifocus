"use client";

import { IconSearch, IconX } from "@tabler/icons-react";
import type * as React from "react";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/i18n/navigation";

interface SearchBarProps extends React.ComponentProps<"form"> {}

function SearchBar({ ...props }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push({
        pathname: "/search",
        query: { q: searchQuery.trim() },
      });
    }
  };

  return (
    <form
      className="relative flex flex-1 items-center"
      onSubmit={handleSubmit}
      {...props}
    >
      <Input
        className="bg-secondary pr-14 text-muted-foreground text-sm"
        name="search"
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Cari produk..."
        value={searchQuery}
      />
      <div className="absolute right-2 flex items-center gap-1.5">
        {searchQuery ? (
          <button
            aria-label="Clear search"
            className="rounded-full bg-muted-foreground/50 p-[0.1rem] transition-colors hover:bg-muted-foreground"
            onClick={handleClearSearch}
            type="button"
          >
            <IconX className="size-3" />
          </button>
        ) : null}
        <button
          aria-label="Search"
          className="text-primary transition-opacity hover:opacity-90"
          type="submit"
        >
          <IconSearch className="size-5" />
        </button>
      </div>
    </form>
  );
}

interface SearchTriggerProps extends React.ComponentProps<"button"> {
  className?: string;
  isOpen?: boolean;
  onClick?: () => void;
}

function SearchTrigger({
  onClick,
  className,
  isOpen = false,
  ...props
}: SearchTriggerProps) {
  return (
    <button
      aria-label="Search"
      className={`cursor-pointer transition-opacity duration-200 hover:opacity-90 ${className || ""}`}
      onClick={onClick}
      {...props}
    >
      {isOpen ? (
        <IconX className="size-7" />
      ) : (
        <IconSearch className="size-7" />
      )}
    </button>
  );
}

export { SearchBar, SearchTrigger };
