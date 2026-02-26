import { IconShoppingCart } from "@tabler/icons-react";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";

import { Separator } from "~/components/ui/separator";
import { Link } from "~/i18n/navigation";

interface ProductMedia {
  id: string;
  isMain: boolean;
  name: string;
  position: number;
  url: string;
}

interface ProductVariant {
  enabled: boolean;
  id: string;
  name: string;
  price: string;
  sku: string | null;
  stock: number;
}

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

interface ProductOrganization {
  id: string;
  logo: string | null;
  name: string;
  slug: string;
}

interface ProductPageProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    basePrice: string;
    currency: string;
    weight: number | null;
    dimensions: unknown;
    status: string | null;
    attributes: unknown;
    variants: ProductVariant[];
    medias: ProductMedia[];
    categories: ProductCategory[];
    organization: ProductOrganization | null;
    createdAt: Date;
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

export function ProductPage({ product }: ProductPageProps) {
  const mainImage = product.medias.find((m) => m.isMain) ?? product.medias[0];
  const otherImages = product.medias.filter((m) => m.id !== mainImage?.id);

  return (
    <main className="flex w-full flex-1 flex-col gap-8 py-6">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Image Gallery */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
            {mainImage ? (
              <Image
                alt={product.name}
                className="size-full object-cover"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                src={mainImage.url}
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <IconShoppingCart className="size-16 text-muted-foreground/30" />
              </div>
            )}
          </div>
          {otherImages.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {otherImages.slice(0, 4).map((media) => (
                <div
                  className="relative aspect-square overflow-hidden rounded-lg bg-muted"
                  key={media.id}
                >
                  <Image
                    alt={media.name}
                    className="size-full object-cover"
                    fill
                    sizes="25vw"
                    src={media.url}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-4">
          {/* Categories */}
          {product.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.categories.map((cat) => (
                <Link
                  href={{ pathname: "/[slug]", params: { slug: cat.slug } }}
                  key={cat.id}
                >
                  <Badge
                    className="transition-colors hover:bg-primary hover:text-primary-foreground"
                    variant="secondary"
                  >
                    {cat.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          <h1 className="font-bold text-2xl tracking-tight md:text-3xl">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-2">
            <span className="font-bold text-3xl text-primary tabular-nums">
              {formatCurrency(product.basePrice, product.currency)}
            </span>
          </div>

          <Separator />

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="mb-2 font-semibold text-sm">Deskripsi</h3>
              <p className="whitespace-pre-line text-muted-foreground text-sm leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Variants */}
          {product.variants.length > 0 && (
            <div>
              <h3 className="mb-3 font-semibold text-sm">Varian</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <div
                    className="rounded-lg border bg-card px-4 py-2 transition-colors hover:border-primary"
                    key={variant.id}
                  >
                    <div className="font-medium text-sm">{variant.name}</div>
                    <div className="text-muted-foreground text-xs tabular-nums">
                      {formatCurrency(variant.price, product.currency)}
                    </div>
                    {variant.stock > 0 && (
                      <div className="text-green-600 text-xs dark:text-green-400">
                        Stok: {variant.stock}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weight */}
          {product.weight && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>Berat:</span>
              <span className="font-medium tabular-nums">
                {product.weight >= 1000
                  ? `${(product.weight / 1000).toFixed(1)} kg`
                  : `${product.weight} gram`}
              </span>
            </div>
          )}

          <Separator />

          {/* Organization */}
          {product.organization && (
            <Link
              className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted"
              href={{
                pathname: "/[slug]",
                params: { slug: product.organization.slug },
              }}
            >
              {product.organization.logo ? (
                <Image
                  alt={product.organization.name}
                  className="size-10 rounded-full object-cover"
                  height={40}
                  src={product.organization.logo}
                  width={40}
                />
              ) : (
                <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {product.organization.name[0]}
                </div>
              )}
              <div>
                <div className="font-medium text-sm">
                  {product.organization.name}
                </div>
                <div className="text-muted-foreground text-xs">
                  Lihat toko →
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
