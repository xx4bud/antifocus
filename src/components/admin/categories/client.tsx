"use client";

import { Heading } from "@/components/ui/heading";
import { CategoryData } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table/data-table";
import {
  CategoryColumn,
  columns,
} from "./_components/columns";

interface CategoriesClientProps {
  categories: CategoryColumn[];
}

export default function CategoriesClient({
  categories,
}: CategoriesClientProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-auto rounded-lg border bg-card p-4">
      <Heading
        title="Categories"
        amount={categories.length}
        description="Manage our categories"
        button={
          <Button asChild>
            <Link href={"/admin/categories/add"}>
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Link>
          </Button>
        }
      />
      <Separator className="my-3" />

      <DataTable columns={columns} data={categories} />
    </div>
  );
}
