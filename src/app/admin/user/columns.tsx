"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import { UserData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/app/admin/user/[slug]/actions";
import { toast } from "sonner";

const ActionCell = ({ row }: { row: any }) => {
  const router = useRouter();

  const handleEdit = (data: UserData) => {
    router.push(`/admin/user/${data.slug}`);
  };

  const handleDelete = async (data: UserData) => {
    try {
      const result = await deleteUser(data.id);
      if (result.success) {
        toast.success("User deleted successfully");
        router.refresh();
        return { success: true };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      return { success: false, message: "Something went wrong" };
    }
  };

  return (
    <DataTableRowActions
      row={row}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export const columns: ColumnDef<UserData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) =>
          row.toggleSelected(!!value)
        }
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Name"
        />
      );
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Email"
        />
      );
    },
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Phone"
        />
      );
    },
    cell: ({ row }) => (
      <div>{row.getValue("phone") || "-"}</div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Role"
        />
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("role")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Status"
        />
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            row.getValue("status") === "ONLINE"
              ? "bg-green-500 text-white"
              : row.getValue("status") === "OFFLINE"
                ? "bg-yellow-500 text-white"
                : "bg-gray-500 text-white"
          }`}
        >
          {row.getValue("status")}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => {
      return (
        <span className="text-xs">Action</span>
      );
    },
    cell: ({ row }) => <ActionCell row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];
