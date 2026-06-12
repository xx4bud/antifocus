"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { Table } from "@tanstack/react-table";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/ui";
import { DataTableSelectionInfo } from "./data-table-row-selects";

interface DataTablePaginationProps<TData> {
  className?: string;
  pageSizeOptions?: number[];
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
  className,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTablePaginationProps<TData>) {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  const [pageInput, setPageInput] = useState(currentPage);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync pageInput when table state changes externally (e.g. pageSize change)
  useEffect(() => {
    setPageInput(currentPage);
  }, [currentPage]);

  const commitPage = useCallback(() => {
    const page = Math.min(Math.max(1, pageInput || 1), pageCount);
    setPageInput(page);
    table.setPageIndex(page - 1);
    inputRef.current?.blur();
  }, [pageInput, pageCount, table]);

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      {/* Left: row selection info */}
      <DataTableSelectionInfo table={table} />

      {/* Right: compact pagination — Shopee style */}
      <div className="ml-auto flex items-center gap-1.5">
        {/* Prev */}
        <Button
          className="size-8"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          size="icon"
          variant="ghost"
        >
          <IconChevronLeft className="size-4" />
        </Button>

        {/* Page indicator: [input] / total */}
        <div className="flex items-center gap-1 text-sm">
          <input
            aria-label="Page number"
            className="h-8 min-w-10 rounded border border-border bg-transparent px-1.5 text-center font-medium tabular-nums outline-none [appearance:textfield] focus:border-primary [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            max={pageCount}
            min={1}
            onBlur={commitPage}
            onChange={(e) => {
              const val = e.target.value.replace(/[^\d]/g, "");
              if (val === "") {
                setPageInput(1);
                return;
              }
              const num = Number(val);
              if (num <= 999) {
                setPageInput(num);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                commitPage();
              }
              if (e.key === "Escape") {
                setPageInput(currentPage);
                inputRef.current?.blur();
              }
            }}
            ref={inputRef}
            type="number"
            value={pageInput}
          />
          <span className="w-4 text-center text-muted-foreground">/</span>
          <span className="w-6 text-center font-medium tabular-nums">
            {pageCount}
          </span>
        </div>

        {/* Next */}
        <Button
          className="size-8"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          size="icon"
          variant="ghost"
        >
          <IconChevronRight className="size-4" />
        </Button>

        {/* Divider */}
        <div className="mx-1 h-4 w-px bg-border" />

        {/* Page size */}
        <Select
          onValueChange={(value) => {
            table.setPageSize(Number(value));
            table.setPageIndex(0);
          }}
          value={`${table.getState().pagination.pageSize}`}
        >
          <SelectTrigger aria-label="Rows per page" className="w-36">
            <SelectValue placeholder="Rows">
              {table.getState().pagination.pageSize} / halaman
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            align="end"
            className="w-[--radix-select-trigger-width]"
            position="popper"
            side="top"
          >
            <SelectGroup>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
