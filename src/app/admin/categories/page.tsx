import { prisma } from "@/lib/prisma";
import CategoriesClient from "./client";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: true,
      subCategories: true,
      photos: true,
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
