import { IconShoppingCart } from "@tabler/icons-react";
import Image from "next/image";
import { Card, CardContent } from "~/components/ui/card";

import { Link } from "~/i18n/navigation";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    basePrice: string;
    currency: string;
    mainImage: { url: string; name: string } | null;
  };
}

function formatCurrency(amount: string, currency: string) {
  const num = Number.parseFloat(amount);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      className="group"
      href={{ pathname: "/[slug]", params: { slug: product.slug } }}
    >
      <Card className="overflow-hidden border transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.mainImage ? (
            <Image
              alt={product.name}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              src={product.mainImage.url}
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/5">
              <IconShoppingCart className="size-12 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <CardContent className="p-3 sm:p-4">
          <h3 className="line-clamp-2 min-h-[2.5rem] font-semibold text-sm leading-tight transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          {product.description && (
            <p className="mt-1 line-clamp-1 text-muted-foreground text-xs">
              {product.description}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <span className="font-bold text-base text-primary tabular-nums">
              {formatCurrency(product.basePrice, product.currency)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
