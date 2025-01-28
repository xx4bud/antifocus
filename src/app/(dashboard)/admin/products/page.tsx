import prisma from "@/lib/prisma";
import { getProductDataInclude } from "@/types";
import ProductsClient from "@/app/(dashboard)/admin/products/client";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: getProductDataInclude(),
    orderBy: {
      createdAt: "desc",
    },
  });
  return <ProductsClient products={products} />
}
