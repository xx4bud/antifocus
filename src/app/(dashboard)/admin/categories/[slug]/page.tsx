import prisma from "@/lib/prisma";
import { CategoryForm } from "./category-form";
import { getCategoryDataInclude } from "@/types";

interface CategoriesSlugPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoriesSlugPage({
  params,
}: CategoriesSlugPageProps) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: {
      slug,
    },
    include: getCategoryDataInclude(),
  });
  return <CategoryForm category={category} />;
}
