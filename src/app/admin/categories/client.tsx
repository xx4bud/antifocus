"use client";

import { Heading } from "@/components/ui/heading";
import { CategoryData } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Category } from "@prisma/client";

interface CategoriesClientProps {
  categories: CategoryData[];
}

export default function CategoriesClient({
  categories,
}: CategoriesClientProps) {
  return (
    <div className="flex h-full flex-col overflow-y-visible rounded-lg border bg-card p-4">
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

      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/admin/categories/${category.slug}`}
        >
          {category.subCategories.map((subCategory) => (
            <div
              key={subCategory.id}
              className="flex items-center justify-between px-4 py-2"
            >
              <span>{category.name}</span>
              <span>{subCategory.name}</span>
            </div>
          ))}
        </Link>
      ))}
    </div>
  );
}
