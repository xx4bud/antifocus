"use client";

import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

const CAMEL_CASE_REGEX = /([A-Z])/g;
const FIRST_LETTER_REGEX = /^./;
const UNDERSCORE_REGEX = /_/g;

function formatColumnId(id: string) {
  return id
    .replace(CAMEL_CASE_REGEX, " $1")
    .replace(FIRST_LETTER_REGEX, (str) => str.toUpperCase())
    .replace(UNDERSCORE_REGEX, " ");
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const toggleableColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide()
    );

  if (toggleableColumns.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-8" size="sm" variant="outline">
          <IconAdjustmentsHorizontal className="mr-2 size-4" stroke={1.5} />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {toggleableColumns.map((column) => (
          <DropdownMenuCheckboxItem
            checked={column.getIsVisible()}
            className="capitalize"
            key={column.id}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
          >
            {formatColumnId(column.id)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
