import { IconSearch } from "@tabler/icons-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { searchProducts } from "~/features/home/actions/get-home-data";
import { ProductCard } from "~/features/home/components/product-card";
import { SearchFilters } from "~/features/home/components/search-filters";
import { createMetadata } from "~/utils/seo";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Cari Produk",
    description: "Cari produk cetak digital di Antifocus",
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const sortBy =
    (params.sort as
      | "newest"
      | "oldest"
      | "price_asc"
      | "price_desc"
      | "name") ?? "newest";

  const results = query.trim()
    ? await searchProducts({ query, limit: 20, sortBy })
    : null;

  return (
    <main className="flex w-full flex-1 flex-col gap-6 py-6">
      {/* Header */}
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Cari Produk</h1>
        {query && (
          <p className="text-muted-foreground text-sm">
            {results
              ? `${results.total} hasil untuk "${query}"`
              : `Mencari "${query}"...`}
          </p>
        )}
      </div>

      <Suspense fallback={<SearchSkeleton />}>
        <SearchFilters currentQuery={query} currentSort={sortBy} />
      </Suspense>

      {/* Results */}
      {query ? (
        results && results.data.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {results.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 py-20">
            <IconSearch className="mb-4 size-12 text-muted-foreground/30" />
            <p className="font-medium text-muted-foreground">
              Tidak ada produk ditemukan
            </p>
            <p className="mt-1 text-muted-foreground/70 text-sm">
              Coba gunakan kata kunci yang berbeda
            </p>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 py-20">
          <IconSearch className="mb-4 size-12 text-muted-foreground/30" />
          <p className="font-medium text-muted-foreground">
            Masukkan kata kunci untuk mencari produk
          </p>
          <p className="mt-1 text-muted-foreground/70 text-sm">
            Contoh: stiker, banner, undangan
          </p>
        </div>
      )}
    </main>
  );
}

function SearchSkeleton() {
  return <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />;
}
