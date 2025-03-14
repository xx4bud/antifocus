"use client";

import { DataTable } from "@/components/ui/data-table";
import { ProductData } from "@/lib/types";
import { columns } from "./columns";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

interface ProductTableProps {
  products: ProductData[];
}

export function ProductTable({
  products,
}: ProductTableProps) {
  const defaultVisibility = {
    description: false,
    sku: false,
    cost: false,
  };

  const searchableColumns = [
    {
      id: "name",
      title: "Name",
    },
    {
      id: "sku",
      title: "SKU",
    },
  ];

  const filterableColumns = [
    {
      id: "status",
      title: "Status",
      options: [
        { value: "DRAFT", label: "Draft" },
        { value: "PUBLISHED", label: "Published" },
        { value: "ARCHIVED", label: "Archived" },
      ],
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <Heading
        title="Product List"
        amount={products.length}
        button={
          <Button asChild size={"sm"}>
            <Link href={"/admin/product/new"}>
              <Plus />
              Product
            </Link>
          </Button>
        }
      />
      <DataTable
        data={products}
        columns={columns}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        defaultColumnVisibility={defaultVisibility}
      />
    </div>
  );
}
