"use client";

import type { ColumnDef, Table } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * 1. Column Definition Helper
 * Generates a standard selection column for any TanStack table.
 */
export function getSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <div className="flex w-[40px] items-center justify-center">
        <Checkbox
          aria-label="Select all"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex w-[40px] items-center justify-center">
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: "w-[40px]",
    },
  };
}

/**
 * 2. Selection Info Text (Pagination / Result Text)
 * Displays "X of Y row(s) selected."
 */
interface DataTableSelectionInfoProps<TData> {
  table: Table<TData>;
}

export function DataTableSelectionInfo<TData>({
  table,
}: DataTableSelectionInfoProps<TData>) {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="text-muted-foreground text-sm">
      {selectedCount} / {totalCount} selected
    </div>
  );
}
