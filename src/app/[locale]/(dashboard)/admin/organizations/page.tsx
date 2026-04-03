"use client";

import { IconDots, IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RouterOutputs } from "@/lib/api";
import { useTRPC } from "@/lib/api";

type Org = NonNullable<RouterOutputs["admin"]["getOrganizations"]>[number];

export default function AdminOrganizationsPage() {
  const trpc = useTRPC();
  const { data: orgs } = useQuery(trpc.admin.getOrganizations.queryOptions());

  const columns: ColumnDef<Org>[] = [
    {
      accessorKey: "name",
      header: "Organization Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{row.original.name}</span>
          <span className="text-muted-foreground text-xs">
            {row.original.slug}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => (
        <Badge className="capitalize" variant="outline">
          {row.getValue("plan")}
        </Badge>
      ),
    },
    {
      accessorKey: "members",
      header: "Members",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.members} Members
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return new Date(row.original.createdAt).toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: () => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 w-8 p-0" variant="ghost">
                <IconDots className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Add Member</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Suspend Organization
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl tracking-tight">Organizations</h2>
        <Button size="sm">
          <IconPlus className="mr-2 h-4 w-4" /> New Org
        </Button>
      </div>

      <DataTable columns={columns} data={orgs ?? []} />
    </div>
  );
}
