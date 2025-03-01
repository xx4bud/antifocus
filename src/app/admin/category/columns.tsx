"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import { CategoryData } from "@/lib/types";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronRight, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "./[slug]/actions";

interface ActionCellProps {
  row: Row<CategoryData>;
}

const ActionCell = ({ row }: ActionCellProps) => {
  const router = useRouter();

  const handleEdit = (data: CategoryData) => {
    router.push(`/admin/category/${data.slug}`);
  };

  const handleDelete = async (data: CategoryData) => {
    try {
      const result = await deleteCategory(data.id);
      if (result.success) {
        toast.success("Category deleted successfully");
        router.refresh();
        return { success: true };
      } else {
        toast.error(result.message || "Failed to delete category");
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
      onEdit={() => handleEdit(row.original)}
      onDelete={() => handleDelete(row.original)}
    />
  );
};

export const columns: ColumnDef<CategoryData>[] = [
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
    cell: ({ row }) => {
      const category = row.original;
      const hasChildren = category.children && category.children.length > 0;
      const isExpanded = row.getIsExpanded();
      const isFeatured = category.featured;
      const depth = row.depth ?? 0;
      
      return (
        <div className="flex items-center">
          <div style={{ marginLeft: `${depth * 24}px` }} className="flex items-center gap-2">
            {hasChildren && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => row.toggleExpanded()}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
            <span className="flex items-center gap-2">
              {row.getValue("name")}
              {isFeatured && (
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              )}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "slug",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Slug"
        />
      );
    },
    cell: ({ row }) => <div>{row.getValue("slug")}</div>,
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Description"
        />
      );
    },
    cell: ({ row }) => <div>{row.getValue("description") || "-"}</div>,
  },
  {
    accessorKey: "views",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Views"
        />
      );
    },
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {row.getValue("views")?.toLocaleString() || "0"}
      </div>
    ),
  },
  {
    accessorKey: "featured",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Featured"
        />
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${row.getValue("featured") ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
        >
          {row.getValue("featured") ? "Featured" : "Standard"}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ActionCell,
  },
];