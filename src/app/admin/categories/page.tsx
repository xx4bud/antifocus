import React from "react";
import CategoriesClient from "./client";
import { prisma } from "@/lib/prisma";
import { getCategoryDataInclude } from "@/lib/queries";
import { formatRelativeDate } from "@/lib/utils";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: getCategoryDataInclude(),
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories = categories.map((category) => ({
    ...category,
    photo: category.photos[0].url,
    _count: { subCategories: category._count.subCategories },
    createdAt: formatRelativeDate(category.createdAt),
    updatedAt: formatRelativeDate(category.updatedAt),
  }));

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 md:p-3">
      <CategoriesClient categories={formattedCategories} />
    </div>
  );
}
