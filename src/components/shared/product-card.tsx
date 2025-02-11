"use client";

import { formatCurrency } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import { Prelink } from "../ui/prelink";
import { ProductData } from "@/lib/types";

interface ProductCardProps {
  product: ProductData
}

export function ProductCard({ product }: ProductCardProps) {
  const rating =
    product.reviews.reduce(
      (acc: number, review: any) => acc + review.rating,
      0
    ) / product.reviews.length || 0;

  return (
    <Prelink
      prefetch={true}
      key={product.id}
      href={`/${product.categories[0]?.slug}/${product.subCategories[0]?.slug}/${product.slug}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <Image
          src={product.media[0]?.url || "/placeholder.svg"}
          alt={product.name}
          loading="eager"
          width={500}
          height={500}
          quality={50}
          className="aspect-square h-full w-full rounded-t-lg object-cover"
          sizes="(max-width: 768px) 100vw, 500px"
        />
      </div>
      <div className="flex flex-col gap-2 p-2 pb-3">
        <div className="flex items-center justify-between">
          <p className="line-clamp-2 text-sm font-medium md:text-lg">
            {product.name}
          </p>
          <div className="flex items-center gap-1">
            <Star className="size-3 fill-yellow-500 text-yellow-500" />
            <span className="text-xs">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {product.description}
        </p>
        <span className="text-sm font-medium">
          {formatCurrency(Number(product.price))}
        </span>
      </div>
    </Prelink>
  );
}
