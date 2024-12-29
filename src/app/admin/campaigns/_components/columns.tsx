"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { ColumnHeader } from "./column-header"
import { RowActions } from "./row-actions"
import { Checkbox } from "@/components/ui/checkbox"

export type CampaignColumn = {
  id: string
  slug: string
  name: string
  description: string
  photo: string
  createdAt: string
  updatedAt: string
}

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
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <ColumnHeader column={column} title="Id" />
  //   ),
  //   cell: ({ row }) => (
  //     <div className="w-[80px]">{row.getValue("id")}</div>
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Name" />
    ),
    // cell: ({ row }) => {
    //   const label = labels.find((label) => label.value === row.original.label)

    //   return (
    //     <div className="flex space-x-2">
    //       {label && <Badge variant="outline">{label.label}</Badge>}
    //       <span className="max-w-[500px] truncate font-medium">
    //         {row.getValue("title")}
    //       </span>
    //     </div>
    //   )
    // },
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
    cell: ({ row }) => <RowActions row={row} />,
  },
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
  //   cell: ({ row }) => {
  //     const status = statuses.find(
  //       (status) => status.value === row.getValue("status")
  //     )

  //     if (!status) {
  //       return null
  //     }

  //     return (
  //       <div className="flex w-[100px] items-center">
  //         {status.icon && (
  //           <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{status.label}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  // {
  //   accessorKey: "priority",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Priority" />
  //   ),
  //   cell: ({ row }) => {
  //     const priority = priorities.find(
  //       (priority) => priority.value === row.getValue("priority")
  //     )

  //     if (!priority) {
  //       return null
  //     }

  //     return (
  //       <div className="flex items-center">
  //         {priority.icon && (
  //           <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{priority.label}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
]
