import prisma from "@/lib/prisma";
import { getProductDataInclude } from "@/types";
import { ProductsItem } from "@/app/(app)/(home)/_components/products-item";

export async function ProductsList() {
  const products = await prisma.product.findMany({
    include: getProductDataInclude(),
    orderBy: {
      createdAt: "desc",
    },
  });
  return <ProductsItem products={products} />;
}
