import React from "react";
import CategoriesClient from "./client";
import { prisma } from "@/lib/prisma";
import { getCategoryDataInclude } from "@/lib/queries";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: getCategoryDataInclude(),
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="flex h-full w-full flex-1">
      <CategoriesClient categories={categories} />
    </div>
  );
}
