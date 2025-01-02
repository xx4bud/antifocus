"use client";

import { useState, useEffect } from "react";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface TableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function TableViewOptions<TData>({
  table,
}: TableViewOptionsProps<TData>) {
  const [savedVisibility, setSavedVisibility] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const visibilityState = localStorage.getItem(
        "columnVisibility"
      );
      if (visibilityState) {
        const parsedVisibility =
          JSON.parse(visibilityState);
        setSavedVisibility(parsedVisibility);

        table.getAllColumns().forEach((column) => {
          const isVisible = parsedVisibility[column.id];
          if (isVisible !== undefined) {
            column.toggleVisibility(isVisible);
          }
        });
      }
    }
  }, [table]);

  const handleColumnVisibilityChange = (
    columnId: string,
    isVisible: boolean
  ) => {
    const updatedVisibility = {
      ...savedVisibility,
      [columnId]: isVisible,
    };
    setSavedVisibility(updatedVisibility);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "columnVisibility",
        JSON.stringify(updatedVisibility)
      );
    }

    table.getAllColumns().forEach((column) => {
      if (column.id === columnId) {
        column.toggleVisibility(isVisible);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto flex h-8"
        >
          <Settings2 />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[150px]"
      >
        <DropdownMenuLabel>
          Toggle columns
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" &&
              column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => {
                  const isVisible = !!value;
                  handleColumnVisibilityChange(
                    column.id,
                    isVisible
                  ); // Trigger visibility change
                }}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
