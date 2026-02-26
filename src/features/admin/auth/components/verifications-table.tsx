"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { Verification } from "~/lib/db/types";

type VerificationRow = Verification;

const columns: ColumnDef<VerificationRow>[] = [
  {
    accessorKey: "identifier",
    header: "Identifier",
    cell: ({ row }) => (
      <span className="max-w-[250px] truncate font-medium text-sm">
        {row.original.identifier}
      </span>
    ),
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate font-mono text-muted-foreground text-sm">
        {row.original.value.slice(0, 16)}…
      </span>
    ),
  },
  {
    accessorKey: "expiresAt",
    header: "Status",
    cell: ({ row }) => {
      const isActive = new Date(row.original.expiresAt) > new Date();
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Expired"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm tabular-nums">
        {Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        }).format(new Date(row.original.createdAt))}
      </span>
    ),
  },
  {
    id: "expiresAtDate",
    header: "Expires",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm tabular-nums">
        {Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        }).format(new Date(row.original.expiresAt))}
      </span>
    ),
  },
];

interface VerificationsTableProps {
  data: VerificationRow[];
  onPageChangeAction?: (page: number) => void;
  page: number;
  pageSize: number;
  total: number;
}

export function VerificationsTable({
  data,
  total,
  page,
  pageSize,
  onPageChangeAction,
}: VerificationsTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize),
    state: {
      pagination: { pageIndex: page, pageSize },
    },
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <span className="text-muted-foreground text-sm">
          {total} verification{total !== 1 ? "s" : ""} total
        </span>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center text-muted-foreground"
                  colSpan={columns.length}
                >
                  No verifications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              disabled={page === 0}
              onClick={() => onPageChangeAction?.(page - 1)}
              size="sm"
              variant="outline"
            >
              Previous
            </Button>
            <Button
              disabled={page >= totalPages - 1}
              onClick={() => onPageChangeAction?.(page + 1)}
              size="sm"
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
