"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ColumnHeader } from "./column-header";
import { RowActions } from "./row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings } from "lucide-react";

export type CampaignColumn = {
  id: string;
  slug: string;
  name: string;
  description: string;
  photos: {
    url: string;
    publicId: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<CampaignColumn>[] = [
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
    header: "Photo",
    cell: ({ cell }) => (
      <div className="flex items-center">
        <Image
          src={cell.getValue<string>()}
          alt={cell.row.original.name}
          width={50}
          height={50}
          className="size-9 rounded-md object-cover"
        />
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
  },
  {
    id: "actions",
    header: ({}) => {
      return (
        <div className="flex items-center">
          <p className="hidden md:flex">Actions</p>
          <Settings className="ml-2 flex size-4 md:hidden" />
        </div>
      );
    },
    cell: ({ row }) => <RowActions row={row} />,
  },
];
