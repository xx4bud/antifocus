"use client";

import { CategoryData } from "@/lib/types";

interface CategoryTableProps {
  categories: CategoryData[];
}
export function CategoryTable({
  categories,
}: CategoryTableProps) {
  return (
    <div>
      {categories.map((category) => (
        <ul key={category.id}>
          <li>{category.name}</li>
        </ul>
      ))}
    </div>
  );
}
