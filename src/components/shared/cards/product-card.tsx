"use client";

import { formatCurrency } from "@/lib/utils";
import { ProductData } from "@/lib/types";
import { ImageSwiper } from "./image-swiper";

interface ProductCardProps {
  product: ProductData;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border transition-transform hover:scale-[1.02]">
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <ImageSwiper
          media={product.media}
          alt={product.name}
        />
      </div>
      <div className="flex flex-col gap-2 p-2 pb-3">
        <p className="line-clamp-2 text-sm font-medium md:text-lg">
          {product.name}
        </p>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {product.description}
        </p>
        <span className="text-sm font-medium">
          {formatCurrency(Number(product.price))}
        </span>
      </div>
    </div>
  );
}
