import React from "react";
import ProductsClient from "./client";
import { prisma, superjson } from "@/lib/prisma";
import { getProductDataInclude } from "@/lib/queries";
import { ProductData } from "@/lib/queries";
import { formatRelativeDate, formatNumber } from "@/lib/utils";
import { format } from "date-fns";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: getProductDataInclude(),
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts = products.map((product) => ({
    ...product,
    photo: product.photos[0].url,
    price: formatNumber(product.price.toNumber()),
    stock: product.stock,
    createdAt: formatRelativeDate(product.createdAt),
    subCategories: product.subCategories.map((subCategory) => ({
      ...subCategory,
      id: subCategory.id,
      name: subCategory.name,
    })),
    status: product.status,
    updatedAt: formatRelativeDate(product.updatedAt),
    variants: product.variants?.map((variant) => ({
      ...variant,
      price: formatNumber(variant.price.toNumber()),
    })),
  }));
  
  // const { json: serializedProducts } = superjson.serialize(
  //   formattedProducts
  // );
  // const formattedProductsData =
  //   serializedProducts as unknown as ProductData[];

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 md:p-3">
      <ProductsClient products={formattedProducts} />
    </div>
  );
}
