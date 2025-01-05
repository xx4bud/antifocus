import React from 'react'
import CategoriesForm from './categories-form'
import { prisma } from '@/lib/prisma';
import { getCategoryDataInclude } from '@/lib/queries';

interface CategoriesSlugProps {
  params: {
    slug: string;
  };
}

export default async function CategoriesSlug({
  params,
}: CategoriesSlugProps) {
    const { slug } = await params

    const category = await prisma.category.findUnique({
        where: {
            slug,
        },
        include: getCategoryDataInclude(),
    })
  return (
    <div className="flex h-full w-full flex-1">
    <CategoriesForm category={category} />
  </div>
  )
}
