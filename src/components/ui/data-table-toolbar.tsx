"use client";

import { IconSearch, IconX } from "@tabler/icons-react";
import type { Table } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableFacetedFilter } from "@/components/ui/data-table-filters";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils/ui";

export interface DataTableToolbarProps<TData> {
  actionButtons?: ReactNode;
  activeTab?: string;
  filters?: {
    columnId: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
  onTabChange?: (tab: string) => void;
  searchKey?: string;
  searchPlaceholder?: string;
  table: Table<TData>;
  tabs?: {
    value: string;
    label: string;
    badgeCount?: number;
  }[];
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = "Search...",
  tabs,
  activeTab,
  onTabChange,
  filters,
  actionButtons,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {searchKey && (
            <div className="relative flex w-full items-center sm:w-[250px]">
              <IconSearch className="pointer-events-none absolute left-2.5 z-10 size-4 text-muted-foreground" />
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

          {filters?.map(
            (filter) =>
              table.getColumn(filter.columnId) && (
                <DataTableFacetedFilter
                  column={table.getColumn(filter.columnId)}
                  key={filter.columnId}
                  options={filter.options}
                  title={filter.title}
                />
              )
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {tabs && (
            <>
              <Label className="sr-only" htmlFor="view-selector">
                View
              </Label>
              <Select onValueChange={onTabChange} value={activeTab}>
                <SelectTrigger
                  className="flex @4xl/main:hidden w-fit"
                  id="view-selector"
                  size="sm"
                >
                  <SelectValue placeholder="Select a view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {tabs.map((tab) => (
                      <SelectItem key={tab.value} value={tab.value}>
                        {tab.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <TabsList className="@4xl/main:flex hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                    {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                      <Badge className="ml-1" variant="secondary">
                        {tab.badgeCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </>
          )}

          <DataTableViewOptions table={table} />
          {actionButtons}
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
