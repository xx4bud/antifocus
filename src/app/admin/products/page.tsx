import React from 'react'
import ProductsClient from './client'
import { prisma } from '@/lib/prisma';
import { getProductDataInclude } from '@/lib/queries';

export default async function ProductsPage() {

  const products = await prisma.product.findMany({
    include: getProductDataInclude(),
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 md:p-3">
      <ProductsClient products={products} />
    </div>
  )
}
