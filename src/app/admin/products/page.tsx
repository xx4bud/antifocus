import React from "react";
import ProductsClient from "./client";
import { prisma, superjson } from "@/lib/prisma";
import { getProductDataInclude } from "@/lib/queries";
import { ProductData } from "@/lib/queries";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: getProductDataInclude(),
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts = products.map((product) => ({
    ...product,
    price: product.price.toString(),
    variants: product.variants?.map((variant) => ({
      ...variant,
      price: variant.price.toString(),
    })),
  }));
  const { json: serializedProducts } = superjson.serialize(
    formattedProducts
  );

  const initialProducts =
    serializedProducts as unknown as ProductData[];

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 md:p-3">
      <ProductsClient products={initialProducts} />
    </div>
  );
}
