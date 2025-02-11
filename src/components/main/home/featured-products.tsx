"use client";

import { ProductCard } from "@/components/shared/cards/product-card";
import { Button } from "@/components/ui/button";
import { Prelink } from "@/components/ui/prelink";
import { ProductData } from "@/lib/types";
import { ArrowRight } from "lucide-react";

interface FeaturedProductsProps {
  products: ProductData[];
}

export default function FeaturedProducts({
  products,
}: FeaturedProductsProps) {
  return (
    <div>
      <div className="flex flex-col gap-2 text-center">
        <h1 className="-my-1 text-xl font-bold sm:text-2xl">
          Discovery Product
        </h1>
        <p className="text-sm text-muted-foreground sm:text-lg">
          We curate a selection of products based on trends
          and preferences.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3.5 pt-4 md:grid-cols-6">
        {products?.map((product) => (
          <Prelink
            prefetch={true}
            key={product.id}
            href={`/${product.categories[0].slug}/${product.subCategories[0].slug}/${product.slug}`}
          >
            <ProductCard product={product} />
          </Prelink>
        ))}
      </div>
      <div className="flex flex-1 pt-3.5">
        <Button className="flex-1" variant={"outline"}>
          View All
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
