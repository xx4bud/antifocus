"use client";

import { CategoryData } from "@/types";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

interface CategoriesClientProps {
  categories: CategoryData[];
}

export function CategoriesClient({
  categories,
}: CategoriesClientProps) {
  return (
    <div className="flex flex-1 flex-col">
      {categories.map((category) => {
        const coverPhoto = category.photos.find(
          (photo) => photo.position === 0
        );

        return (
          <div key={category.id}>
            <Link
              href={`/admin/categories/${category.slug}`}
            >
              <div>
                <div>{category.name}</div>
                {coverPhoto && (
                  <Image
                    src={coverPhoto.url}
                    width={100}
                    height={100}
                    alt={category.name}
                  />
                )}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
