import { getCategoryBySlug, getAllCategories } from "@/actions/category";
import { CategoryForm } from "./category-form";

interface CategorySlugProps {
  params: Promise<{ slug: string }>;
}

export default async function CategorySlug({
  params,
}: CategorySlugProps) {
  const { slug } = await params;
  const [category, categories] = await Promise.all([
    getCategoryBySlug(slug),
    getAllCategories().catch(() => [])
  ]);

  return <CategoryForm category={category} categories={categories || []} />;
}
