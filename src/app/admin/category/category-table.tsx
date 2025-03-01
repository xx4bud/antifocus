"use client";

import { DataTable } from "@/components/ui/data-table";
import { CategoryData } from "@/lib/types";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";
import { columns } from "./columns";

interface CategoryTableProps {
  categories: CategoryData[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const defaultVisibility = {
    slug: false,
    description: false,
  };

  const searchableColumns = [
    {
      id: "name",
      title: "Name",
    },
    {
      id: "slug",
      title: "Slug",
    },
  ];

  const filterableColumns = [
    {
      id: "status",
      title: "Status",
      options: [
        { value: "ACTIVE", label: "Active" },
        { value: "INACTIVE", label: "Inactive" },
      ],
    },
    {
      id: "featured",
      title: "Featured",
      options: [
        { value: "true", label: "Featured" },
        { value: "false", label: "Not Featured" },
      ],
    },
  ];

  const handleRowToggle = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex flex-1 flex-col">
      <Heading
        title="Category List"
        amount={categories.length}
        button={
          <Button asChild size={"sm"}>
            <Link href={"/admin/category/new"}>
              <Plus />
              Category
            </Link>
          </Button>
        }
      />
      <DataTable
        data={categories}
        columns={columns}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        defaultColumnVisibility={defaultVisibility}
        expandedRows={expandedRows}
        onRowToggle={handleRowToggle}
      />
    </div>
  );
}
