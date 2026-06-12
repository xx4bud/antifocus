"use client";

import { IconArrowsUpDown } from "@tabler/icons-react";
import type { Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/ui";

interface DataTableSortableProps<TData, TValue> {
  className?: string;
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableSortable<TData, TValue>({
  column,
  title,
  className,
}: DataTableSortableProps<TData, TValue>) {
  return (
    <Button
      className={cn("-ml-2 h-8 px-2 data-[state=open]:bg-accent", className)}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      variant="ghost"
    >
      <span>{title}</span>
      <IconArrowsUpDown className="ml-2 h-3.5 w-3.5 text-muted-foreground/70" />
    </Button>
  );
}
