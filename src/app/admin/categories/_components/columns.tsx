"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ColumnHeader } from "@/components/ui/data-table/column-header";
import { RowActions } from "./row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export type CategoryColumn = {
  id: string;
  slug: string;
  name: string;
  photos: {
    url: string;
    publicId: string;
  }[];
  _count: {
    subCategories: number;
  };
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    id: " select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() &&
            "indeterminate")
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) =>
          row.toggleSelected(!!value)
        }
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "photo",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Photo" />
    ),
    cell: ({ cell }) => (
      <div className="flex items-center">
        <Image
          src={cell.getValue<string>() || "Category Icon"}
          alt={cell.row.original.name}
          width={50}
          height={50}
          className="size-9 rounded-md object-cover"
        />
      </div>
    ),
  },
  {
    accessorKey: "_count.subCategories",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Subs" />
    ),
    cell: ({ cell }) => (
      <div className="flex items-center px-2">
        {cell.getValue<number>()}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Created At" />
    ),
    cell: ({ cell }) => (
      <div className="flex items-center">
        {cell.getValue<Date>().toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ cell }) => (
      <div className="flex items-center">
        {cell.getValue<Date>().toLocaleString()}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-1 h-8 md:-ml-5"
      >
        <span className="hidden md:block">Actions</span>
        <Settings className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <RowActions row={row} />,
  },
];
