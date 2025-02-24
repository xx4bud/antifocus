"use client";

import * as React from "react";
import { Input } from "./ui/input";
import { Search, XIcon } from "lucide-react";

const SearchBar: React.FC = () => {
  return (
    <form
      className="relative flex flex-1 items-center"
      role="search"
    >
      <Input
        placeholder="Search..."
        className="bg-secondary pr-14 text-sm text-muted-foreground"
      />
      <div className="absolute right-2 flex items-center gap-1.5">
        <button
          type="button"
          className="rounded-full bg-muted-foreground/50 p-[0.1rem] transition-colors hover:bg-muted-foreground"
          aria-label="Clear search"
        >
          <XIcon className="size-3" />
        </button>
        <button
          type="submit"
          className="text-primary transition-opacity hover:opacity-90"
          aria-label="Submit search"
        >
          <Search className="size-5" />
        </button>
      </div>
    </form>
  );
};

interface SearchTriggerProps {
  className?: string;
  onClick?: () => void;
}

const SearchOpen: React.FC<SearchTriggerProps> = ({
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={`transition-opacity duration-200 hover:opacity-90 ${className}`}
      aria-label="Open search"
    >
      <Search className="size-7" />
    </button>
  );
};

const SearchClose: React.FC<SearchTriggerProps> = ({
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={`transition-opacity duration-200 hover:opacity-90 ${className}`}
      aria-label="Close search"
    >
      <XIcon className="size-7" />
    </button>
  );
};

export { SearchBar, SearchOpen, SearchClose };
