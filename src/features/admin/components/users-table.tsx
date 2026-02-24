"use client";

import {
  IconBan,
  IconCheck,
  IconDotsVertical,
  IconShieldCheck,
  IconTrash,
} from "@tabler/icons-react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTransition } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  banUser,
  removeUser,
  setUserRole,
  unbanUser,
} from "~/features/admin/actions/admin-actions";
import type { SYSTEM_ROLE } from "~/lib/db/schemas";

type UserRow = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  username: string | null;
  role: string;
  banned: boolean | null;
  banReason: string | null;
  createdAt: Date;
};

const roleLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  super_admin: { label: "Super Admin", variant: "default" },
  admin: { label: "Admin", variant: "default" },
  owner: { label: "Owner", variant: "secondary" },
  member: { label: "Member", variant: "secondary" },
  user: { label: "User", variant: "outline" },
};

const roles: (typeof SYSTEM_ROLE)[keyof typeof SYSTEM_ROLE][] = [
  "super_admin",
  "admin",
  "owner",
  "member",
  "user",
];

function UserActions({ user }: { user: UserRow }) {
  const [isPending, startTransition] = useTransition();

  const handleBan = () => {
    startTransition(async () => {
      try {
        await banUser(user.id, "Banned by admin");
        toast.success(`${user.name} has been banned`);
      } catch {
        toast.error("Failed to ban user");
      }
    });
  };

  const handleUnban = () => {
    startTransition(async () => {
      try {
        await unbanUser(user.id);
        toast.success(`${user.name} has been unbanned`);
      } catch {
        toast.error("Failed to unban user");
      }
    });
  };

  const handleSetRole = (
    role: (typeof SYSTEM_ROLE)[keyof typeof SYSTEM_ROLE]
  ) => {
    startTransition(async () => {
      try {
        await setUserRole(user.id, role);
        toast.success(`Role updated to ${role}`);
      } catch {
        toast.error("Failed to update role");
      }
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      try {
        await removeUser(user.id);
        toast.success(`${user.name} has been removed`);
      } catch {
        toast.error("Failed to remove user");
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="size-8"
          disabled={isPending}
          size="icon"
          variant="ghost"
        >
          <IconDotsVertical className="size-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <IconShieldCheck className="mr-2 size-4" />
            Change Role
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {roles.map((role) => (
              <DropdownMenuItem key={role} onClick={() => handleSetRole(role)}>
                {role === user.role && <IconCheck className="mr-2 size-4" />}
                {roleLabels[role]?.label ?? role}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        {user.banned ? (
          <DropdownMenuItem onClick={handleUnban}>
            <IconCheck className="mr-2 size-4" />
            Unban User
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="text-destructive" onClick={handleBan}>
            <IconBan className="mr-2 size-4" />
            Ban User
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="text-destructive" onClick={handleRemove}>
          <IconTrash className="mr-2 size-4" />
          Remove User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const columns: ColumnDef<UserRow>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarImage
            alt={row.original.name}
            src={row.original.image ?? undefined}
          />
          <AvatarFallback>{row.original.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="truncate font-medium text-sm">
            {row.original.name}
          </span>
          <span className="truncate text-muted-foreground text-xs">
            {row.original.email}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.username ? `@${row.original.username}` : "—"}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const info = roleLabels[row.original.role];
      return (
        <Badge variant={info?.variant ?? "outline"}>
          {info?.label ?? row.original.role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "emailVerified",
    header: "Verified",
    cell: ({ row }) => (
      <Badge variant={row.original.emailVerified ? "default" : "outline"}>
        {row.original.emailVerified ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    accessorKey: "banned",
    header: "Status",
    cell: ({ row }) =>
      row.original.banned ? (
        <Badge variant="destructive">Banned</Badge>
      ) : (
        <Badge variant="secondary">Active</Badge>
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
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <UserActions user={row.original} />,
  },
];

interface UsersTableProps {
  data: UserRow[];
  onPageChangeAction?: (page: number) => void;
  onSearchChangeAction?: (search: string) => void;
  page: number;
  pageSize: number;
  search?: string;
  total: number;
}

export function UsersTable({
  data,
  total,
  page,
  pageSize,
  search = "",
  onSearchChangeAction,
  onPageChangeAction,
}: UsersTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
      <div className="flex items-center justify-between">
        <Input
          className="max-w-sm"
          defaultValue={search}
          onChange={(e) => onSearchChangeAction?.(e.target.value)}
          placeholder="Search users..."
        />
        <span className="text-muted-foreground text-sm">
          {total} user{total !== 1 ? "s" : ""} total
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
                  No users found.
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
