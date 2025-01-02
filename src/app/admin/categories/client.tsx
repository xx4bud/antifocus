'use client'

import { CategoryData } from "@/lib/queries"
interface CategoriesClientProps {
    categories: CategoryData[]
}

export default function CategoriesClient({ categories }: CategoriesClientProps) {
    return (
      <div className="flex flex-col overflow-auto rounded-lg border bg-card h-full w-full">
        {categories.map((category) => (
          category.subCategories?.map((subCategory) => (
            <div key={subCategory.id}>{subCategory.name}</div>
          ))
        ))}
      </div>
    )
  }
