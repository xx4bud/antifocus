import React from "react";
import ProductsForm from "./products-form";
import { prisma, superjson } from "@/lib/prisma";
import {
  getCategoryDataInclude,
  getProductDataInclude,
  ProductData,
} from "@/lib/queries";

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

  const formattedProduct = product
    ? {
        ...product,
        price: product.price.toNumber(),
        variants: product.variants?.map((variant) => ({
          ...variant,
          price: variant.price.toNumber(),
        })),
      }
    : null;

  const { json: serializedProduct } = superjson.serialize(
    formattedProduct
  );

  const initialProduct =
    serializedProduct as unknown as ProductData | null;

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 md:p-3">
      <ProductsForm
        product={initialProduct}
        categories={categories}
      />
    </div>
  );
}
