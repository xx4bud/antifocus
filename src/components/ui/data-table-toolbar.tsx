"use client";

import { IconSearch, IconX } from "@tabler/icons-react";
import type { Table } from "@tanstack/react-table";
import { type ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/ui";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

export interface DataTableToolbarProps<TData> {
  actionButtons?: ReactNode;
  columnVisibility: Record<string, boolean>;
  filterOptions?: {
    columnId: string;
    title: string;
    options: { label: string; value: string }[];
  }[];
  searchKey?: string;
  searchPlaceholder?: string;
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = "Search...",
  actionButtons,
  columnVisibility, // view options required
  filterOptions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Mobile Search */}
      {searchKey && (
        <div className="relative w-full sm:hidden">
          <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
          <DebouncedInput
            className="h-8 w-full pl-8"
            onChange={(value) =>
              table.getColumn(searchKey)?.setFilterValue(value)
            }
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
          />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Desktop Search */}
          {searchKey && (
            <div className="relative hidden w-full sm:block sm:w-[250px] lg:w-[300px]">
              <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
              <DebouncedInput
                className="h-8 w-full pl-8"
                onChange={(value) =>
                  table.getColumn(searchKey)?.setFilterValue(value)
                }
                placeholder={searchPlaceholder}
                value={
                  (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
                }
              />
            </div>
          )}

          {filterOptions?.map((filter) => {
            const column = table.getColumn(filter.columnId);
            return column ? (
              <DataTableFacetedFilter
                column={column}
                key={filter.columnId}
                options={filter.options}
                title={filter.title}
              />
            ) : null;
          })}

          {isFiltered && (
            <Button
              className="h-8 px-2 lg:px-3"
              onClick={() => table.resetColumnFilters()}
              variant="ghost"
            >
              Reset
              <IconX className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {actionButtons}
          <DataTableViewOptions
            columnVisibility={columnVisibility}
            table={table}
          />
        </div>
      </div>
    </div>
  );
}

interface DebouncedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  debounce?: number;
  onChange: (value: string | number) => void;
  value: string | number;
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 300,
  className,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, onChange, debounce]);

  const handleClear = () => {
    setValue("");
    onChange("");
  };

  return (
    <div className="relative w-full">
      <Input
        {...props}
        className={cn(className, value ? "pr-8" : "")}
        onChange={(event) => setValue(event.target.value)}
        value={value}
      />
      {value && (
        <Button
          className="absolute top-0 right-0 z-10 text-muted-foreground hover:bg-transparent hover:text-foreground"
          onClick={handleClear}
          size="icon-sm"
          variant="ghost"
        >
          <IconX className="size-4" />
        </Button>
      )}
    </div>
  );
}
