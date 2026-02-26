import { IconArrowRight } from "@tabler/icons-react";
import { Link } from "~/i18n/navigation";
import { ProductCard } from "./product-card";

interface Product {
  basePrice: string;
  currency: string;
  description: string | null;
  id: string;
  mainImage: { url: string; name: string } | null;
  name: string;
  slug: string;
}

interface ProductGridProps {
  products: Product[];
  showViewAll?: boolean;
  subtitle?: string;
  title?: string;
}

export function ProductGrid({
  products,
  title = "Produk Terbaru",
  subtitle = "Temukan produk terbaik untuk kebutuhan Anda",
  showViewAll = true,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <section className="py-4">
        <div className="mb-6">
          <h2 className="font-bold text-2xl tracking-tight">{title}</h2>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 py-16">
          <p className="text-muted-foreground">Belum ada produk tersedia</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">{title}</h2>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </div>
        {showViewAll && (
          <Link
            className="hidden items-center gap-1 font-medium text-primary text-sm transition-colors hover:text-primary/80 md:flex"
            href="/search"
          >
            Lihat Semua
            <IconArrowRight className="size-4" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {showViewAll && (
        <div className="mt-6 flex justify-center md:hidden">
          <Link
            className="inline-flex items-center gap-1 font-medium text-primary text-sm"
            href="/search"
          >
            Lihat Semua Produk
            <IconArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
