import React from "react";
import CategoriesForm from "./categories-form";
import { prisma } from "@/lib/prisma";
import { getCategoryDataInclude } from "@/lib/queries";

interface CategoriesSlugProps {
  params: { slug: string };
}

export default async function CategoriesSlug({
  params,
}: CategoriesSlugProps) {
  const { slug } = await params;

  const categories = await prisma.category.findUnique({
    where: {
      slug: slug,
    },
    include: getCategoryDataInclude(),
  });

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 md:p-3">
      <CategoriesForm categories={categories} />
    </div>
  );
}
