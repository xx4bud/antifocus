import React from "react";
import { prisma } from "@/lib/prisma";
import CategoriesClient from "./client";
import { getCategoryDataSelect } from "@/lib/queries";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      photos: {
        select: {
          id: true,
          url: true,
          publicId: true,
          categoryId: true,
        },
      },
      subCategories: {
        select: {
          id: true,
          name: true,
          description: true,
          categoryId: true,

        },
      },
      _count: {
        select: {
          photos: true,
          subCategories: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 md:p-3">
      <CategoriesClient categories={categories} />
    </div>
  );
}
