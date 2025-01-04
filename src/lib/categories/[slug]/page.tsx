import { prisma } from "@/lib/prisma";
import {
  getCategoryDataSelect,
} from "@/lib/queries";
import React from "react";
import CategoriesForm from "./categories-form";

interface CategoriesSlugProps {
  params: { slug: string };
}

export default async function CategoriesSlug({
  params,
}: CategoriesSlugProps) {
  const { slug } = await params;

 const category = await prisma.category.findFirst({
  where: {
    slug,
  },
  include: getCategoryDataSelect(),
})

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 md:p-3">
      <CategoriesForm category={category} />
    </div>
  );
}
