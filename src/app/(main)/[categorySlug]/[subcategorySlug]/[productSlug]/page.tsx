import NotFound from "@/app/not-found";
import { AppBreadcrumb } from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { getProduct } from "@/lib/queries/product";
import { MediaData, VariantData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";

interface ProductDetailPageProps {
  params: Promise<{
    productSlug: string;
  }>;
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: {
      slug: true,
      categories: {
        select: {
          slug: true,
        },
      },
      subCategories: {
        select: {
          slug: true,
        },
      },
    },
  });
  return products.map((product) => ({
    product: product.slug,
    category: product.categories[0].slug,
    subcategory: product.subCategories[0].slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { productSlug } = await params;
  const productData = await getProduct(productSlug);

  return {
    title: productData?.name || "Product",
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { productSlug } = await params;
  const productDecoded = decodeURIComponent(productSlug);
  const productData = await getProduct(productDecoded);

  if (!productData) return <NotFound title="product" />;

  return (
    <>
      <AppBreadcrumb />
      <div className="flex flex-col gap-4 p-1">
        {/* Detail Produk */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex gap-4">
            <div className="hidden flex-col gap-4 md:flex">
              {productData.media.map((media: MediaData) => (
                <div
                  key={media.id}
                  className="relative aspect-square"
                >
                  <Image
                    src={media.url}
                    alt={productData.name}
                    width={80}
                    height={80}
                    loading="eager"
                    quality={30}
                    className="aspect-square h-full w-full rounded object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="relative aspect-square h-full w-full">
              <Image
                src={
                  productData.media[0]?.url ||
                  "/placeholder.svg"
                }
                alt={productData.name}
                width={500}
                height={500}
                priority
                loading="eager"
                quality={50}
                className="h-full w-full rounded object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="line-clamp-2 text-xl font-bold">
              {productData.name}
            </h1>
            <p className="text-md text-muted-foreground">
              {productData.description}
            </p>
            <div className="flex flex-col gap-2">
              {productData.variants.map(
                (variant: VariantData) => (
                  <div key={variant.id}>
                    <span className="text-lg font-semibold">
                      {formatCurrency(
                        Number(variant.price)
                      )}
                    </span>
                  </div>
                )
              )}
            </div>
            <Button>Add to Cart</Button>
          </div>
        </section>

        {/* Review Produk */}
        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">Reviews</h2>
          <p>{productData.reviews.length} Review</p>
        </section>
      </div>
    </>
  );
}
