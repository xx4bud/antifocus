import Image from "next/image";

import { Link } from "~/i18n/navigation";
import { ProductGrid } from "./product-grid";

interface CategoryChild {
  id: string;
  image: string | null;
  name: string;
  slug: string;
}

interface CategoryProduct {
  basePrice: string;
  currency: string;
  description: string | null;
  id: string;
  mainImage: { url: string; name: string } | null;
  name: string;
  slug: string;
}

interface CategoryPageProps {
  category: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    children: CategoryChild[];
    products: CategoryProduct[];
  };
}

export function CategoryPage({ category }: CategoryPageProps) {
  return (
    <main className="flex w-full flex-1 flex-col gap-6 py-6">
      {/* Category Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8">
        <div className="relative z-10 flex items-center gap-6">
          {category.image ? (
            <div className="relative size-20 overflow-hidden rounded-2xl border-2 border-primary/20 shadow-lg">
              <Image
                alt={category.name}
                className="size-full object-cover"
                fill
                sizes="80px"
                src={category.image}
              />
            </div>
          ) : (
            <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10">
              <span className="font-bold text-2xl text-primary">
                {category.name[0]}
              </span>
            </div>
          )}
          <div>
            <h1 className="font-bold text-2xl tracking-tight md:text-3xl">
              {category.name}
            </h1>
            <p className="text-muted-foreground text-sm">
              {category.products.length} produk ditemukan
            </p>
          </div>
        </div>
      </div>

      {/* Sub-categories */}
      {category.children.length > 0 && (
        <div>
          <h2 className="mb-4 font-semibold text-lg">Sub Kategori</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {category.children.map((child) => (
              <Link
                className="group flex flex-col items-center gap-2 rounded-xl border bg-card p-3 transition-all hover:border-primary/30 hover:shadow-md"
                href={{ pathname: "/[slug]", params: { slug: child.slug } }}
                key={child.id}
              >
                <div className="relative size-12 overflow-hidden rounded-full bg-muted">
                  {child.image ? (
                    <Image
                      alt={child.name}
                      className="size-full object-cover transition-transform group-hover:scale-110"
                      fill
                      sizes="48px"
                      src={child.image}
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-primary/10 font-bold text-primary text-sm">
                      {child.name[0]}
                    </div>
                  )}
                </div>
                <span className="line-clamp-1 text-center font-medium text-xs group-hover:text-primary">
                  {child.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <ProductGrid
        products={category.products}
        showViewAll={false}
        subtitle={`Semua produk dalam kategori ${category.name}`}
        title="Produk"
      />
    </main>
  );
}
