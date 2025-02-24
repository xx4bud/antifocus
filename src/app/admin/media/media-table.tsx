"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { MediaData } from "@/lib/types";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import Link from "next/link";

interface MediaTableProps {
  media: MediaData[];
}

export function MediaTable({ media }: MediaTableProps) {
  const defaultVisibility = {
    format: false,
    size: false,
    dimensions: false,
  };

  const searchableColumns = [
    {
      id: "alt",
      title: "Alt Text",
    },
    {
      id: "format",
      title: "Format",
    },
  ];

  const filterableColumns = [
    {
      id: "order",
      title: "Order",
      options: [
        { value: "0", label: "Cover" },
        { value: "1", label: "Gallery" },
      ],
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <Heading
        title="Media List"
        amount={media.length}
        button={
          <Button asChild size={"sm"}>
            <Link href={"/admin/media/new"}>
              <Plus />
              Media
            </Link>
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={media}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        defaultColumnVisibility={defaultVisibility}
      />
    </div>
  );
}
