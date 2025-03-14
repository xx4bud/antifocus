import { getProductBySlug } from "@/actions/product";
import { ProductForm } from "./product-form";

interface ProductSlugProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductSlug({
  params,
}: ProductSlugProps) {
    const{slug}= await params
    const product = await getProductBySlug(slug)

  return <ProductForm product={product} />;
}
