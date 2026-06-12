"use client";

import { IconCirclePlus, IconX } from "@tabler/icons-react";
import type { Column } from "@tanstack/react-table";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/ui";

// ── Types ───────────────────────────────────────────────────────────────────

interface FacetOption {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  options: FacetOption[];
  title?: string;
}

// ── Component ───────────────────────────────────────────────────────────────

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const [open, setOpen] = useState(false);

  // Keep local state in sync with column filter value.
  // Use a ref to detect external changes (e.g. Reset button) and avoid
  // cascading updates when we ourselves changed the filter.
  const [selectedValues, setSelectedValues] = useState<Set<string>>(
    () => new Set(column?.getFilterValue() as string[] | undefined)
  );
  const lastSyncRef = useRef<string[] | null>(null);

  // Sync from column → local state whenever the column filter value changes
  // from an external source (Reset button, external setFilterValue, etc.)
  useEffect(() => {
    const raw = column?.getFilterValue();
    const current = Array.isArray(raw) ? (raw as string[]) : [];
    const serialised = JSON.stringify(current);
    if (serialised !== JSON.stringify(lastSyncRef.current)) {
      lastSyncRef.current = current;
      setSelectedValues(new Set(current));
    }
  });

  const facets = column?.getFacetedUniqueValues();

  const handleSelect = useCallback(
    (value: string) => {
      const next = new Set(selectedValues);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }

      // Mark synced so the effect won't double-set
      const filterValues = Array.from(next);
      lastSyncRef.current = filterValues;
      setSelectedValues(next);
      column?.setFilterValue(filterValues.length ? filterValues : undefined);
    },
    [column, selectedValues]
  );

  const handleClear = useCallback(() => {
    lastSyncRef.current = [];
    setSelectedValues(new Set());
    column?.setFilterValue(undefined);
  }, [column]);

  const hasSelection = selectedValues.size > 0;

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          <IconCirclePlus
            className={cn(
              "mr-1.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors duration-200",
              hasSelection && "text-primary"
            )}
          />
          <span className="truncate font-medium text-xs">{title}</span>
          {hasSelection && (
            <>
              <Separator
                className="mx-1.5 h-4 shrink-0"
                orientation="vertical"
              />
              <Badge
                className="rounded-sm px-1 font-normal lg:hidden"
                variant="secondary"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden items-center gap-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    className="rounded-sm px-1.5 py-0 font-normal text-[11px]"
                    variant="secondary"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((opt) => selectedValues.has(opt.value))
                    .map((opt) => (
                      <Badge
                        className="rounded-sm px-1.5 py-0 font-normal text-[11px]"
                        key={opt.value}
                        variant="secondary"
                      >
                        {opt.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-0" sideOffset={8}>
        <Command>
          <CommandInput placeholder={title ?? "Search..."} />
          <CommandList>
            <CommandEmpty className="py-4 text-center text-muted-foreground text-xs">
              No results found.
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                const facetCount = facets?.get(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                    value={option.value}
                  >
                    <Checkbox
                      checked={isSelected}
                      className="mr-2.5 data-checked:[&_svg]:text-primary-foreground!"
                    />
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="flex-1 truncate text-[13px]">
                      {option.label}
                    </span>
                    {facetCount !== undefined && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 font-medium font-mono text-[11px] text-muted-foreground tabular-nums">
                        {facetCount}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {hasSelection && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    className="justify-center gap-1.5 text-center text-muted-foreground text-xs"
                    onSelect={handleClear}
                  >
                    <IconX className="h-3.5 w-3.5" />
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
