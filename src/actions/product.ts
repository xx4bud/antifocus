"use server";

import { prisma } from "@/lib/prisma";
import { getProductInclude } from "@/lib/types";

export const getProductBySlug = async (slug: string) => {
  const decodedSlug = decodeURIComponent(slug);
  const product = await prisma.product.findFirst({
    where: { slug: decodedSlug },
    include: getProductInclude(),
  });
  return product
    ? JSON.parse(JSON.stringify(product))
    : null;
};

export const getAllProducts = async () => {
  const products = await prisma.product.findMany({
    include: getProductInclude(),
  });
  return products
    ? JSON.parse(JSON.stringify(products))
    : [];
};
