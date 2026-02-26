"use client";

import { IconBan } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { toast } from "~/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { FormModal } from "~/features/admin/shared/components/form-modal";
import { RowActionsDropdown } from "~/features/admin/shared/components/row-actions-dropdown";
import {
  deleteOrganization,
  softDeleteOrganization,
} from "~/features/admin/tenants/actions/organization-mutations";
import { OrganizationForm } from "~/features/admin/tenants/components/organization-form";

interface Organization {
  createdAt: Date;
  id: string;
  logo: string | null;
  name: string;
  slug: string;
  status: string;
}

interface OrganizationsTableProps {
  data: Organization[];
  total: number;
}

const orgStatusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400",
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
  banned: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400",
};

export function OrganizationsTable({ data, total }: OrganizationsTableProps) {
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  const handleSoftDelete = async (id: string) => {
    const res = await softDeleteOrganization(id);
    if (res.success) {
      toast.success("Organization soft deleted successfully");
    } else {
      toast.error(res.error?.message ?? "Error disabling organization");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteOrganization(id);
    if (res.success) {
      toast.success("Organization deleted successfully");
    } else {
      toast.error(res.error?.message ?? "Error deleting organization");
    }
  };

  return (
    <>
      <FormModal
        description="Edit an existing organization."
        onOpenChange={(open) => !open && setEditingOrg(null)}
        open={!!editingOrg}
        title="Edit Organization"
      >
        {({ onSuccess }) => (
          <OrganizationForm
            initialData={
              editingOrg
                ? {
                    id: editingOrg.id,
                    name: editingOrg.name,
                    slug: editingOrg.slug,
                    logo: editingOrg.logo,
                    status: editingOrg.status as
                      | "active"
                      | "pending"
                      | "inactive"
                      | "banned",
                  }
                : undefined
            }
            onSuccess={onSuccess}
          />
        )}
      </FormModal>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  className="text-center text-muted-foreground"
                  colSpan={5}
                >
                  No organizations found
                </TableCell>
              </TableRow>
            ) : (
              data.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {org.logo ? (
                        <Image
                          alt={org.name}
                          className="size-8 rounded-full object-cover"
                          height={32}
                          src={org.logo}
                          width={32}
                        />
                      ) : (
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                          {org.name[0]}
                        </div>
                      )}
                      {org.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {org.slug}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={orgStatusColors[org.status] ?? ""}
                      variant="secondary"
                    >
                      {org.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(org.createdAt).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <RowActionsDropdown
                      actions={[
                        {
                          label: "Soft Delete",
                          icon: <IconBan className="mr-2 size-4" />,
                          onClick: () => handleSoftDelete(org.id),
                          variant: "destructive",
                        },
                      ]}
                      deleteAction={() => handleDelete(org.id)}
                      editAction={() => setEditingOrg(org)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="border-t px-4 py-3 text-muted-foreground text-sm">
          {total} organization(s) total
        </div>
      </div>
    </>
  );
}
