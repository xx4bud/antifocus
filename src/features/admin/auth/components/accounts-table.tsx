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

type AccountRow = {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  scope: string | null;
  createdAt: Date;
  userName: string | null;
  userEmail: string | null;
};

const providerColors: Record<string, "default" | "secondary" | "outline"> = {
  google: "default",
  credential: "secondary",
  github: "default",
};

const columns: ColumnDef<AccountRow>[] = [
  {
    accessorKey: "userName",
    header: "User",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="truncate font-medium text-sm">
          {row.original.userName ?? "Unknown"}
        </span>
        <span className="truncate text-muted-foreground text-xs">
          {row.original.userEmail ?? "—"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "providerId",
    header: "Provider",
    cell: ({ row }) => (
      <Badge variant={providerColors[row.original.providerId] ?? "outline"}>
        {row.original.providerId}
      </Badge>
    ),
  },
  {
    accessorKey: "accountId",
    header: "Account ID",
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate font-mono text-sm">
        {row.original.accountId}
      </span>
    ),
  },
  {
    accessorKey: "scope",
    header: "Scopes",
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate text-muted-foreground text-sm">
        {row.original.scope ?? "—"}
      </span>
    ),
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
];

interface AccountsTableProps {
  data: AccountRow[];
  onPageChangeAction?: (page: number) => void;
  page: number;
  pageSize: number;
  total: number;
}

export function AccountsTable({
  data,
  total,
  page,
  pageSize,
  onPageChangeAction,
}: AccountsTableProps) {
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
          {total} account{total !== 1 ? "s" : ""} total
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
                  No accounts found.
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
