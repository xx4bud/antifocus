"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColumnFacetedFilter } from "@/components/ui/data-table/column-faceted-filter";
import { TableViewOptions } from "@/components/ui/data-table/table-view-options";
import { ProductStatus } from "@prisma/client";

interface TableToolbarProps<TData> {
  table: Table<TData>;
}

const status: ProductStatus[] = ["AVAILABLE", "ARCHIVED"];

const formattedStatuses = status.map((status) => ({
  label: status,
  value: status,
}));

export function TableToolbar<TData>({
  table,
}: TableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={
            (table
              .getColumn("name")
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table
              .getColumn("name")
              ?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <ColumnFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={formattedStatuses}
          />
        )}
        {/* {table.getColumn("priority") && (
          <ColumnFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )} */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <TableViewOptions table={table} />
    </div>
  );
}
