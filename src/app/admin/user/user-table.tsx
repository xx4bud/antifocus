"use client";

import { DataTable } from "@/components/ui/data-table";
import { UserData } from "@/lib/types";
import { columns } from "./columns";
import { UserRole, UserStatus } from "@/lib/constants";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

interface UserTableProps {
  users: UserData[];
}

export function UserTable({ users }: UserTableProps) {
  const defaultVisibility = {
    email: false,
    phone: false,
  };

  const searchableColumns = [
    {
      id: "name",
      title: "Name",
    },
    {
      id: "email",
      title: "Email",
    },
  ];

  const filterableColumns = [
    {
      id: "role",
      title: "Role",
      options: Object.values(UserRole).map((role) => ({
        value: role,
        label: role,
      })),
    },
    {
      id: "status",
      title: "Status",
      options: Object.values(UserStatus).map((status) => ({
        value: status,
        label: status,
      })),
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <Heading
        title="User List"
        amount={users.length}
        button={
          <Button asChild size={"sm"}>
            <Link href={"/admin/user/new"}>
              <Plus />
              User
            </Link>
          </Button>
        }
      />
      <DataTable
        data={users}
        columns={columns}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        defaultColumnVisibility={defaultVisibility}
      />
    </div>
  );
}
