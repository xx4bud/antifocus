"use client";

import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableViewOptionsProps<TData> {
  columnVisibility: Record<string, boolean>; // required
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
  columnVisibility,
}: DataTableViewOptionsProps<TData>) {
  const toggleableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanHide());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-8" variant="outline">
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {toggleableColumns.map((column) => (
          <DropdownMenuCheckboxItem
            checked={
              column.id in columnVisibility
                ? columnVisibility[column.id]
                : column.getIsVisible()
            }
            className="capitalize"
            key={column.id}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
          >
            {column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
