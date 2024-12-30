import React from "react";
import { prisma } from "@/lib/prisma";
import CategoryForm from "./category-form";

interface CategorySlugProps {
  params: {
    slug: string;
  };
}

export default async function CategorySlug({
  params,
}: CategorySlugProps) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: {
      slug: slug,
    },
    include: {
      photos: true,
      subCategories: true,
    },
  });

  return (
    <div className="flex h-screen w-full gap-4 md:p-3">
      <CategoryForm category={category} />
    </div>
  );
}
