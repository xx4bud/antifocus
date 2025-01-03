"use client";

import { CategoryData } from "@/lib/queries";
import Link from "next/link";
interface CategoriesClientProps {
  categories: CategoryData[];
}

export default function CategoriesClient({
  categories,
}: CategoriesClientProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-auto rounded-lg border bg-card">
      {categories.map((category) => {
        return (
          <Link
            key={category.id}
            href={`/admin/categories/${category.slug}`}
            className="flex items-center justify-between px-4 py-2"
          >
            <span>{category.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
