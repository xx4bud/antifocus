import React from "react";
import ProductsForm from "./products-form";
import { prisma } from "@/lib/prisma";
import {
  getCategoryDataInclude,
  getProductDataInclude,
} from "@/lib/queries";
import { Decimal } from "@prisma/client/runtime/library";

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

  // if (product) {
  //   // Convert Decimal to Decimal for frontend use
  //   product.price = new Decimal(product.price.toString());
  //   product.subCategories = product.subCategories.map(
  //     (subCategory) => ({
  //       ...subCategory,
  //     })
  //   );
  //   product.variants = product.variants.map((variant) => ({
  //     ...variant,
  //     price: new Decimal(variant.price.toString()),
  //   }));
  // }

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 md:p-3">
      <ProductsForm
        product={product}
        categories={categories}
      />
    </div>
  );
}
