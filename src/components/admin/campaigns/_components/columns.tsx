"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ColumnHeader } from "./column-header";
import { CellAction } from "./cell-action";

export type CampaignColumn = {
  id: string;
  slug: string;
  name: string;
  photo: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<CampaignColumn>[] = [
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
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
