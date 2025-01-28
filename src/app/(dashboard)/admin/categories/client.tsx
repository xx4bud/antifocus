"use client";

import { CategoryData } from "@/types";
import * as React from "react";

interface CategoriesClientProps {
  categories: CategoryData[];
}
export function CategoriesClient({
  categories,
}: CategoriesClientProps) {
  return (
    <div className="container flex flex-1 flex-col">
      {categories.map((category) => (
        <div key={category.id}>
          <div>{category.name}</div>
          {category.subCategories.map((subCategory) => (
            <div key={subCategory.id}>
              {subCategory.name}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
