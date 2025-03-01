"use client";

import { MediaData } from "@/lib/types";
import Image from "next/image";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

interface ActionCellProps {
  row: Row<MediaData>;
}

const ActionCell = ({ row }: ActionCellProps) => {
  const router = useRouter();

  const handleEdit = (data: MediaData) => {
    router.push(`/admin/media/${data.id}`);
  };

  const handleDelete = async (data: MediaData) => {
    try {
      const response = await fetch(
        `/api/media/${data.id}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();

      if (result.success) {
        toast.success("Media deleted successfully");
        router.refresh();
        return { success: true };
      } else {
        toast.error(
          result.message || "Failed to delete media"
        );
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      return {
        success: false,
        message: "Something went wrong",
      };
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

export const columns: ColumnDef<MediaData>[] = [
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
    accessorKey: "url",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Preview"
        />
      );
    },
    cell: ({ row }) => (
      <div className="relative h-10 w-10">
        <Image
          src={row.getValue("url")}
          alt={row.original.alt || "Media"}
          fill
          className="rounded-md object-cover"
          sizes="40px"
        />
      </div>
    ),
  },
  {
    accessorKey: "alt",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Alt Text"
        />
      );
    },
    cell: ({ row }) => (
      <div>{row.getValue("alt") || "None"}</div>
    ),
  },
  {
    accessorKey: "format",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Format"
        />
      );
    },
    cell: ({ row }) => (
      <div>{row.getValue("format") || "None"}</div>
    ),
  },
  {
    accessorKey: "order",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Order"
        />
      );
    },
    cell: ({ row }) => {
      const order = row.getValue("order") as number;
      return (
        <div className="capitalize">
          <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
              order === 0
                ? "bg-green-500 text-white"
                : order === 1
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-500 text-white"
            }`}
          >
            {order === 0
              ? "Cover"
              : order === 1
                ? "Gallery"
                : "None"}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => `${row.width}×${row.height}`,
    id: "dimensions",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Dimensions"
        />
      );
    },
    cell: ({ row }) => {
      const width = Number(row.original.width);
      const height = Number(row.original.height);
      return (
        <span className="text-muted-foreground">
          {width} × {height} px
        </span>
      );
    },
  },
  {
    accessorKey: "size",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Size"
        />
      );
    },
    cell: ({ row }) => {
      const size = (row.getValue("size") as number) || 0;
      const sizeInKB = (size / 1024).toFixed(1);
      return (
        <span className="text-muted-foreground">
          {sizeInKB} KB
        </span>
      );
    },
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
