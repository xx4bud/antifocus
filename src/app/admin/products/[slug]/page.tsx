import React from "react";
import ProductsForm from "./products-form";
import { prisma } from "@/lib/prisma";
import { getCategoryDataInclude, getProductDataInclude } from "@/lib/queries";

interface ProductsSlugProps {
  params: {
    slug: string;
  };
}

export default async function ProductsSlug({
  params,
}: ProductsSlugProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: {
      slug: slug,
    },
    include: getProductDataInclude(),
  });

  const categories = await prisma.category.findMany({
    include: getCategoryDataInclude(),
  });

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 md:p-3">
      <ProductsForm product={product} categories={categories} />
    </div>
  );
}
