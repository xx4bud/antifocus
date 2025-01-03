import React from "react";
import CategoriesClient from "./client";
import { prisma } from "@/lib/prisma";
import { CategoryData, getCategoryDataInclude } from "@/lib/queries";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: getCategoryDataInclude(),
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 md:p-3">
      <CategoriesClient categories={categories} />
    </div>
  );
}
