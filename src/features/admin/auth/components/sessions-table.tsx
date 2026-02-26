"use client";

import { IconTrash } from "@tabler/icons-react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTransition } from "react";
import { toast } from "sonner";
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
import { revokeSession } from "~/features/admin/auth/actions/admin-actions";

type SessionRow = {
  id: string;
  token: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  impersonatedBy: string | null;
  expiresAt: Date;
  createdAt: Date;
  userName: string | null;
  userEmail: string | null;
};

function parseUserAgent(ua: string | null): string {
  if (!ua) {
    return "Unknown";
  }
  if (ua.includes("Chrome")) {
    return "Chrome";
  }
  if (ua.includes("Firefox")) {
    return "Firefox";
  }
  if (ua.includes("Safari")) {
    return "Safari";
  }
  if (ua.includes("Edge")) {
    return "Edge";
  }
  return ua.slice(0, 30) + (ua.length > 30 ? "…" : "");
}

function RevokeButton({ token }: { token: string }) {
  const [isPending, startTransition] = useTransition();

  const handleRevoke = () => {
    startTransition(async () => {
      try {
        await revokeSession(token);
        toast.success("Session revoked");
      } catch {
        toast.error("Failed to revoke session");
      }
    });
  };

  return (
    <Button
      className="size-8"
      disabled={isPending}
      onClick={handleRevoke}
      size="icon"
      variant="ghost"
    >
      <IconTrash className="size-4 text-destructive" />
      <span className="sr-only">Revoke</span>
    </Button>
  );
}

const columns: ColumnDef<SessionRow>[] = [
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
    accessorKey: "ipAddress",
    header: "IP Address",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.ipAddress ?? "—"}</span>
    ),
  },
  {
    accessorKey: "userAgent",
    header: "Browser",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {parseUserAgent(row.original.userAgent)}
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
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const isActive = new Date(row.original.expiresAt) > new Date();
      return isActive ? <RevokeButton token={row.original.token} /> : null;
    },
  },
];

interface SessionsTableProps {
  data: SessionRow[];
  onPageChangeAction?: (page: number) => void;
  page: number;
  pageSize: number;
  total: number;
}

export function SessionsTable({
  data,
  total,
  page,
  pageSize,
  onPageChangeAction,
}: SessionsTableProps) {
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
          {total} session{total !== 1 ? "s" : ""} total
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
                  No sessions found.
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
