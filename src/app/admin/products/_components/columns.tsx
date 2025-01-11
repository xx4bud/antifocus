"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ColumnHeader } from "@/components/ui/data-table/column-header";
import { RowActions } from "./row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Prisma, ProductStatus } from "@prisma/client";

export type ProductColumn = {
  id: string;
  slug: string;
  name: string;
  photos: {
    url: string;
    publicId: string;
  }[];
  price: string;
  variants: {
    id: string;
    name: string;
    price: string;
    stock: number;
    photos: {
      url: string;
      publicId: string;
    }[];
  }[];
  stock: number;
  status: string;
  subCategories: {
    id: string;
    name: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
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
    accessorKey: "price",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Price" />
    ),
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Stock" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const statusValue = row.getValue("status") as string;
      const status = Object.values(ProductStatus).find(
        (status) => status.valueOf() === statusValue
      );

      if (!status) {
        return null;
      }
      return (
        <div className="flex w-[100px] items-center">
          <span>{status}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "subCategories",
    header: ({ column }) => (
      <ColumnHeader
        column={column}
        title="Sub Categories"
      />
    ),
    cell: ({ row }) => {
      const subCategories = row.getValue(
        "subCategories"
      ) as {
        id: string;
        name: string;
      }[];

      if (!subCategories) {
        return null;
      }

      const subCategoryNames = subCategories
        .map(
          (subCategory: { name: string }) =>
            subCategory.name
        )
        .join(", ");

      return (
        <div
          key={row.id}
          className="flex w-[100px] items-center"
        >
          <span className="truncate">
            {subCategoryNames}
          </span>
        </div>
      );
    },
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
