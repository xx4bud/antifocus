"use client";

import { formatCurrency } from "@/lib/utils";
import { ProductData } from "@/lib/types";
import { ImageSwiper } from "./image-swiper";

interface ProductCardProps {
  product: ProductData;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="relative flex min-h-[250px] flex-col justify-between overflow-hidden rounded-lg border transition-transform hover:scale-[1.01]">
      <div className="aspect-square overflow-hidden rounded-t-lg">
        <ImageSwiper
          media={product.media}
          alt={product.name}
        />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2 p-2 pb-3">
        <div>
          <p className="line-clamp-1 font-medium">
            {product.name}
          </p>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {product.description}
          </p>
        </div>
        <span className="text-sm font-medium">
          {formatCurrency(Number(product.price))}
        </span>
      </div>
    </div>
  );
}
