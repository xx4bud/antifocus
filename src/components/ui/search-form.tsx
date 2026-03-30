"use client";

import { IconSearch, IconX } from "@tabler/icons-react";
import React from "react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useSearch } from "@/hooks/use-search";
import { cn } from "@/lib/utils/cn";

interface SearchFormProps
  extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  onQueryChange?: (query: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
}

interface SearchFormTriggerProps extends React.ComponentProps<"button"> {
  className?: string;
  isOpen?: boolean;
  onClick?: () => void;
}

function SearchForm({
  className,
  showSuggestions = false,
  onQueryChange,
  placeholder = "Cari...",
  ...props
}: SearchFormProps) {
  const {
    query,
    setQuery,
    isLoading,
    error,
    clearQuery,
    submitSearch,
    handleKeyDown,
  } = useSearch();

  React.useEffect(() => {
    onQueryChange?.(query);
  }, [query, onQueryChange]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitSearch();
  };

  return (
    <div className="relative w-full">
      <form
        aria-label="Formulir pencarian"
        autoComplete="off"
        className={cn("relative flex flex-1 items-center", className)}
        onSubmit={handleSubmit}
        {...props}
      >
        <Input
          aria-describedby={error ? "search-error" : undefined}
          aria-invalid={!!error}
          className={cn(
            "bg-background pr-16 text-muted-foreground text-sm",
            error && "border-destructive focus-visible:ring-destructive"
          )}
          name="search"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          type="text"
          value={query}
        />
        <div className="absolute right-2 flex items-center gap-2">
          {query && !isLoading ? (
            <button
              aria-label="Hapus pencarian"
              className="rounded-full bg-muted-foreground/50 p-[0.1rem] transition-colors hover:bg-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={clearQuery}
              type="button"
            >
              <IconX className="size-4" />
            </button>
          ) : null}
          <button
            aria-label="Cari"
            className="text-primary transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <Spinner className="size-5" />
            ) : (
              <IconSearch className="size-5" />
            )}
          </button>
        </div>
      </form>

      {error && (
        <div
          className="mt-1 text-destructive text-sm"
          id="search-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {showSuggestions && query && !error && (
        <SearchSuggestions _onSelect={setQuery} _query={query} />
      )}
    </div>
  );
}

function SearchFormTrigger({
  onClick,
  className,
  isOpen = false,
  ...props
}: SearchFormTriggerProps) {
  return (
    <button
      aria-label="Pencarian"
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

function SearchSuggestions({
  _query,
  _onSelect,
}: {
  _query: string;
  _onSelect: (query: string) => void;
}) {
  return null;
}

export { SearchForm, SearchFormTrigger };
