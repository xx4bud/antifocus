import prisma from "@/lib/prisma";
import { CategoriesClient } from "@/app/(dashboard)/admin/categories/client";
import { getCategoryDataInclude } from "@/types";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: getCategoryDataInclude(),
    orderBy: {
      name: "asc",
    },
  });
  return <CategoriesClient categories={categories} />;
}
