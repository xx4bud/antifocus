"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import { ProductData } from "@/lib/types";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/utils";
import { deleteProduct } from "./[slug]/actions";

interface ActionCellProps {
  row: Row<ProductData>;
}

const ActionCell = ({ row }: ActionCellProps) => {
  const router = useRouter();

  const handleEdit = (data: ProductData) => {
    router.push(`/admin/product/${data.slug}`);
  };

  const handleDelete = async (data: ProductData) => {
  };

  return (
    <DataTableRowActions
      row={row}
      onEdit={handleEdit}
    //   onDelete={handleDelete}
    />
  );
};

export const columns: ColumnDef<ProductData>[] = [
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
    accessorKey: "sku",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="SKU"
        />
      );
    },
    cell: ({ row }) => <div>{row.getValue("sku")}</div>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Price"
        />
      );
    },
    cell: ({ row }) => (
      <div>{formatRupiah(row.getValue("price"))}</div>
    ),
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Stock"
        />
      );
    },
    cell: ({ row }) => <div>{row.getValue("stock")}</div>,
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Category"
        />
      );
    },
    cell: ({ row }) => {
      const category = row.original.categories?.[0];
      return (
        <div className="capitalize">
          {category ? (
            <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
              {category.name}
            </span>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      );
    },
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
            row.getValue("status") === "PUBLISHED"
              ? "bg-green-500 text-white"
              : row.getValue("status") === "DRAFT"
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
      return <span className="text-xs">Action</span>;
    },
    cell: ({ row }) => <ActionCell row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];
